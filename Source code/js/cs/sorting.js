// Sắp xếp – người phụ trách: B
// Tác vụ 2D minh họa: vẽ rất nhiều đối tượng bằng WebGL thuần (instancing) và
// tương tác trực tiếp với từng cột.
//
// ĐÃ CÓ SẴN:
//   - Cột vẽ bằng webgl/instanced-rects.js (1 lệnh vẽ cho mọi cột) trên lớp WebGL thuần.
//   - Tương tác (HTML5/PixiJS bắt sự kiện, core/hit-test.js tính cột bị trỏ tới):
//       • "Kéo-thả đổi chỗ": kéo một cột thả lên cột khác để đổi chỗ (khi ≤ 128 cột);
//         đếm số lần đổi chỗ và báo khi mảng đã sắp xong.
//       • "Vẽ dữ liệu": rê chuột để vẽ chiều cao các cột.
//       • Rê chuột lên cột để xem chỉ số và giá trị.
//       • Mẫu dữ liệu: ngẫu nhiên, đã sắp, đảo ngược, gần sắp xếp.
//   - Biến `locked`: khi true thì chặn mọi thao tác chuột lên cột.
//
// VIỆC CỦA B:
//   1. cs/sorting-algorithms.js – Bubble, Quick, Merge, Heap viết bằng generator,
//      không dùng PixiJS/WebGL, để kiểm tra bằng node --test:
//        function* bubbleSort(a) { ... yield { type: 'compare', i, j }; ... yield { type: 'swap', i, j }; }
//   2. Trong file này: Play/Pause/Step + tốc độ (createPlayback); khi chạy đặt locked = true,
//      khi Pause/Reset đặt lại false. Sửa dữ liệu lúc đang dừng thì chạy lại thuật toán từ đầu.
//   3. Mỗi lệnh từ generator: đổi values, gọi drawBars(new Map([[i, màu], [j, màu]])).
//   4. Chế độ "Đoán bước tiếp" (nếu còn thời gian): dừng ở lệnh 'compare', người học
//      bấm "Đổi" / "Không đổi", chấm đúng sai rồi chạy tiếp.
//   5. Ngưỡng: đến khoảng 2.000 phần tử thì ghi lại mọi bước để tua; lớn hơn chỉ chạy
//      Quick/Merge/Heap trực tiếp, nhiều bước mỗi khung hình. Đo để chốt ngưỡng.
import { Graphics, Text } from '../pixi.js';
import { COLOR, LABEL_STYLE } from '../core/theme.js';
import { barIndexAt, barLayout, isSorted, valueAtY } from '../core/hit-test.js';
import { ortho2D } from '../webgl/matrix.js';
import { FLOATS_PER_RECT, createInstancedRects, writeRect } from '../webgl/instanced-rects.js';

const SIZES = [8, 16, 32, 64, 128, 256, 1024, 4096, 16384, 65536];
const MAX_DRAG_COUNT = 128; // cột hẹp hơn thì khó cầm, chỉ cho vẽ dữ liệu
const MIN_VALUE = 0.03; // cột thấp nhất vẫn nhìn thấy được

const PRESETS = [
  { value: 'random', label: 'Ngẫu nhiên' },
  { value: 'sorted', label: 'Đã sắp' },
  { value: 'reversed', label: 'Đảo ngược' },
  { value: 'nearly', label: 'Gần sắp xếp' },
];

function makeValues(preset, n) {
  const ramp = Float32Array.from({ length: n }, (_, i) => MIN_VALUE + ((1 - MIN_VALUE) * (i + 1)) / n);
  if (preset === 'sorted') return ramp;
  if (preset === 'reversed') return ramp.reverse();
  if (preset === 'nearly') {
    for (let k = 0; k < Math.max(1, Math.floor(n / 20)); k++) {
      const i = Math.floor(Math.random() * (n - 1));
      [ramp[i], ramp[i + 1]] = [ramp[i + 1], ramp[i]];
    }
    return ramp;
  }
  return Float32Array.from({ length: n }, () => MIN_VALUE + Math.random() * (1 - MIN_VALUE));
}

export function mount({ root, app, controls, width, height, createGLLayer }) {
  const layer = createGLLayer();
  const rects = createInstancedRects(layer.gl);
  let size = { width, height };
  let preset = 'random';
  let values = makeValues(preset, 32);
  let data = new Float32Array(0);
  let mode = 'swap';
  let locked = false; // B: đặt true khi thuật toán đang chạy
  let swaps = 0;
  let dragging = null; // { from, x }
  let painting = null; // { last }
  let hover = -1;

  const layout = () => barLayout({ ...size, count: values.length });

  // ---- Vẽ cột bằng WebGL thuần --------------------------------------------
  // highlight: Map từ chỉ số → màu, ví dụ new Map([[i, COLOR.accent], [j, COLOR.accent]]).
  function drawBars(highlight = new Map()) {
    const box = layout();
    const n = values.length;
    const total = n + (dragging ? 1 : 0); // thêm một hình cho cột đang được kéo
    if (data.length < total * FLOATS_PER_RECT) data = new Float32Array(total * FLOATS_PER_RECT);
    const gap = box.barW > 4 ? 1 : 0; // cột hẹp thì bỏ khe hở
    const target = dragging ? barIndexAt(box, dragging.x) : -1;

    for (let i = 0; i < n; i++) {
      const h = values[i] * box.plotH;
      let color = highlight.get(i) ?? COLOR.primary;
      if (dragging?.from === i) color = COLOR.muted;
      else if (i === target) color = COLOR.orange;
      else if (i === hover && !dragging) color = COLOR.cyan;
      writeRect(data, i, box.left + i * box.barW, box.top + box.plotH - h, box.barW - gap, h, color);
    }
    if (dragging) {
      const h = values[dragging.from] * box.plotH;
      writeRect(data, n, dragging.x - box.barW / 2, box.top + box.plotH - h, box.barW - gap, h, COLOR.accent, 0.85);
    }

    rects.update(data, total);
    layer.clear();
    rects.draw(ortho2D(size.width, size.height));
  }

  // ---- Chú thích khi rê chuột (PixiJS vẽ đè lên WebGL) --------------------
  const tooltipBackground = new Graphics();
  const tooltip = new Text({ text: '', style: { ...LABEL_STYLE, fontSize: 13 } });
  root.addChild(tooltipBackground, tooltip);

  function showTooltip(x, y) {
    tooltipBackground.clear();
    tooltip.visible = hover >= 0 && !dragging;
    if (!tooltip.visible) return;
    tooltip.text = `#${hover}: ${Math.round(values[hover] * 100)}`;
    const tx = Math.min(x + 12, size.width - tooltip.width - 8);
    const ty = Math.max(y - 28, 4);
    tooltip.position.set(tx, ty);
    tooltipBackground.roundRect(tx - 6, ty - 3, tooltip.width + 12, tooltip.height + 6, 4).fill({ color: 0xffffff, alpha: 0.9 }).stroke({ width: 1, color: COLOR.grid });
  }

  // ---- Tương tác chuột ----------------------------------------------------
  root.eventMode = 'static';
  root.hitArea = app.screen; // nhận sự kiện ở mọi chỗ trong khung vẽ

  function paintTo(index, y) {
    const value = Math.max(valueAtY(layout(), y), MIN_VALUE);
    const from = painting.last < 0 ? index : painting.last;
    const step = index >= from ? 1 : -1;
    for (let i = from; i !== index + step; i += step) values[i] = value; // lấp khoảng trống khi rê nhanh
    painting.last = index;
  }

  root.on('pointerdown', (event) => {
    if (locked) return;
    const { x, y } = event.global;
    const index = barIndexAt(layout(), x);
    if (index < 0) return;
    if (mode === 'paint') {
      painting = { last: -1 };
      paintTo(index, y);
      swaps = 0;
    } else {
      dragging = { from: index, x };
    }
    drawBars();
    updateStatus();
  });

  root.on('globalpointermove', (event) => {
    const { x, y } = event.global;
    const index = barIndexAt(layout(), x);
    if (painting && index >= 0) paintTo(index, y);
    if (dragging) dragging.x = Math.min(Math.max(x, layout().left), layout().left + layout().plotW - 1);
    if (index !== hover || painting || dragging) {
      hover = index;
      drawBars();
    }
    showTooltip(x, y);
  });

  function endPointer() {
    if (dragging) {
      const target = barIndexAt(layout(), dragging.x);
      if (target >= 0 && target !== dragging.from) {
        [values[dragging.from], values[target]] = [values[target], values[dragging.from]];
        swaps += 1;
      }
      dragging = null;
    }
    painting = null;
    drawBars();
    updateStatus();
  }
  root.on('pointerup', endPointer);
  root.on('pointerupoutside', endPointer);

  // ---- Bảng điều khiển ----------------------------------------------------
  function setData(nextPreset, n = values.length) {
    preset = nextPreset;
    values = makeValues(preset, n);
    swaps = 0;
    hover = -1;
    if (n > MAX_DRAG_COUNT && mode === 'swap') mode = 'paint';
    modeNote(n > MAX_DRAG_COUNT ? `Trên ${MAX_DRAG_COUNT} cột: chỉ vẽ dữ liệu được (cột quá hẹp để kéo).` : '');
    drawBars();
    updateStatus();
  }

  controls.heading('Dữ liệu');
  controls.select('Số phần tử', SIZES.map((n) => ({ value: String(n), label: n.toLocaleString('vi-VN') })), String(values.length), (value) => setData(preset, Number(value)));
  controls.select('Mẫu dữ liệu', PRESETS, preset, (value) => setData(value));
  controls.button('Tạo lại', () => setData(preset));

  controls.heading('Thao tác chuột');
  controls.select('Khi kéo chuột trên cột', [
    { value: 'swap', label: 'Kéo-thả để đổi chỗ' },
    { value: 'paint', label: 'Vẽ chiều cao cột' },
  ], mode, (value) => {
    mode = value === 'swap' && values.length > MAX_DRAG_COUNT ? 'paint' : value;
  });
  const modeNote = controls.readout('');

  controls.heading('Bạn tự sắp xếp');
  const showSwaps = controls.readout('Số lần đổi chỗ');
  const showState = controls.readout('Trạng thái');

  function updateStatus() {
    showSwaps(String(swaps));
    showState(isSorted(values) ? 'Đã sắp xong ✓' : 'Chưa sắp');
  }

  controls.heading('Việc cần làm (B)');
  for (const item of [
    'Viết Bubble, Quick, Merge, Heap bằng generator + test',
    'Play / Pause / Step + tốc độ; đặt locked khi đang chạy',
    'Tô màu cặp đang so sánh / đổi chỗ (drawBars)',
    'So số lần đổi chỗ của người học với thuật toán',
    'Đo FPS với số phần tử lớn để chốt ngưỡng',
  ]) controls.note(`• ${item}`);

  setData(preset);

  return {
    update() {
      // B: lấy lệnh tiếp theo từ generator, cập nhật values, gọi drawBars(highlight).
    },
    resize(nextWidth, nextHeight) {
      size = { width: nextWidth, height: nextHeight };
      drawBars();
    },
  };
}
