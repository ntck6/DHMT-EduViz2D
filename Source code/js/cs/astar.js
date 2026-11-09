// Tìm đường A* – người phụ trách: B
// Tác vụ 2D minh họa: lưới nhiều ô cập nhật theo từng bước.
//
// Gợi ý cách chia file:
//   cs/pathfinding.js   A* và Dijkstra trên lưới, viết bằng generator, không dùng PixiJS.
//                       Mỗi bước yield { type: 'visit' | 'frontier' | 'path', cell }.
//                       → kiểm tra bằng node --test (đường đi ngắn nhất trên lưới nhỏ tự tính tay).
//   cs/astar.js         File này: vẽ lưới, cho người dùng vẽ tường bằng chuột, phát lại các bước.
//
// Ch.4 so sánh số ô đã duyệt của A* với Dijkstra: thống nhất với A (bài đồ thị)
// về định dạng lưới đầu vào để dùng chung bộ bản đồ thử nghiệm.
//
// Helper có sẵn: core/playback.js, core/drag.js (vẽ tường khi kéo chuột).
// Xem bài mẫu: mở trang với ?dev#template.
import { showPlaceholder } from '../core/placeholder.js';

export function mount(context) {
  return showPlaceholder(context, {
    owner: 'B',
    todo: [
      'Viết A* và Dijkstra trên lưới bằng generator',
      'Vẽ lưới; kéo chuột để vẽ / xóa tường',
      'Tô màu ô đã duyệt, ô chờ, đường đi',
      'Đếm số ô đã duyệt của từng thuật toán',
    ],
  });
}
