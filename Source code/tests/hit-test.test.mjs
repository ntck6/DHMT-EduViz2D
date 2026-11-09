import test from 'node:test';
import assert from 'node:assert/strict';
import { barIndexAt, barLayout, cellAt, isSorted, valueAtY } from '../js/core/hit-test.js';
import { colorToId, idToColor } from '../js/webgl/picking.js';

const layout = barLayout({ width: 120, height: 120, count: 10, margin: 10 }); // mỗi cột rộng 10 px

test('barIndexAt: tìm đúng cột, ngoài vùng cột trả -1', () => {
  assert.equal(barIndexAt(layout, 10), 0);
  assert.equal(barIndexAt(layout, 19.9), 0);
  assert.equal(barIndexAt(layout, 20), 1);
  assert.equal(barIndexAt(layout, 109.9), 9);
  assert.equal(barIndexAt(layout, 5), -1);
  assert.equal(barIndexAt(layout, 110), -1);
});

test('valueAtY: đáy là 0, đỉnh là 1, ngoài khung bị kẹp lại', () => {
  assert.equal(valueAtY(layout, 110), 0);
  assert.equal(valueAtY(layout, 10), 1);
  assert.equal(valueAtY(layout, 60), 0.5);
  assert.equal(valueAtY(layout, 500), 0);
});

test('cellAt: tìm ô lưới', () => {
  const grid = { left: 0, top: 0, cellSize: 20, cols: 5, rows: 3 };
  assert.deepEqual(cellAt(grid, 45, 25), { col: 2, row: 1 });
  assert.equal(cellAt(grid, 100, 10), null);
});

test('isSorted', () => {
  assert.equal(isSorted([1, 2, 2, 5]), true);
  assert.equal(isSorted([1, 3, 2]), false);
});

test('màu mã của GPU picking giải mã lại đúng số thứ tự', () => {
  for (const id of [0, 1, 254, 255, 256, 65535, 100000, 16777214]) {
    const [r, g, b] = idToColor(id).map((c) => Math.round(c * 255));
    assert.equal(colorToId(r, g, b), id);
  }
  assert.equal(colorToId(0, 0, 0), -1); // nền
});
