import test from 'node:test';
import assert from 'node:assert/strict';
import { distanceToQuadratic, parabolaToBezier, quadPoint, uvTransform } from '../js/webgl/curve-math.js';
import { solveProjectile } from '../js/physics/projectile-model.js';

const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);
const P0 = { x: 0, y: 0 };
const P1 = { x: 50, y: 100 };
const P2 = { x: 100, y: 0 };

test('uvTransform đưa 3 điểm điều khiển về (0,0), (½,0), (1,1)', () => {
  const uv = uvTransform(P0, P1, P2);
  assert.deepEqual(uv(P0), { u: 0, v: 0 });
  near(uv(P1).u, 0.5); near(uv(P1).v, 0);
  near(uv(P2).u, 1); near(uv(P2).v, 1);
});

test('mọi điểm trên đường cong thỏa u² − v = 0 và u = t', () => {
  const uv = uvTransform(P0, P1, P2);
  for (const t of [0, 0.1, 0.33, 0.5, 0.8, 1]) {
    const { u, v } = uv(quadPoint(P0, P1, P2, t));
    near(u * u - v, 0);
    near(u, t);
  }
});

test('điểm phía trong (lõm) cho u² − v < 0, phía ngoài cho > 0', () => {
  const uv = uvTransform(P0, P1, P2);
  const inside = uv({ x: 50, y: 20 }); // dưới đỉnh đường cong (đỉnh ở y = 50)
  const outside = uv({ x: 50, y: 80 });
  assert.ok(inside.u ** 2 - inside.v < 0);
  assert.ok(outside.u ** 2 - outside.v > 0);
});

test('3 điểm thẳng hàng thì không có phép biến đổi (đường cong suy biến)', () => {
  assert.equal(uvTransform({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }), null);
});

test('Bézier từ parabolaToBezier trùng quỹ đạo ném xiên ở mọi thời điểm', () => {
  for (const thetaDeg of [15, 45, 70]) {
    const s = solveProjectile({ v0: 25, thetaDeg, g: 9.8 });
    const [p0, p1, p2] = parabolaToBezier(s);
    for (const k of [0, 0.25, 0.5, 0.75, 1]) {
      const q = quadPoint(p0, p1, p2, k);
      const r = s.position(k * s.flightTime);
      near(q.x, r.x, 1e-9); near(q.y, r.y, 1e-9);
    }
    near(p1.y, 2 * s.maxHeight, 1e-9); // điểm điều khiển ở độ cao 2H
  }
});

test('distanceToQuadratic: điểm trên đường cong cho 0, điểm ngay trên đỉnh cho đúng độ lệch', () => {
  near(distanceToQuadratic(quadPoint(P0, P1, P2, 0.3), P0, P1, P2).distance, 0, 1e-6);
  // Đỉnh đường cong tại (50, 50); điểm (50, 60) cách đúng 10 (pháp tuyến thẳng đứng tại đỉnh).
  near(distanceToQuadratic({ x: 50, y: 60 }, P0, P1, P2).distance, 10, 1e-6);
  // Ngoài đầu mút: khoảng cách tới P0.
  near(distanceToQuadratic({ x: -3, y: -4 }, P0, P1, P2).distance, 5, 1e-6);
});
