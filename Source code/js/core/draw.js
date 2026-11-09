// Các hàm vẽ hay dùng: chữ, mũi tên, hệ trục có lưới.
import { Text } from '../pixi.js';
import { COLOR, LABEL_STYLE } from './theme.js';

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
export function drawAxes(graphics, labelLayer, view, { xLabel = 'x', yLabel = 'y', divisions = 5 } = {}) {
  const { margin, width, viewWidth, toScreen } = view;
  graphics.clear();
  labelLayer.removeChildren().forEach((child) => child.destroy());

  const step = viewWidth / divisions;
  const origin = toScreen({ x: 0, y: 0 });

  for (let i = 0; i <= divisions; i++) {
    const { x } = toScreen({ x: i * step, y: 0 });
    graphics.moveTo(x, margin.top).lineTo(x, origin.y);
    addLabel(labelLayer, formatTick(i * step), x, origin.y + 6, 0.5, 0);
  }
  for (let i = 1; ; i++) {
    const { y } = toScreen({ x: 0, y: i * step });
    if (y < margin.top) break;
    graphics.moveTo(margin.left, y).lineTo(width - margin.right, y);
    addLabel(labelLayer, formatTick(i * step), margin.left - 8, y, 1, 0.5);
  }
  graphics.stroke({ width: 1, color: COLOR.grid });

  graphics
    .moveTo(margin.left, margin.top)
    .lineTo(margin.left, origin.y)
    .lineTo(width - margin.right, origin.y)
    .stroke({ width: 1.5, color: COLOR.axis });

  addLabel(labelLayer, xLabel, width - margin.right, origin.y + 22, 1, 0);
  addLabel(labelLayer, yLabel, margin.left + 6, margin.top, 0, 0);
}

function formatTick(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
