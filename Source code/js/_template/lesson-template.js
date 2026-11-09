// BÀI MẪU – sao chép file này khi bắt đầu một bài mới.
// Chỉ hiện trong menu khi mở trang với ?dev (ví dụ http://localhost:5173/?dev#template).
//
// Bài mẫu: một chấm quay đều quanh tâm. Dùng đủ các helper của khung:
//   view.js      fitView: đổi tọa độ thế giới (mét) ↔ điểm ảnh
//   draw.js      drawAxes, drawArrow, addLabel
//   drag.js      makeDraggable: kéo tâm quay bằng chuột
//   playback.js  createPlayback: Play / Pause / Reset / Step + tốc độ
//   controls     slider, checkbox, select, readout, note
//
// Hợp đồng của một bài học:
//   export function mount({ root, app, controls, width, height }) {
//     // root: Container riêng của bài, mọi thứ vẽ thì addChild vào đây.
//     //       Khung tự xóa root khi chuyển bài, không cần tự destroy.
//     // controls: bảng điều khiển bên phải (xem core/controls.js).
//     // width, height: kích thước khung vẽ (điểm ảnh).
//     return {
//       update(dt) {},            // gọi mỗi khung hình, dt tính bằng giây
//       resize(width, height) {}, // khi khung vẽ đổi kích thước
//       destroy() {},             // tùy chọn: chỉ cần khi có timer, listener ngoài PixiJS
//     };
//   }
import { Container, Graphics } from '../pixi.js';
import { COLOR } from '../core/theme.js';
import { fitView } from '../core/view.js';
import { drawArrow, drawAxes } from '../core/draw.js';
import { makeDraggable } from '../core/drag.js';
import { createPlayback } from '../core/playback.js';

const WORLD_SIZE = 10; // khung nhìn rộng ít nhất 10 m × 10 m

export function mount({ root, controls, width, height }) {
  // 1. Trạng thái của bài (nên tách sang file *-model.js nếu có công thức cần kiểm tra).
  const state = { center: { x: 5, y: 5 }, radius: 2, omega: 1.5, angle: 0, showVelocity: true };
  let view = fitView({ width, height, needX: WORLD_SIZE, needY: WORLD_SIZE });

  // 2. Các lớp vẽ: lớp dưới vẽ trước. Tách lớp tĩnh (hệ trục) và lớp động
  //    (vật chuyển động) để mỗi khung hình chỉ vẽ lại lớp động.
  const axes = new Graphics();
  const axisLabels = new Container();
  const body = new Graphics();
  const centerHandle = new Graphics().circle(0, 0, 9).fill(COLOR.primary);
  root.addChild(axes, axisLabels, body, centerHandle);

  // 3. Hàm vẽ.
  function drawStatic() {
    drawAxes(axes, axisLabels, view, { xLabel: 'x (m)', yLabel: 'y (m)' });
    const c = view.toScreen(state.center);
    centerHandle.position.set(c.x, c.y);
  }

  function drawDynamic() {
    const { center, radius, angle, omega } = state;
    const c = view.toScreen(center);
    const p = view.toScreen({ x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) });
    body.clear();
    body.circle(c.x, c.y, radius * view.scale).stroke({ width: 1, color: COLOR.muted });
    if (state.showVelocity) {
      const speedPx = omega * radius * view.scale * 0.5; // vector vận tốc, thu nhỏ một nửa cho dễ nhìn
      drawArrow(body, p, -Math.sin(angle) * speedPx, -Math.cos(angle) * speedPx, COLOR.orange);
    }
    body.circle(p.x, p.y, 7).fill(COLOR.accent);
    showAngle(`${((angle * 180) / Math.PI % 360).toFixed(0)}°`);
  }

  // 4. Kéo-thả: pos là điểm ảnh, đổi sang mét rồi giới hạn trong khung nhìn.
  makeDraggable(centerHandle, {
    onDrag: (pos) => {
      const world = view.toWorld(pos);
      state.center = {
        x: Math.min(Math.max(world.x, 0), view.viewWidth),
        y: Math.min(Math.max(world.y, 0), view.viewHeight),
      };
      drawStatic();
      drawDynamic();
    },
  });

  // 5. Bảng điều khiển.
  controls.heading('Tham số');
  controls.slider({ label: 'Bán kính r', min: 0.5, max: 4, step: 0.1, value: state.radius, unit: 'm', onInput: (v) => { state.radius = v; drawDynamic(); } });
  controls.slider({ label: 'Tốc độ góc ω', min: 0.2, max: 6, step: 0.1, value: state.omega, unit: 'rad/s', onInput: (v) => { state.omega = v; } });
  controls.select('Chiều quay', [
    { value: 'ccw', label: 'Ngược chiều kim đồng hồ' },
    { value: 'cw', label: 'Cùng chiều kim đồng hồ' },
  ], 'ccw', (value) => { state.omega = Math.abs(state.omega) * (value === 'cw' ? -1 : 1); });

  const playback = createPlayback(controls, {
    onReset: () => { state.angle = 0; drawDynamic(); },
    onStep: () => { state.angle += 0.1; drawDynamic(); },
    speed: { min: 0.25, max: 4 },
  });

  controls.heading('Hiển thị');
  controls.checkbox('Vector vận tốc', state.showVelocity, (value) => { state.showVelocity = value; drawDynamic(); });
  const showAngle = controls.readout('Góc');
  controls.note('Kéo chấm xanh để dời tâm quay.');

  drawStatic();
  drawDynamic();

  // 6. Trả về các hàm khung sẽ gọi.
  return {
    update(dt) {
      if (!playback.playing) return;
      state.angle += state.omega * dt * playback.speed;
      drawDynamic();
    },
    resize(nextWidth, nextHeight) {
      view = fitView({ width: nextWidth, height: nextHeight, needX: WORLD_SIZE, needY: WORLD_SIZE });
      drawStatic();
      drawDynamic();
    },
  };
}
