// Các hàm vẽ hay dùng: chữ, mũi tên, hệ trục có lưới.
import { Text } from '../pixi.js';
import { COLOR, LABEL_STYLE } from './theme.js';
import { niceStep } from './view.js';

// Thêm một nhãn chữ vào layer. anchor (0..1) là điểm neo của chữ.
// Text phù hợp khi có ít nhãn; khi có hàng trăm nhãn (ví dụ tên node) nên
// dùng BitmapText vì Text tạo một texture riêng cho mỗi nhãn.
export function addLabel(layer, text, x, y, anchorX = 0, anchorY = 0) {
  const label = new Text({ text, style: LABEL_STYLE });
  label.anchor.set(anchorX, anchorY);
  label.position.set(x, y);
  layer.addChild(label);
  return label;
}

// Vẽ mũi tên từ điểm from, dài (dx, dy) điểm ảnh.
export function drawArrow(graphics, from, dx, dy, color, width = 2) {
  const length = Math.hypot(dx, dy);
  if (length < 1) return;
  const ux = dx / length;
  const uy = dy / length;
  const tip = { x: from.x + dx, y: from.y + dy };
  const head = Math.min(8, length / 2);
  graphics
    .moveTo(from.x, from.y)
    .lineTo(tip.x, tip.y)
    .stroke({ width, color })
    .moveTo(tip.x, tip.y)
    .lineTo(tip.x - ux * head - uy * head * 0.5, tip.y - uy * head + ux * head * 0.5)
    .lineTo(tip.x - ux * head + uy * head * 0.5, tip.y - uy * head - ux * head * 0.5)
    .closePath()
    .fill(color);
}

// Vẽ lưới, trục và số trên trục cho một khung nhìn tạo bởi fitView().
// Xóa nội dung cũ của graphics và labelLayer trước khi vẽ.
// Vạch chia tính theo vùng thế giới đang nhìn thấy, nên vẫn đúng khi khung nhìn
// được phóng to (core/view.js: zoomView). Hai trục vẽ ở mép trái và mép dưới vùng vẽ.
export function drawAxes(graphics, labelLayer, view, { xLabel = 'x', yLabel = 'y', divisions = 5 } = {}) {
  const { margin, width, height, toScreen, toWorld } = view;
  graphics.clear();
  labelLayer.removeChildren().forEach((child) => child.destroy());

  const left = margin.left;
  const right = width - margin.right;
  const top = margin.top;
  const bottom = height - margin.bottom;
  const min = toWorld({ x: left, y: bottom });
  const max = toWorld({ x: right, y: top });
  const step = niceStep((max.x - min.x) / divisions);
  const digits = Math.max(0, -Math.floor(Math.log10(step)));
  const format = (value) => (Math.abs(value) < step / 1e6 ? '0' : value.toFixed(digits));
  const eps = step * 1e-6;

  for (let k = Math.ceil((min.x - eps) / step); k * step <= max.x + eps; k++) {
    const { x } = toScreen({ x: k * step, y: 0 });
    graphics.moveTo(x, top).lineTo(x, bottom);
    addLabel(labelLayer, format(k * step), x, bottom + 6, 0.5, 0);
  }
  for (let k = Math.ceil((min.y - eps) / step); k * step <= max.y + eps; k++) {
    const { y } = toScreen({ x: 0, y: k * step });
    if (Math.abs(y - bottom) > 1) graphics.moveTo(left, y).lineTo(right, y);
    if (y > top + 6) addLabel(labelLayer, format(k * step), left - 8, y, 1, 0.5);
  }
  graphics.stroke({ width: 1, color: COLOR.grid });

  graphics
    .moveTo(left, top)
    .lineTo(left, bottom)
    .lineTo(right, bottom)
    .stroke({ width: 1.5, color: COLOR.axis });

  addLabel(labelLayer, xLabel, right, bottom + 22, 1, 0);
  addLabel(labelLayer, yLabel, left + 6, top, 0, 0);
}
