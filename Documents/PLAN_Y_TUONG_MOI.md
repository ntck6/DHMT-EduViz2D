# Đề xuất cải tiến EduViz2D (bản nháp, chưa code)

> **Điều chỉnh ưu tiên 09/11:** báo cáo nghiên cứu là sản phẩm chính, app chỉ minh họa các tác vụ 2D (xem `DAN_Y_BAO_CAO.md`). Vì vậy:
> - **Giữ:** kéo-thả (tác vụ tương tác), xuất PNG (tác vụ tĩnh), sửa ngưỡng kích thước cho sắp xếp (mục 4.3).
> - **Tăng ưu tiên:** trang benchmark và bộ cảnh thử nghiệm, vì là số liệu cho Ch.4.
> - **Hạ ưu tiên:** chế độ "Dự đoán rồi kiểm chứng" (mục 4.1) chỉ làm tối đa 1 bài nếu còn thời gian.
> - **Bỏ:** lưu tham số vào link.
>
> Các mục bên dưới giữ nguyên để tham khảo.

Lập ngày 01/11, cuối tuần 5. Nguồn phân tích: trang Mathvera (trang chủ + hướng dẫn), `Research Papers.pdf`, `Preparation and first demo.pdf`.

## 1. Kết luận chính
1. **Định vị:** Mathvera là bảng vẽ cho **giáo viên dạy** Toán. EduViz2D là phòng thí nghiệm cho **người học tự thử**, có yếu tố thời gian (thuật toán chạy, vật chuyển động) và tận dụng GPU. Hai bên khác đối tượng, nên nhóm mượn ý tưởng tương tác, không mượn phạm vi.
2. **Thay đổi đáng giá nhất:** thêm chế độ **"Dự đoán rồi kiểm chứng"**. Hundhausen 2002 kết luận cách người học *làm gì* với công cụ quan trọng hơn việc công cụ *hiển thị gì*, nên nếu chỉ có animation đẹp thì đồ án chưa dùng đến bằng chứng mà chính nhóm đã trích.
3. **Lỗi cần sửa trong kế hoạch hiện tại:** mục tiêu "10k–100k phần tử" không khả thi với step-recording. Bubble Sort 100k phần tử cần cỡ 10¹⁰ bước, không thể ghi lại trong bộ nhớ.

## 2. Mathvera: lấy gì, bỏ gì
| Ý tưởng của Mathvera | Cách dùng trong EduViz2D | Quyết định |
|---|---|---|
| "Kéo một đỉnh, cả hình chạy theo" | Kéo trực tiếp trên hình: đầu vector v₀, node đồ thị, nguồn sóng, tường A*. Dijkstra tự tính lại khi kéo node | **Lấy** |
| Gõ hàm có tham số → tự sinh thanh trượt | Mỗi bài khai báo danh sách tham số, bảng điều khiển tự sinh | **Lấy** |
| Dòng gợi ý "Bước k/n" | Dòng giải thích bước thuật toán + tô sáng dòng giả mã | **Lấy** |
| Bài kiểm tra tự chấm | Câu hỏi dự đoán ngay trong bài, chấm tại trình duyệt | **Lấy, rút gọn** |
| Xuất PNG/PDF | Xuất PNG trạng thái hiện tại, phục vụ chế độ tĩnh và hình cho báo cáo | **Lấy PNG** |
| Link 1 chạm | Lưu tham số vào link (`#projectile?v0=30&theta=60`), không cần server | **Lấy, rút gọn** |
| Pan/zoom bằng chuột | Đã có trong kế hoạch tuần 6 | Giữ |
| Bảng chung thời gian thực, tài khoản, lớp học, nộp bài, gia sư AI | Cần server, không thuộc phạm vi đồ họa máy tính | **Bỏ** |
| Hình không gian | Đề tài là 2D | **Bỏ** |
| Trình soạn công thức, dựng hình tự do | Tốn nhiều công, không gắn với 2 môn đã chọn | **Bỏ** |

Giới hạn của phần phân tích: phần bảng vẽ của Mathvera nằm sau đăng nhập, trang giới thiệu chỉ có video nên không xác định được họ dùng canvas, SVG hay WebGL. Trong bảng Ch.2 ghi "không công bố", không suy đoán.

## 3. Rút ra từ 2 file tài liệu
**Research Papers.pdf**
| Tài liệu | Ý nghĩa với đồ án | Việc cần làm |
|---|---|---|
| P1 Hundhausen | Mức tham gia quyết định hiệu quả | Thêm chế độ dự đoán (mục 4.1) |
| P2 Shaffer | Nhiều công cụ tập trung chủ đề dễ, chất lượng không đều | Ch.2 nêu khoảng trống: có kiểm chứng định lượng, mã nguồn mở |
| P3 Horak | Chữ vẽ trong WebGL làm tụt hiệu năng; hiệu năng giảm từ ~400 node ở thử nghiệm của họ | Dùng BitmapText cho nhãn node; đo cả trường hợp có/không có chữ ở Ch.4(a) |
| P4 Algorithm Visualizer | Mô hình tách "lệnh trực quan" khỏi code thuật toán | Dẫn chứng cho thiết kế ở mục 4.3 |
| P6 Chen & Nishita | Lệch đề tài | Bỏ |

**Preparation and first demo.pdf**
- File có ghi công thức tầm xa không đúng khi độ cao ném khác độ cao rơi → thêm **độ cao ném h₀**, dùng công thức tổng quát.
- File nhắc PhET có lực cản, còn demo hiện chưa có → thêm **lực cản** và vẽ chồng lên quỹ đạo chân không. Bài toán này dùng lại các integrator nên nối được với Ch.4(b).
- File kết luận phải đánh giá bằng thử nghiệm thay vì giả định → khảo sát Ch.4(d) đổi thành **bài test trước/sau**.
- Phần Related Works đang viết dạng đoạn văn, chỉ có Vật lý → phải chuyển sang bảng cùng tiêu chí theo các công đoạn (MANUAL_FAULT mục 3), thêm nhánh Tin học.

## 4. Đề xuất cụ thể
### 4.1. Chế độ "Dự đoán rồi kiểm chứng"
Mỗi bài có 1–2 thử thách: tạm dừng, người học trả lời, app chạy tiếp để kiểm chứng.

| Bài | Thử thách |
|---|---|
| Sắp xếp | Đoán cặp phần tử được so sánh tiếp theo |
| BFS/DFS/Dijkstra | Bấm vào node sẽ được duyệt tiếp theo |
| A* | Đoán A* hay Dijkstra duyệt ít ô hơn trên bản đồ này |
| Ném xiên | Chỉnh θ, v₀ để trúng mục tiêu, chỉ được thử 3 lần |
| Con lắc/lò xo | Đoán integrator nào làm năng lượng trôi nhiều nhất |
| Giao thoa sóng | Bấm vào một điểm cực đại, app kiểm tra bằng hiệu đường đi |

### 4.2. Khung dùng chung
Một bài học khai báo tham số một lần, khung tự xử lý phần còn lại:
- Bảng điều khiển tự sinh (`core/params.js`).
- Tham số lưu vào link để chia sẻ.
- Kéo-thả dùng chung (`core/drag.js`).
- Khung thử thách (`core/challenge.js`).
- Xuất PNG.

Lợi ích: B và C viết ít code lặp, và Ch.3 có thêm mô hình **tham số → đại lượng suy ra → hình vẽ**. Bài ném xiên hiện tại sẽ được chuyển sang khung này làm mẫu.

### 4.3. Sửa thiết kế mô phỏng sắp xếp
Thuật toán viết bằng generator (`function*`) phát ra lệnh so sánh/đổi chỗ, rồi tùy kích thước mà xử lý:

| Quy mô | Cách chạy | Tua lại | Mục đích |
|---|---|---|---|
| Đến ~2.000 phần tử | Ghi hết các bước | Có | Học từng bước |
| Lớn hơn, chỉ Quick/Merge/Heap | Chạy trực tiếp, nhiều bước mỗi khung hình | Không | Thể hiện sức mạnh GPU |

Bubble Sort bị giới hạn kích thước. Ngưỡng ở bảng là ước lượng, tuần 6 sẽ đo để chốt. Mục tiêu 100k cũng là giả định cho đến khi đo được trên PixiJS.

### 4.4. Bổ sung cho báo cáo
- **Ch.1:** thêm bảng **ẩn số theo từng công đoạn** (MANUAL_FAULT mục 2), ví dụ trạng thái x(t), thứ tự duyệt, ma trận chiếu, số draw call.
- **Ch.2:** thêm cột **mức tham gia của người học** theo thang của Naps 2002 (xem, trả lời, thay đổi, tự xây dựng, trình bày). Nhờ cột này, EduViz2D có điểm khác biệt rõ. Thêm dòng Mathvera và GeoGebra.
- **Ch.4(a):** đo thêm trường hợp có/không có chữ.
- **Ch.4(d):** bài test 5 câu trước/sau, 10–15 bạn. Mẫu nhỏ nên chỉ ghi nhận xu hướng, không kết luận app cải thiện kết quả học.
- Mục "giai đoạn huấn luyện" trong MANUAL_FAULT dành cho học máy, không áp dụng. Nên ghi rõ trong báo cáo hoặc hỏi lại thầy.

## 5. Phân công bổ sung
| Người | Việc thêm |
|---|---|
| **A** | `core/params.js` (kèm lưu vào link), `core/drag.js`, `core/challenge.js`, xuất PNG; chuyển bài ném xiên sang khung mới; thử thách đồ thị |
| **B** | Generator + ngưỡng kích thước, đo khả năng của PixiJS với nhiều cột; dòng gợi ý + giả mã; thử thách sắp xếp, A* |
| **C** | Ném xiên: kéo vector, h₀, lực cản, trúng mục tiêu; thử thách con lắc, sóng; chuyển Related Works sang bảng |

A vốn đã nhiều code, nên có 3 phương án giảm tải nếu chậm: B nhận Dijkstra, C nhận WebGL thuần của benchmark, hoặc bỏ lưu vào link.

## 6. Lịch điều chỉnh
| Tuần | Việc chính |
|---|---|
| 6 (4–10/11) | A: khung tham số + kéo-thả, đồ thị BFS/DFS/Dijkstra; B: **đo khả năng + chốt ngưỡng**, sắp xếp bằng generator; C: ném xiên bản mới, con lắc/lò xo |
| 7 (11–17/11) | Khung thử thách; demo nội bộ với ít nhất 1 thử thách cho mỗi môn; xong bảng Ch.2 |
| 8 (18–24/11) | Benchmark, A*, sóng; đủ thử thách cho các bài; soạn bài test trước/sau |
| 9 (25/11–1/12) | Dừng thêm tính năng; chạy thử nghiệm và bài test; xuất PNG; viết Ch.3–4 |
| 10–11 | Giữ nguyên |

**Thứ tự cắt nếu trễ:** điện trường → xuất PNG → lưu vào link → thử thách thứ hai của mỗi bài. Không cắt thử thách đầu tiên của mỗi bài.

## 7. Cần quyết định
- **Có thêm bài Toán không?** Đề xuất: **không** làm thành môn thứ ba. Còn 6 tuần, 3 người, 6 bài chính, và nhóm đã chọn Tin + Lý. Nếu muốn có Toán, chỉ thêm 1 bài "Đồ thị hàm số có tham số" **thay cho điện trường**, làm sau tuần 8 nếu kịp.
- **Có áp dụng mục 4.1 và 4.2 không?** Đây là phần tốn công nhất. Nếu không làm, vẫn cần sửa mục 4.3.
