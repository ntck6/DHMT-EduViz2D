// Mô hình ném xiên bỏ qua lực cản, vật rơi về cùng độ cao lúc ném.
// Công thức: OpenStax University Physics Volume 1, mục 4.3.
export function solveProjectile({ v0, thetaDeg, g }) {
  const theta = (thetaDeg * Math.PI) / 180;
  const vx = v0 * Math.cos(theta);
  const vy0 = v0 * Math.sin(theta);

  return {
    flightTime: (2 * vy0) / g,
    range: (v0 * v0 * Math.sin(2 * theta)) / g,
    maxHeight: (vy0 * vy0) / (2 * g),
    position: (t) => ({ x: vx * t, y: vy0 * t - 0.5 * g * t * t }),
    velocity: (t) => ({ x: vx, y: vy0 - g * t }),
  };
}
