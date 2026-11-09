// Sắp xếp – người phụ trách: B
// Tác vụ 2D minh họa: vẽ rất nhiều đối tượng cùng lúc bằng WebGL thuần (instancing).
//
// ĐÃ CÓ SẴN: các cột được vẽ bằng webgl/instanced-rects.js (1 lệnh vẽ cho mọi cột)
// trên lớp WebGL thuần (createGLLayer). Thanh trượt đổi số phần tử, nút Trộn tạo mảng mới.
//
// VIỆC CỦA B:
//   1. cs/sorting-algorithms.js – Bubble, Quick, Merge, Heap viết bằng generator,
//      không dùng PixiJS/WebGL, để kiểm tra bằng node --test:
//        function* bubbleSort(a) { ... yield { type: 'compare', i, j }; ... yield { type: 'swap', i, j }; }
//   2. Trong file này: nhận lệnh từ generator trong update(dt), đổi mảng values,
//      tô màu cột đang so sánh / đổi chỗ bằng tham số highlight của drawBars().
//   3. Play / Pause / Step + tốc độ: dùng createPlayback (core/playback.js).
//   4. Ngưỡng: đến khoảng 2.000 phần tử thì ghi lại mọi bước để tua; lớn hơn chỉ
//      chạy Quick/Merge/Heap trực tiếp, nhiều bước mỗi khung hình. Đo để chốt ngưỡng.
import { COLOR } from '../core/theme.js';
import { ortho2D } from '../webgl/matrix.js';
import { FLOATS_PER_RECT, createInstancedRects, writeRect } from '../webgl/instanced-rects.js';

const MARGIN = 16;
const SIZES = [16, 64, 256, 1024, 4096, 16384, 65536];

function randomValues(n) {
  return Float32Array.from({ length: n }, () => Math.random());
}

export function mount({ controls, width, height, createGLLayer }) {
  const layer = createGLLayer();
  const rects = createInstancedRects(layer.gl);
  let size = { width, height };
  let values = randomValues(256);
  let data = new Float32Array(values.length * FLOATS_PER_RECT);

  // Vẽ toàn bộ cột. highlight: Map từ chỉ số → màu, ví dụ new Map([[i, COLOR.accent], [j, COLOR.accent]]).
  function drawBars(highlight = new Map()) {
    const n = values.length;
    if (data.length !== n * FLOATS_PER_RECT) data = new Float32Array(n * FLOATS_PER_RECT);
    const plotW = size.width - MARGIN * 2;
    const plotH = size.height - MARGIN * 2;
    const barW = plotW / n;
    const gap = barW > 4 ? 1 : 0; // cột hẹp thì bỏ khe hở
    for (let i = 0; i < n; i++) {
      const h = values[i] * plotH;
      writeRect(data, i, MARGIN + i * barW, MARGIN + plotH - h, barW - gap, h, highlight.get(i) ?? COLOR.primary);
    }
    rects.update(data, n);
    layer.clear();
    rects.draw(ortho2D(size.width, size.height));
  }

  controls.heading('Dữ liệu');
  controls.select('Số phần tử', SIZES.map((n) => ({ value: String(n), label: n.toLocaleString('vi-VN') })), String(values.length), (value) => {
    values = randomValues(Number(value));
    drawBars();
  });
  controls.button('Trộn', () => {
    values = randomValues(values.length);
    drawBars();
  });

  controls.heading('Việc cần làm (B)');
  for (const item of [
    'Viết Bubble, Quick, Merge, Heap bằng generator + test',
    'Chọn thuật toán (controls.select)',
    'Play / Pause / Step + tốc độ (createPlayback)',
    'Tô màu cặp đang so sánh / đổi chỗ (drawBars)',
    'Đo FPS với số phần tử lớn để chốt ngưỡng',
  ]) controls.note(`• ${item}`);

  drawBars();

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
