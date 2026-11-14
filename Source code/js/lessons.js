// Danh sách bài học, menu bên trái được tạo từ đây.
//   owner:   người phụ trách
//   task:    tác vụ 2D mà bài minh họa (khớp Bảng 4.3 trong Documents/bao-cao/Ch4. Cai dat va thu nghiem.md)
//   status:  'todo' = mới có file khung, 'done' = đã chạy được
//   devOnly: chỉ hiện khi mở trang với ?dev (dùng cho bài mẫu, không nộp)
export const lessons = [
  {
    id: 'sorting', group: 'Tin học', title: 'Sắp xếp', owner: 'B', status: 'todo',
    task: 'Vẽ rất nhiều đối tượng cùng lúc bằng WebGL thuần (instancing, giải pháp nền)',
    load: () => import('./cs/sorting.js'),
  },
  {
    id: 'graph', group: 'Tin học', title: 'BFS / DFS / Dijkstra', owner: 'A', status: 'todo',
    task: 'Tương tác chọn, kéo-thả; vẽ chữ hiệu quả',
    load: () => import('./cs/graph.js'),
  },
  {
    id: 'astar', group: 'Tin học', title: 'Tìm đường A*', owner: 'B', status: 'todo',
    task: 'Lưới nhiều ô cập nhật theo từng bước; so A* với Dijkstra (thử nghiệm c)',
    load: () => import('./cs/astar.js'),
  },
  {
    id: 'projectile', group: 'Vật lý', title: 'Ném xiên', owner: 'C', status: 'done',
    task: 'Vẽ đường cong bằng GPU theo Loop & Blinn 2005 (phương pháp cải tiến) và animation theo thời gian',
    load: () => import('./physics/projectile.js'),
  },
  {
    id: 'oscillator', group: 'Vật lý', title: 'Con lắc & lò xo', owner: 'C', status: 'todo',
    task: 'Cập nhật trạng thái theo thời gian; so Euler, Verlet, RK4 (thử nghiệm b)',
    load: () => import('./physics/oscillator.js'),
  },
  {
    id: 'waves', group: 'Vật lý', title: 'Giao thoa sóng', owner: 'C', status: 'todo',
    task: 'Tính màu từng điểm ảnh bằng fragment shader',
    load: () => import('./physics/waves.js'),
  },
  {
    id: 'pipeline', group: 'Kỹ thuật WebGL', title: 'Pipeline WebGL từng bước', owner: 'A', status: 'done',
    task: 'Toàn bộ pipeline vẽ 2D bằng WebGL thuần: đỉnh, chia tam giác, ma trận, shader, instancing',
    load: () => import('./tech/pipeline.js'),
  },
  {
    id: 'template', group: 'Mẫu cho nhóm', title: 'Bài mẫu', owner: 'A', status: 'done', devOnly: true,
    task: 'Ví dụ dùng đủ các helper: hệ trục, kéo-thả, Play/Pause, thanh trượt',
    load: () => import('./_template/lesson-template.js'),
  },
];
