// Danh sách bài học. Thêm bài mới: tạo file trong js/cs hoặc js/physics rồi
// điền hàm load, menu sẽ tự hiện. load: null nghĩa là bài chưa làm.
export const lessons = [
  { id: 'sorting', group: 'Tin học', title: 'Sắp xếp', load: null },
  { id: 'graph', group: 'Tin học', title: 'BFS / DFS / Dijkstra', load: null },
  { id: 'astar', group: 'Tin học', title: 'Tìm đường A*', load: null },
  { id: 'projectile', group: 'Vật lý', title: 'Ném xiên', load: () => import('./physics/projectile.js') },
  { id: 'oscillator', group: 'Vật lý', title: 'Con lắc & lò xo', load: null },
  { id: 'waves', group: 'Vật lý', title: 'Giao thoa sóng', load: null },
];
