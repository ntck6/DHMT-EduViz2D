// Sắp xếp – người phụ trách: B
// Tác vụ 2D minh họa: vẽ rất nhiều đối tượng cùng lúc (batching/instancing).
//
// Gợi ý cách chia file:
//   cs/sorting-algorithms.js  Thuật toán viết bằng generator, không dùng PixiJS:
//                               function* bubbleSort(a) { ... yield { type: 'compare', i, j }; ... yield { type: 'swap', i, j }; }
//                             → kiểm tra được bằng node --test (tests/sorting-algorithms.test.mjs).
//   cs/sorting.js             File này: vẽ cột, nhận lệnh từ generator và tô màu.
//
// Lưu ý đã chốt trong Documents/PLAN_PHAN_CONG.md:
//   - Đến khoảng 2.000 phần tử: ghi lại hết các bước để tua được.
//   - Lớn hơn: chỉ Quick/Merge/Heap, chạy trực tiếp nhiều bước mỗi khung hình.
//   - Ngưỡng 2.000 và mốc 100k là ước lượng, cần đo để chốt.
//   - Nhiều cột: thử ParticleContainer + Particle (một texture trắng, đổi tint và scale).
//
// Helper có sẵn: core/playback.js (Play/Pause/Step + thanh tốc độ),
// controls.select (chọn thuật toán), controls.slider (số phần tử).
// Xem bài mẫu: mở trang với ?dev#template.
import { showPlaceholder } from '../core/placeholder.js';

export function mount(context) {
  return showPlaceholder(context, {
    owner: 'B',
    todo: [
      'Viết Bubble, Quick, Merge, Heap bằng generator',
      'Vẽ cột, tô màu cặp đang so sánh / đổi chỗ',
      'Play / Pause / Step + tốc độ (createPlayback)',
      'Chọn thuật toán và số phần tử',
      'Đo FPS với số phần tử lớn để chốt ngưỡng',
    ],
  });
}
