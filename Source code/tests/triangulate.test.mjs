import test from 'node:test';
import assert from 'node:assert/strict';
import { signedArea, triangulate } from '../js/webgl/triangulate.js';

function trianglesArea(points, indices) {
  let total = 0;
  for (let i = 0; i < indices.length; i += 3) {
    total += Math.abs(signedArea([points[indices[i]], points[indices[i + 1]], points[indices[i + 2]]]));
  }
  return total;
}

function star(spikes, outer, inner) {
  return Array.from({ length: spikes * 2 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / spikes;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  });
}

test('hình vuông cho 2 tam giác phủ đúng diện tích', () => {
  const square = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }];
  const indices = triangulate(square);
  assert.equal(indices.length, 6);
  assert.equal(trianglesArea(square, indices), 16);
});

test('đa giác lõm (ngôi sao 7 cánh): n − 2 tam giác, tổng diện tích bằng đa giác', () => {
  const points = star(7, 100, 40);
  const indices = triangulate(points);
  assert.equal(indices.length / 3, points.length - 2);
  assert.ok(Math.abs(trianglesArea(points, indices) - Math.abs(signedArea(points))) < 1e-6);
});

test('không phụ thuộc chiều đi của đỉnh', () => {
  const points = star(5, 50, 20).reverse();
  const indices = triangulate(points);
  assert.equal(indices.length / 3, points.length - 2);
  assert.ok(Math.abs(trianglesArea(points, indices) - Math.abs(signedArea(points))) < 1e-6);
});

test('đa giác hình chữ L (lõm)', () => {
  const points = [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 6 }, { x: 0, y: 6 }];
  const indices = triangulate(points);
  assert.equal(indices.length / 3, 4);
  assert.equal(trianglesArea(points, indices), 20);
});
