import test from 'node:test';
import assert from 'node:assert/strict';
import { fitView } from '../js/core/view.js';

const margin = { left: 50, right: 50, top: 50, bottom: 50 };

test('chọn nấc rộng nhỏ nhất đủ chứa vùng cần hiển thị', () => {
  const view = fitView({ width: 600, height: 400, needX: 40, needY: 10, margin });
  assert.equal(view.viewWidth, 50);
  assert.equal(view.scale, 500 / 50);
});

test('nấc rộng tăng khi chiều cao không đủ', () => {
  // khung 500 × 300 px: rộng 50 m thì chỉ cao 30 m, cần 40 m nên phải lên 100 m
  const view = fitView({ width: 600, height: 400, needX: 10, needY: 40, margin });
  assert.equal(view.viewWidth, 100);
});

test('toScreen và toWorld là hai phép ngược nhau, gốc ở góc dưới trái', () => {
  const view = fitView({ width: 600, height: 400, needX: 40, needY: 10, margin });
  assert.deepEqual(view.toScreen({ x: 0, y: 0 }), { x: 50, y: 350 });
  const world = view.toWorld(view.toScreen({ x: 12.5, y: 7 }));
  assert.ok(Math.abs(world.x - 12.5) < 1e-9 && Math.abs(world.y - 7) < 1e-9);
});
