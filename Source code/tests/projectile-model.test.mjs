// Chạy: node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { solveProjectile } from '../js/physics/projectile-model.js';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

test('khớp số tính tay với v0 = 20, θ = 45°, g = 10', () => {
  const s = solveProjectile({ v0: 20, thetaDeg: 45, g: 10 });
  close(s.range, 40);
  close(s.maxHeight, 10);
  close(s.flightTime, 2 * Math.SQRT2);
});

test('vật về y = 0 tại đúng tầm xa R khi t = T', () => {
  for (const thetaDeg of [10, 30, 45, 60, 85]) {
    const s = solveProjectile({ v0: 33, thetaDeg, g: 9.8 });
    const end = s.position(s.flightTime);
    close(end.x, s.range);
    close(end.y, 0);
  }
});

test('điểm cao nhất ở t = T/2, tại đó vy = 0 và y = H', () => {
  const s = solveProjectile({ v0: 25, thetaDeg: 60, g: 1.6 });
  close(s.velocity(s.flightTime / 2).y, 0);
  close(s.position(s.flightTime / 2).y, s.maxHeight);
});

test('hai góc phụ nhau cho cùng tầm xa', () => {
  const a = solveProjectile({ v0: 30, thetaDeg: 30, g: 9.8 });
  const b = solveProjectile({ v0: 30, thetaDeg: 60, g: 9.8 });
  close(a.range, b.range);
});
