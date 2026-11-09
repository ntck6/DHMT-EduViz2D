// Toán cho đường cong Bézier bậc 2 dùng trong phương pháp Loop & Blinn (2005).
// Không dùng DOM nên kiểm tra được bằng node --test.
//
// Bézier bậc 2 với 3 điểm điều khiển P0, P1, P2:
//   B(t) = (1 − t)² P0 + 2t(1 − t) P1 + t² P2,   0 ≤ t ≤ 1
// Loop & Blinn gán tọa độ (u, v) cho 3 điểm: P0 → (0, 0), P1 → (½, 0), P2 → (1, 1).
// Vì (u, v) là hàm affine của (x, y), trên đường cong ta có u = t, v = t², tức
// đường cong là tập điểm thỏa u² − v = 0. GPU nội suy (u, v) cho từng điểm ảnh,
// fragment shader chỉ cần tính dấu và độ lớn của u² − v.

export function quadPoint(p0, p1, p2, t) {
  const a = (1 - t) * (1 - t);
  const b = 2 * t * (1 - t);
  const c = t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x, y: a * p0.y + b * p1.y + c * p2.y };
}

// Quỹ đạo ném xiên (không lực cản) là một parabol nên trùng khít một Bézier bậc 2.
// Với tham số s = t / T: B(0) = vị trí lúc ném, B(1) = vị trí lúc rơi, và
// B'(0) = 2 (P1 − P0) = T · v(0)  ⇒  P1 = P0 + v(0) · T / 2.
export function parabolaToBezier(solution) {
  const T = solution.flightTime;
  const p0 = solution.position(0);
  const v0 = solution.velocity(0);
  return [p0, { x: p0.x + (v0.x * T) / 2, y: p0.y + (v0.y * T) / 2 }, solution.position(T)];
}

// Phép biến đổi affine (x, y) → (u, v) với P0 → (0, 0), P1 → (½, 0), P2 → (1, 1).
// Trả về null nếu 3 điểm thẳng hàng (đường cong suy biến thành đoạn thẳng).
export function uvTransform(p0, p1, p2) {
  const e1 = { x: p1.x - p0.x, y: p1.y - p0.y };
  const e2 = { x: p2.x - p0.x, y: p2.y - p0.y };
  const det = e1.x * e2.y - e2.x * e1.y;
  const scale = Math.max(Math.hypot(e1.x, e1.y), Math.hypot(e2.x, e2.y)) ** 2;
  if (Math.abs(det) <= 1e-9 * scale) return null;

  // Nghịch đảo của ma trận cột [e1 e2].
  const i00 = e2.y / det;
  const i01 = -e2.x / det;
  const i10 = -e1.y / det;
  const i11 = e1.x / det;
  // (u, v) = [[½, 1], [0, 1]] · inverse([e1 e2]) · (p − P0)
  const m00 = 0.5 * i00 + i10;
  const m01 = 0.5 * i01 + i11;
  const m10 = i10;
  const m11 = i11;
  return ({ x, y }) => {
    const dx = x - p0.x;
    const dy = y - p0.y;
    return { u: m00 * dx + m01 * dy, v: m10 * dx + m11 * dy };
  };
}

// Khoảng cách từ điểm p tới đoạn Bézier (0 ≤ t ≤ 1): lấy mẫu để tìm vùng gần nhất,
// rồi thu hẹp bằng tìm kiếm tam phân. Dùng làm "đáp án đúng" khi đo sai số.
export function distanceToQuadratic(p, p0, p1, p2, samples = 64) {
  const dist = (t) => {
    const q = quadPoint(p0, p1, p2, t);
    return Math.hypot(q.x - p.x, q.y - p.y);
  };
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i <= samples; i++) {
    const d = dist(i / samples);
    if (d < bestDist) {
      bestDist = d;
      best = i / samples;
    }
  }
  let lo = Math.max(0, best - 1 / samples);
  let hi = Math.min(1, best + 1 / samples);
  for (let k = 0; k < 40; k++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (dist(m1) < dist(m2)) hi = m2;
    else lo = m1;
  }
  const t = (lo + hi) / 2;
  return { distance: Math.min(dist(t), bestDist), t };
}

// Hộp bao (theo trục) của 3 điểm điều khiển; đường cong luôn nằm trong tam giác P0 P1 P2.
export function controlBounds(points, margin = 0) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    minX: Math.min(...xs) - margin,
    minY: Math.min(...ys) - margin,
    maxX: Math.max(...xs) + margin,
    maxY: Math.max(...ys) + margin,
  };
}
