import test from 'node:test';
import assert from 'node:assert/strict';
import { identity, invert, multiply, ortho2D, rotate, scale, transformPoint, translate } from '../js/webgl/matrix.js';

const near = (actual, expected) => {
  assert.ok(Math.abs(actual.x - expected.x) < 1e-6 && Math.abs(actual.y - expected.y) < 1e-6,
    `(${actual.x}, ${actual.y}) != (${expected.x}, ${expected.y})`);
};

test('ortho2D đưa các góc khung điểm ảnh về góc clip space', () => {
  const m = ortho2D(800, 600);
  near(transformPoint(m, { x: 0, y: 0 }), { x: -1, y: 1 });      // trên trái
  near(transformPoint(m, { x: 800, y: 600 }), { x: 1, y: -1 });  // dưới phải
  near(transformPoint(m, { x: 400, y: 300 }), { x: 0, y: 0 });   // tâm
});

test('multiply(a, b) áp dụng b trước rồi tới a', () => {
  const m = multiply(translate(10, 0), scale(2));
  near(transformPoint(m, { x: 1, y: 1 }), { x: 12, y: 2 });
  const n = multiply(scale(2), translate(10, 0));
  near(transformPoint(n, { x: 1, y: 1 }), { x: 22, y: 2 });
});

test('rotate quay ngược chiều kim đồng hồ theo hệ trục toán học', () => {
  near(transformPoint(rotate(Math.PI / 2), { x: 1, y: 0 }), { x: 0, y: 1 });
});

test('invert cho ma trận nghịch đảo', () => {
  const m = multiply(translate(30, -5), rotate(0.7), scale(1.5, 0.5));
  const p = { x: 3, y: 4 };
  near(transformPoint(invert(m), transformPoint(m, p)), p);
  near(transformPoint(multiply(m, invert(m)), p), transformPoint(identity(), p));
});
