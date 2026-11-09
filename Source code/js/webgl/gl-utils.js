// Các bước dùng WebGL thuần, không qua thư viện. Mỗi hàm ứng với một bước của
// pipeline trình bày ở Ch.3: lấy context → biên dịch shader → liên kết program →
// tạo buffer → gán kích thước vùng vẽ.

export function getWebGL2(canvas, options = {}) {
  const gl = canvas.getContext('webgl2', { antialias: true, premultipliedAlpha: true, ...options });
  if (!gl) throw new Error('Trình duyệt không hỗ trợ WebGL 2');
  return gl;
}

// Biên dịch một shader. Khi lỗi, in kèm số dòng để dễ tìm chỗ sai trong GLSL.
export function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source.trim());
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    const numbered = source.trim().split('\n').map((line, i) => `${String(i + 1).padStart(3)}| ${line}`).join('\n');
    gl.deleteShader(shader);
    const kind = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment';
    throw new Error(`Lỗi biên dịch ${kind} shader:\n${log}\n${numbered}`);
  }
  return shader;
}

// Liên kết vertex shader và fragment shader thành một program chạy trên GPU.
export function createProgram(gl, vertexSource, fragmentSource) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Lỗi liên kết program:\n${log}`);
  }
  return program;
}

// Tạo buffer trên GPU và nạp dữ liệu ban đầu.
//   target: gl.ARRAY_BUFFER (đỉnh) hoặc gl.ELEMENT_ARRAY_BUFFER (chỉ số)
//   usage:  gl.STATIC_DRAW (ít đổi) hoặc gl.DYNAMIC_DRAW (đổi mỗi khung hình)
export function createBuffer(gl, target, data, usage = gl.STATIC_DRAW) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, usage);
  return buffer;
}

// Canvas có hai kích thước: kích thước hiển thị (CSS px) và số điểm ảnh thật
// (nhân devicePixelRatio). Phải đặt cả hai để hình không bị mờ trên màn hình độ phân giải cao.
export function resizeToDisplay(gl, cssWidth, cssHeight, pixelRatio = window.devicePixelRatio || 1) {
  const canvas = gl.canvas;
  const width = Math.max(1, Math.round(cssWidth * pixelRatio));
  const height = Math.max(1, Math.round(cssHeight * pixelRatio));
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  gl.viewport(0, 0, width, height);
}

// Đếm số lệnh vẽ gửi tới GPU mỗi khung hình (dùng cho bài pipeline và benchmark).
// Bọc các hàm vẽ của context; gọi counter.reset() đầu mỗi khung hình.
export function countDrawCalls(gl) {
  const counter = { calls: 0, reset() { this.calls = 0; } };
  for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
    const original = gl[name].bind(gl);
    gl[name] = (...args) => {
      counter.calls += 1;
      return original(...args);
    };
  }
  return counter;
}
