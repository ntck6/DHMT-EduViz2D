# Data – Dữ liệu thử nghiệm và ảnh kết quả

Theo `Documents/REGULATION.md` mục 1.5. Bộ kịch bản của từng thử nghiệm: `Documents/DAN_Y_BAO_CAO.md` mục 4.3.

| Thư mục con (tạo khi có dữ liệu) | Nội dung | Công cụ | Người |
|---|---|---|---|
| `a-render/` | CSV hiệu năng Canvas 2D / PixiJS / WebGL thuần | `Source code/benchmark/index.html` | A |
| `b-integrator/` | CSV sai số, năng lượng của Euler / Verlet / RK4 | bài Con lắc & lò xo (chưa có) | C |
| `c-pathfinding/` | CSV số ô duyệt của Dijkstra / A* | bài A* (chưa có) | B |
| `d-instancing/` | Số đo 1 lệnh vẽ so với N lệnh | bài Pipeline WebGL | A |
| `e-pixel/` | Thời gian GPU so với CPU ở 4 độ phân giải | bài Giao thoa sóng (chưa có) | C |
| `f-loop-blinn/` | CSV sai số hình học, độ phủ, số đỉnh + ảnh cắt 16× | `Source code/benchmark/curve.html` | A |
| `g-picking/` | Thời gian chọn, tỉ lệ chọn đúng (tùy chọn) | chưa có | B |
| `screenshots/` | Ảnh chụp các bài, ảnh PhET dùng làm bằng chứng ở Ch.2 | – | Cả nhóm |

Mỗi CSV đã ghi tên GPU, trình duyệt, kích thước khung vẽ; đo trên ít nhất 2 máy.
