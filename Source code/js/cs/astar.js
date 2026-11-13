// Tìm đường A* – người phụ trách: B
// Tác vụ 2D minh họa: lưới nhiều ô cập nhật theo từng bước.
//
// Gợi ý cách chia file:
//   cs/pathfinding.js   A* và Dijkstra trên lưới, viết bằng generator, không dùng PixiJS.
//                       Mỗi bước yield { type: 'visit' | 'frontier' | 'path', cell }.
//                       → kiểm tra bằng node --test (đường đi ngắn nhất trên lưới nhỏ tự tính tay).
//   cs/astar.js         File này: vẽ lưới, cho người dùng vẽ tường bằng chuột, phát lại các bước.
//
// Thử nghiệm (c) của Ch.4: so số ô đã duyệt của A* với Dijkstra trên lưới 20², 50², 100²,
// tường 0 %, 20 %, 30 %, 10 cặp điểm ngẫu nhiên (seed cố định); độ dài đường phải bằng nhau.
//
// Helper có sẵn: core/playback.js, core/drag.js (vẽ tường khi kéo chuột).
// Xem bài mẫu: mở trang với ?dev#template.
import { showPlaceholder } from '../core/placeholder.js';

export function mount(context) {
  return showPlaceholder(context, {
    owner: 'B',
    todo: [
      'Viết A* và Dijkstra trên lưới bằng generator',
      'Vẽ lưới (có thể dùng instanced-rects.js); rê chuột vẽ / xóa tường (core/hit-test.js: cellAt)',
      'Kéo điểm đầu và điểm đích; đường đi cập nhật ngay',
      'Tô màu ô đã duyệt, ô chờ, đường đi',
      'Đếm số ô đã duyệt của từng thuật toán',
    ],
  });
}
