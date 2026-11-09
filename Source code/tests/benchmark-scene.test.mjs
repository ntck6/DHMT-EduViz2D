import test from 'node:test';
import assert from 'node:assert/strict';
import { RECT_SIZE, createScene, stepScene, summarize } from '../benchmark/scene.js';

test('cùng hạt giống cho cùng cảnh, để mọi cách vẽ đo trên dữ liệu giống nhau', () => {
  assert.deepEqual(createScene(100, 960, 540, 7).positions, createScene(100, 960, 540, 7).positions);
});

test('hình luôn nằm trong khung sau nhiều bước', () => {
  const scene = createScene(500, 200, 100);
  for (let k = 0; k < 600; k++) stepScene(scene, 1 / 60);
  for (let i = 0; i < scene.count; i++) {
    const x = scene.positions[i * 2];
    const y = scene.positions[i * 2 + 1];
    assert.ok(x >= 0 && x <= 200 - RECT_SIZE && y >= 0 && y <= 100 - RECT_SIZE);
  }
});

test('summarize tính trung bình và p95', () => {
  const samples = Array.from({ length: 100 }, (_, i) => i + 1); // 1..100
  const { mean, p95 } = summarize(samples);
  assert.equal(mean, 50.5);
  assert.equal(p95, 95);
});
