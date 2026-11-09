import test from 'node:test';
import assert from 'node:assert/strict';
import { measureCurve } from '../benchmark/curve-measure.js';
import { distanceToQuadratic } from '../js/webgl/curve-math.js';

const W = 120;
const H = 80;
const curve = [{ x: 10, y: 70 }, { x: 60, y: -50 }, { x: 110, y: 70 }];

// Tạo ảnh giả: tô mọi điểm ảnh có tâm cách đường cong ≤ r (hàng 0 là hàng dưới cùng).
function render(r, offsetY = 0) {
  const pixels = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const { distance } = distanceToQuadratic({ x: x + 0.5, y: y + 0.5 - offsetY }, ...curve);
      if (distance <= r) pixels[((H - 1 - y) * W + x) * 4 + 3] = 255;
    }
  }
  return pixels;
}

test('ảnh vẽ đúng: sai số 0 và phủ kín đường cong', () => {
  const result = measureCurve(render(1.5), W, H, curve, 1.5);
  assert.equal(result.maxError, 0);
  assert.ok(result.coverage > 99);
});

test('ảnh vẽ lệch 3 px: đo được sai số khoảng 3 px', () => {
  const result = measureCurve(render(1.5, 3), W, H, curve, 1.5);
  assert.ok(result.maxError > 2.5 && result.maxError < 3.5, `maxError = ${result.maxError}`);
});

test('ảnh trống: không có điểm ảnh được tô, độ phủ 0', () => {
  const result = measureCurve(new Uint8Array(W * H * 4), W, H, curve, 1.5);
  assert.equal(result.litPixels, 0);
  assert.equal(result.coverage, 0);
});
