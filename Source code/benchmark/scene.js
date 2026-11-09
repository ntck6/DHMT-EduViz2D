// Cảnh dùng chung cho mọi cách vẽ: N hình vuông nhỏ chuyển động, nảy ở mép khung.
// Vị trí tính trên CPU giống hệt nhau cho cả 3 cách vẽ, nên chỉ phần vẽ là khác.
// Không dùng DOM nên kiểm tra được bằng node --test.

export const RECT_SIZE = 4; // cạnh hình vuông (điểm ảnh)
export const PALETTE = [0x2563eb, 0xdc2626, 0x16a34a, 0xea580c];

// Bộ sinh số ngẫu nhiên có hạt giống: cùng hạt giống → cùng cảnh ở mọi lần chạy.
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createScene(count, width, height, seed = 1) {
  const random = mulberry32(seed);
  const positions = new Float32Array(count * 2);
  const velocities = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    positions[i * 2] = random() * (width - RECT_SIZE);
    positions[i * 2 + 1] = random() * (height - RECT_SIZE);
    const angle = random() * Math.PI * 2;
    const speed = 40 + random() * 80; // điểm ảnh / giây
    velocities[i * 2] = Math.cos(angle) * speed;
    velocities[i * 2 + 1] = Math.sin(angle) * speed;
  }
  return { count, width, height, positions, velocities };
}

export function stepScene(scene, dt) {
  const { count, width, height, positions, velocities } = scene;
  const maxX = width - RECT_SIZE;
  const maxY = height - RECT_SIZE;
  for (let i = 0; i < count; i++) {
    const ix = i * 2;
    const iy = ix + 1;
    let x = positions[ix] + velocities[ix] * dt;
    let y = positions[iy] + velocities[iy] * dt;
    if (x < 0 || x > maxX) {
      velocities[ix] = -velocities[ix];
      x = Math.min(Math.max(x, 0), maxX);
    }
    if (y < 0 || y > maxY) {
      velocities[iy] = -velocities[iy];
      y = Math.min(Math.max(y, 0), maxY);
    }
    positions[ix] = x;
    positions[iy] = y;
  }
}

// Thống kê thời gian khung hình: trung bình và phân vị 95 (p95).
export function summarize(samples) {
  if (samples.length === 0) return { mean: 0, p95: 0 };
  const sorted = [...samples].sort((a, b) => a - b);
  const mean = samples.reduce((sum, v) => sum + v, 0) / samples.length;
  const p95 = sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)];
  return { mean, p95 };
}
