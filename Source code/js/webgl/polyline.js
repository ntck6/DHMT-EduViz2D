// Mốc so sánh cho Loop & Blinn: vẽ đường cong theo cách thông thường, tức chia
// thành N đoạn thẳng, mỗi đoạn là một hình chữ nhật (2 tam giác) có bề rộng bằng nét vẽ.
// Vẽ bằng WebGL thuần giống Loop & Blinn để so sánh công bằng; khử răng cưa nhờ
// MSAA của context (antialias: true).
//
//   const line = createPolylineRenderer(gl);
//   line.draw(points, { projection, width: 2.5, color: 0x2563eb });  // points: điểm ảnh
import { createBuffer, createProgram } from './gl-utils.js';

const VERTEX = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aPosition;
uniform mat3 uProjection;
void main() {
  gl_Position = vec4((uProjection * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `#version 300 es
precision mediump float;
uniform vec4 uColor;
out vec4 outColor;
void main() {
  outColor = vec4(uColor.rgb * uColor.a, uColor.a);
}
`;

// Mỗi đoạn → 6 đỉnh (2 tam giác). Kéo dài mỗi đoạn thêm nửa nét ở hai đầu để các
// đoạn liền nhau không hở ở chỗ nối.
export function strokeTriangles(points, halfWidth) {
  const out = new Float32Array((points.length - 1) * 12);
  let o = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const dx = ((b.x - a.x) / length) * halfWidth;
    const dy = ((b.y - a.y) / length) * halfWidth;
    const nx = -dy; // pháp tuyến
    const ny = dx;
    const a1 = [a.x - dx + nx, a.y - dy + ny];
    const a2 = [a.x - dx - nx, a.y - dy - ny];
    const b1 = [b.x + dx + nx, b.y + dy + ny];
    const b2 = [b.x + dx - nx, b.y + dy - ny];
    out.set([...a1, ...a2, ...b1, ...b1, ...a2, ...b2], o);
    o += 12;
  }
  return out;
}

export function createPolylineRenderer(gl) {
  const program = createProgram(gl, VERTEX, FRAGMENT);
  const uProjection = gl.getUniformLocation(program, 'uProjection');
  const uColor = gl.getUniformLocation(program, 'uColor');
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buffer = createBuffer(gl, gl.ARRAY_BUFFER, 4, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  let vertexCount = 0;

  return {
    get vertexCount() { return vertexCount; },

    draw(points, { projection, width = 2, color = 0x2563eb, alpha = 1 }) {
      if (points.length < 2) return;
      const vertices = strokeTriangles(points, width / 2);
      vertexCount = vertices.length / 2;
      gl.useProgram(program);
      gl.uniformMatrix3fv(uProjection, false, projection);
      gl.uniform4fv(uColor, [((color >> 16) & 255) / 255, ((color >> 8) & 255) / 255, (color & 255) / 255, alpha]);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
      gl.bindVertexArray(null);
    },
  };
}
