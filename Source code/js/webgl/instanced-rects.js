// Vẽ N hình chữ nhật bằng MỘT lệnh drawArraysInstanced.
//
// Cách làm:
//   - Một hình vuông đơn vị (2 tam giác, 6 đỉnh) nằm sẵn trên GPU, dùng chung.
//   - Một buffer "theo thể hiện" chứa x, y, w, h, r, g, b, a của từng hình.
//     vertexAttribDivisor(…, 1) báo GPU: mỗi hình (instance) lấy một bộ giá trị.
//   - Vertex shader co giãn hình vuông theo (w, h), dời tới (x, y), rồi nhân ma
//     trận chiếu để ra clip space.
// So với vẽ từng hình một (N lệnh vẽ), CPU chỉ gửi 1 lệnh nên vẽ được rất nhiều hình.
//
//   const rects = createInstancedRects(gl);
//   rects.update(data, count);   // data: Float32Array, mỗi hình 8 số (FLOATS_PER_RECT)
//   rects.draw(ortho2D(width, height));
import { createBuffer, createProgram } from './gl-utils.js';

export const FLOATS_PER_RECT = 8; // x, y, w, h, r, g, b, a

const VERTEX = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aCorner; // góc của hình vuông đơn vị (0..1)
layout(location = 1) in vec4 aRect;   // x, y, w, h tính bằng điểm ảnh
layout(location = 2) in vec4 aColor;  // r, g, b, a (0..1)

uniform mat3 uProjection;
out vec4 vColor;

void main() {
  vec2 position = aRect.xy + aCorner * aRect.zw;
  gl_Position = vec4((uProjection * vec3(position, 1.0)).xy, 0.0, 1.0);
  vColor = aColor;
}
`;

const FRAGMENT = /* glsl */ `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 outColor;

void main() {
  outColor = vec4(vColor.rgb * vColor.a, vColor.a); // màu đã nhân alpha (premultiplied)
}
`;

const UNIT_SQUARE = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

export function createInstancedRects(gl, initialCapacity = 1024) {
  const program = createProgram(gl, VERTEX, FRAGMENT);
  const uProjection = gl.getUniformLocation(program, 'uProjection');

  // VAO ghi nhớ cách đọc các buffer, mỗi lần vẽ chỉ cần bind lại VAO.
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  createBuffer(gl, gl.ARRAY_BUFFER, UNIT_SQUARE);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  let capacity = initialCapacity;
  const instanceBuffer = createBuffer(gl, gl.ARRAY_BUFFER, capacity * FLOATS_PER_RECT * 4, gl.DYNAMIC_DRAW);
  const stride = FLOATS_PER_RECT * 4;
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, stride, 0);
  gl.vertexAttribDivisor(1, 1);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 4, gl.FLOAT, false, stride, 16);
  gl.vertexAttribDivisor(2, 1);

  gl.bindVertexArray(null);

  let count = 0;

  return {
    // Nạp dữ liệu hình mới lên GPU. Buffer tự nới rộng khi số hình vượt sức chứa.
    update(data, rectCount = data.length / FLOATS_PER_RECT) {
      count = rectCount;
      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
      if (rectCount > capacity) {
        capacity = Math.max(rectCount, capacity * 2);
        gl.bufferData(gl.ARRAY_BUFFER, capacity * FLOATS_PER_RECT * 4, gl.DYNAMIC_DRAW);
      }
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data, 0, rectCount * FLOATS_PER_RECT);
    },

    draw(projection) {
      if (count === 0) return;
      gl.useProgram(program);
      gl.uniformMatrix3fv(uProjection, false, projection);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindVertexArray(vao);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
      gl.bindVertexArray(null);
    },

    get count() { return count; },
  };
}

// Ghi một hình vào mảng dữ liệu tại vị trí index. color: số hex như 0x2563eb.
export function writeRect(data, index, x, y, w, h, color, alpha = 1) {
  const o = index * FLOATS_PER_RECT;
  data[o] = x;
  data[o + 1] = y;
  data[o + 2] = w;
  data[o + 3] = h;
  data[o + 4] = ((color >> 16) & 255) / 255;
  data[o + 5] = ((color >> 8) & 255) / 255;
  data[o + 6] = (color & 255) / 255;
  data[o + 7] = alpha;
}
