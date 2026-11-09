// BFS / DFS / Dijkstra – người phụ trách: A
// Tác vụ 2D minh họa: tương tác chọn, kéo-thả; vẽ chữ hiệu quả.
//
// Gợi ý cách chia file:
//   cs/graph-algorithms.js  BFS, DFS, Dijkstra viết bằng generator, không dùng PixiJS.
//                           → kiểm tra bằng node --test.
//   cs/graph.js             File này: vẽ node và cạnh, kéo node (core/drag.js), phát lại các bước.
//
// Nhãn node và trọng số cạnh nên dùng BitmapText (Horak 2018: chữ làm tụt hiệu năng WebGL).
// Dùng chung cơ chế ghi bước với B (sắp xếp, A*).
//
// Helper có sẵn: core/drag.js, core/playback.js, controls.select (chọn thuật toán).
// Xem bài mẫu: mở trang với ?dev#template.
import { showPlaceholder } from '../core/placeholder.js';

export function mount(context) {
  return showPlaceholder(context, {
    owner: 'A',
    todo: [
      'Viết BFS, DFS, Dijkstra bằng generator',
      'Kéo-thả node; trọng số cạnh = độ dài, tự đổi khi kéo',
      'Bấm đúp thêm node; bấm 2 node để thêm/xóa cạnh',
      'Chọn node đầu/cuối; đường ngắn nhất tính lại ngay khi kéo',
      'Chọn node bằng GPU picking (webgl/picking.js)',
      'Tô màu node đã thăm, đang xét, đường ngắn nhất; nhãn BitmapText',
    ],
  });
}
