// Chọn đối tượng bằng tính toán: từ vị trí chuột suy ra phần tử nào đang được trỏ tới.
// Dùng khi các phần tử xếp đều (cột, ô lưới) nên tính thẳng được, không cần GPU.
// (Đối tượng có hình bất kỳ thì dùng webgl/picking.js.) Không dùng DOM nên kiểm tra
// được bằng node --test.

// Bố cục N cột trong khung vẽ, cách mép margin điểm ảnh.
export function barLayout({ width, height, count, margin = 16 }) {
  const plotW = Math.max(width - margin * 2, 1);
  const plotH = Math.max(height - margin * 2, 1);
  return { left: margin, top: margin, plotW, plotH, count, barW: plotW / count };
}

// Chỉ số cột tại hoành độ x, hoặc -1 nếu nằm ngoài vùng cột.
export function barIndexAt(layout, x) {
  const index = Math.floor((x - layout.left) / layout.barW);
  return index >= 0 && index < layout.count ? index : -1;
}

// Giá trị (0..1) ứng với tung độ y: đáy khung là 0, đỉnh khung là 1.
export function valueAtY(layout, y) {
  return Math.min(Math.max((layout.top + layout.plotH - y) / layout.plotH, 0), 1);
}

// Ô lưới tại (x, y) với lưới bắt đầu ở (left, top), mỗi ô cạnh cellSize.
export function cellAt({ left, top, cellSize, cols, rows }, x, y) {
  const col = Math.floor((x - left) / cellSize);
  const row = Math.floor((y - top) / cellSize);
  return col >= 0 && col < cols && row >= 0 && row < rows ? { col, row } : null;
}

export function isSorted(values) {
  for (let i = 1; i < values.length; i++) if (values[i - 1] > values[i]) return false;
  return true;
}
