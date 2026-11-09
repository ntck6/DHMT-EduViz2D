// Ma trận 3×3 cho biến đổi 2D (tọa độ thuần nhất), lưu theo cột (column-major)
// đúng thứ tự gl.uniformMatrix3fv cần. Không dùng DOM nên kiểm tra được bằng node --test.
//
//   | a  c  tx |      mảng: [a, b, 0,  c, d, 0,  tx, ty, 1]
//   | b  d  ty |
//   | 0  0  1  |

export function identity() {
  return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

// Đổi tọa độ điểm ảnh (gốc trên trái, y hướng xuống) sang clip space của WebGL
// (gốc ở giữa, mỗi trục từ -1 đến 1, y hướng lên).
export function ortho2D(width, height) {
  return new Float32Array([2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1]);
}

export function translate(tx, ty) {
  return new Float32Array([1, 0, 0, 0, 1, 0, tx, ty, 1]);
}

export function rotate(radians) {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return new Float32Array([c, s, 0, -s, c, 0, 0, 0, 1]);
}

export function scale(sx, sy = sx) {
  return new Float32Array([sx, 0, 0, 0, sy, 0, 0, 0, 1]);
}

// Tích a · b: áp dụng b trước rồi tới a. Nhận nhiều ma trận: multiply(a, b, c) = a · b · c.
export function multiply(a, b, ...rest) {
  const out = new Float32Array(9);
  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 3; row++) {
      out[col * 3 + row] =
        a[row] * b[col * 3] + a[3 + row] * b[col * 3 + 1] + a[6 + row] * b[col * 3 + 2];
    }
  }
  return rest.length ? multiply(out, ...rest) : out;
}

// Ma trận nghịch đảo của một phép biến đổi affine 2D (hàng cuối là 0 0 1).
export function invert(m) {
  const [a, b, , c, d, , tx, ty] = m;
  const det = a * d - b * c;
  if (Math.abs(det) < 1e-12) throw new Error('Ma trận suy biến, không nghịch đảo được');
  const ia = d / det;
  const ib = -b / det;
  const ic = -c / det;
  const id = a / det;
  return new Float32Array([ia, ib, 0, ic, id, 0, -(ia * tx + ic * ty), -(ib * tx + id * ty), 1]);
}

export function transformPoint(m, { x, y }) {
  return { x: m[0] * x + m[3] * y + m[6], y: m[1] * x + m[4] * y + m[7] };
}
