// Phương pháp chính của Ch.3: vẽ đường cong Bézier bậc 2 bằng GPU theo
// Loop & Blinn (2005), "Resolution independent curve rendering using programmable
// graphics hardware", ACM TOG 24(3). DOI 10.1145/1073204.1073303.
//
// Ý tưởng (xem js/webgl/curve-math.js); § là mục trong bài báo:
//   - §3: gán (u, v) = (0, 0), (½, 0), (1, 1) cho P0, P1, P2. GPU nội suy (u, v) cho
//     từng điểm ảnh; fragment shader tính f = u² − v (f = 0 đúng trên đường cong,
//     f < 0 ở phía lồi). Vì tính lại ở từng điểm ảnh nên phóng to bao nhiêu đường
//     cong vẫn mịn ("độc lập độ phân giải").
//   - §5: khoảng cách gần đúng tới đường cong d ≈ f / |∇f|, ∇f theo tọa độ điểm ảnh
//     lấy bằng quy tắc dây chuyền từ dFdx/dFdy. Độ phủ = clamp(w/2 + 0.5 − |d|, 0, 1),
//     một "hàm trộn đơn giản" mà §5 cho phép.
//   - §7: sửa shader để vẽ nét (biên) có độ dày thay vì tô vùng – đúng như ở đây.
// Hai điểm KHÁC bài báo (ghi trong báo cáo, mục 3.3.5):
//   - Hình bao là hộp chữ nhật quanh 3 điểm + lề, không phải tam giác P0 P1 P2, vì
//     nét vẽ tràn ra ngoài tam giác ở phía lồi.
//   - Cắt hai đầu mút bằng 0 ≤ u ≤ 1 (nhóm thêm), vì u² − v = 0 mô tả cả parabol vô hạn.
//
//   const curve = createCurveRenderer(gl);
//   curve.draw([p0, p1, p2], { projection, width: 2.5, color: 0x2563eb });  // tọa độ điểm ảnh
import { createBuffer, createProgram } from './gl-utils.js';
import { controlBounds, uvTransform } from './curve-math.js';

const VERTEX = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aPosition; // góc tứ giác (điểm ảnh)
layout(location = 1) in vec2 aUV;       // tọa độ Loop & Blinn của góc đó
uniform mat3 uProjection;
out vec2 vUV;

void main() {
  gl_Position = vec4((uProjection * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
  vUV = aUV;
}
`;

const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUV;
uniform float uHalfWidth; // nửa bề rộng nét (điểm ảnh)
uniform vec4 uColor;
out vec4 outColor;

void main() {
  float u = vUV.x;
  float v = vUV.y;

  // Đạo hàm của u, v theo trục x và y màn hình (GPU tính từ các điểm ảnh lân cận).
  vec2 du = vec2(dFdx(u), dFdy(u));
  vec2 dv = vec2(dFdx(v), dFdy(v));

  // f = u² − v và gradient của nó theo tọa độ màn hình (quy tắc đạo hàm hàm hợp).
  float f = u * u - v;
  vec2 gradient = 2.0 * u * du - dv;
  float distance = f / max(length(gradient), 1e-6); // khoảng cách gần đúng (điểm ảnh)

  float coverage = clamp(uHalfWidth + 0.5 - abs(distance), 0.0, 1.0);

  // Cắt hai đầu mút: chỉ giữ 0 ≤ u ≤ 1 (u chạy theo tham số t của đường cong).
  float duLength = max(length(du), 1e-6);
  coverage *= clamp(u / duLength + 0.5, 0.0, 1.0);
  coverage *= clamp((1.0 - u) / duLength + 0.5, 0.0, 1.0);

  if (coverage <= 0.0) discard;
  outColor = vec4(uColor.rgb * uColor.a * coverage, uColor.a * coverage); // màu đã nhân alpha
}
`;

function rgba(color, alpha = 1) {
  return [((color >> 16) & 255) / 255, ((color >> 8) & 255) / 255, (color & 255) / 255, alpha];
}

export function createCurveRenderer(gl) {
  const program = createProgram(gl, VERTEX, FRAGMENT);
  const uProjection = gl.getUniformLocation(program, 'uProjection');
  const uHalfWidth = gl.getUniformLocation(program, 'uHalfWidth');
  const uColor = gl.getUniformLocation(program, 'uColor');

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buffer = createBuffer(gl, gl.ARRAY_BUFFER, 4 * 4 * 4, gl.DYNAMIC_DRAW); // 4 đỉnh × (x, y, u, v)
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
  gl.bindVertexArray(null);

  const data = new Float32Array(16);

  return {
    vertexCount: 4,

    // points: [p0, p1, p2] theo điểm ảnh. Trả về false nếu đường cong suy biến
    // (3 điểm thẳng hàng) để nơi gọi tự vẽ bằng cách khác.
    draw(points, { projection, width = 2, color = 0x2563eb, alpha = 1 }) {
      const toUV = uvTransform(...points);
      if (!toUV) return false;

      // Tứ giác = hộp bao 3 điểm điều khiển + lề đủ chứa nét vẽ và phần khử răng cưa.
      const box = controlBounds(points, width / 2 + 2);
      const corners = [
        { x: box.minX, y: box.minY },
        { x: box.maxX, y: box.minY },
        { x: box.minX, y: box.maxY },
        { x: box.maxX, y: box.maxY },
      ];
      corners.forEach((corner, i) => {
        const { u, v } = toUV(corner);
        data.set([corner.x, corner.y, u, v], i * 4);
      });

      gl.useProgram(program);
      gl.uniformMatrix3fv(uProjection, false, projection);
      gl.uniform1f(uHalfWidth, width / 2);
      gl.uniform4fv(uColor, rgba(color, alpha));
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindVertexArray(null);
      return true;
    },
  };
}
