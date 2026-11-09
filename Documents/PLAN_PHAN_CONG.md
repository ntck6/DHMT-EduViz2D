# Kế hoạch đồ án – Ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục

Bản gộp ngày 09/11, thay cho các bản kế hoạch trước. Bản cũ vẫn xem được trong lịch sử Git.

## 1. Đề tài và thầy cần gì
- **Tên đề:** *Xây dựng ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục.* Yêu cầu: *trình bày cách sử dụng HTML5 + WebGL trong các tác vụ 2D (tĩnh và động).*
- **Lĩnh vực:** hỗ trợ giáo dục (Tin học, Vật lý), đã chốt thay cho hướng thiết kế logo của đề gốc (xem `PROJECT_NAME.md`).
- **Sản phẩm chính là báo cáo nghiên cứu** theo dàn ý `DAN_Y_BAO_CAO.md`. Web app EduViz2D chỉ là chương trình minh họa cho Ch.3–4.
- **Nộp bài:** 8 thư mục theo `REGULATION.md`, gửi link Drive đúng ngày thi lý thuyết (không trước, không sau).

## 2. Web app minh họa (EduViz2D)
Mỗi demo được làm để minh họa **một tác vụ 2D** trong báo cáo, không nhằm làm sản phẩm hoàn chỉnh.

| Demo | Tác vụ 2D minh họa | Người làm | Trạng thái |
|---|---|---|---|
| Ném xiên | Vẽ vector tĩnh (trục, đường cong, chữ) + animation | C | Bản đầu đã có, C hoàn thiện |
| Sắp xếp | Vẽ rất nhiều đối tượng bằng **WebGL thuần** (instancing) | B | Phần vẽ cột bằng WebGL thuần đã có; còn thuật toán + tô màu |
| BFS/DFS/Dijkstra | Tương tác chọn, kéo-thả; vẽ chữ | A | Chưa làm |
| A* | Lưới nhiều ô cập nhật theo bước | B | Chưa làm |
| Con lắc/lò xo | Cập nhật trạng thái theo thời gian | C | Chưa làm |
| Giao thoa sóng | Tính màu từng điểm ảnh bằng fragment shader; kèm bản tính trên CPU để đo GPU nhanh hơn bao nhiêu | C | Shader đã nối sẵn, chưa có công thức |
| Pipeline WebGL từng bước | Toàn bộ pipeline WebGL thuần (đỉnh, chia tam giác, ma trận, shader, instancing) | A | **Xong** |
| Xuất PNG, toàn màn hình, phím tắt | Các API HTML5 | A | **Xong** |
| **Benchmark** | So sánh Canvas2D / PixiJS / WebGL thuần → **số liệu Ch.4** | A | **Trang đã xong**; còn đo trên máy thật và xuất CSV |

**Lưu ý kỹ thuật**
- **Sắp xếp:** không ghi lại từng bước khi số phần tử lớn (Bubble Sort 100k phần tử cần cỡ 10¹⁰ bước). Đến khoảng 2.000 phần tử thì ghi lại để tua được; lớn hơn thì chỉ Quick/Merge/Heap chạy trực tiếp. Ngưỡng này cần B đo để chốt.
- **Chữ:** nhãn node dùng BitmapText. Horak 2018 cho thấy chữ vẽ trong WebGL làm tụt hiệu năng.
- **Thêm nếu còn thời gian:** ném xiên có độ cao ném h₀ và lực cản; một bài có câu hỏi "dự đoán rồi kiểm chứng".

**Công nghệ:** HTML5 + CSS; JavaScript thuần (ES modules, không build); PixiJS 8.22.0 tải sẵn ở `Source code/lib/pixi.min.js`; shader GLSL qua PixiJS Filter (giao thoa sóng); **WebGL 2 thuần nhóm tự viết** ở `Source code/js/webgl/` (context, shader, buffer, VAO, ma trận, ear clipping, instancing), dùng cho bài sắp xếp, bài pipeline và benchmark; Canvas 2D làm đối chứng. Bảng kiến thức ↔ file code: `DAN_Y_BAO_CAO.md`, Ch.3. Chạy bằng Live Server hoặc `python -m http.server` (xem `Source code/README.md`).

## 3. Phân công
| Thành viên | Code | Báo cáo (theo `DAN_Y_BAO_CAO.md`) | Khác |
|---|---|---|---|
| **A – Leader** | Đã xong: khung app, lớp WebGL thuần, bài pipeline, xuất PNG, trang benchmark. Còn: BFS/DFS/Dijkstra, **đo benchmark trên máy thật** | Ch.1; khung Ch.2 + gộp bảng; Ch.3 phần pipeline HTML5/WebGL; Ch.4 phần hiệu năng; Ch.5; tổng hợp Doc | Personal Information, quản lý Drive |
| **B** | Sắp xếp (**vẽ bằng WebGL thuần**, phần vẽ đã có trong `js/cs/sorting.js`), A*, ghi lại từng bước để tua | Ch.2 phần của mình; Ch.3 phần batching/instancing; Ch.4 phần sắp xếp/A* | **Slide** |
| **C** | Ném xiên, con lắc/lò xo, giao thoa sóng (kèm bản tính trên CPU để so với GPU) | Ch.2 phần của mình; Ch.3 phần shader + mô phỏng theo thời gian; Ch.4 phần độ chính xác + CPU so với GPU | **Video demo** |
| Cả nhóm | Review chéo code | Góp ý báo cáo | BTLopNha, Reference |

Nếu A quá tải: B nhận Dijkstra.

B cần đọc `js/webgl/instanced-rects.js` và webgl2fundamentals.org (Fundamentals, Instanced drawing) trước khi làm bài sắp xếp.

## 4. Tài liệu
**Trọng tâm (Ch.2–3): kỹ thuật vẽ 2D trên web và GPU.** Danh sách đã đối chiếu DOI nằm trong `DAN_Y_BAO_CAO.md`, gồm Loop & Blinn 2005, Green 2007, Kilgard & Bolz 2012, Ganacim et al. 2014, Li et al. 2016, Horak et al. 2018.
- Từ khóa tìm thêm: `GPU vector graphics rendering survey`, `2D rendering web WebGL performance`, `path rendering GPU`, `signed distance field text rendering`.
- Tài liệu học: MDN (Canvas, WebGL), webgl2fundamentals.org, The Book of Shaders, tài liệu PixiJS, LearnOpenGL phần pipeline.

**Phụ (chỉ dùng ở Ch.1 phần động lực):** tài liệu giáo dục trong `Research Papers.pdf` và `Preparation and first demo.pdf`, gồm Wieman 2008, Banda & Nzabahimana 2021, Wang 2025, Hundhausen 2002, Shaffer 2010. OpenStax mục 4.3 dùng làm nghiệm tham chiếu cho ném xiên.

**Bỏ:** Chen & Nishita (đồ họa 3D bằng Java, lệch đề).

**Cách ghi tài liệu:** mỗi tài liệu một phiếu tóm tắt gồm tên, tác giả, năm, DOI/link, nội dung chính, dùng cho mục nào, điền được cột nào của bảng Ch.2. Bản PDF lưu vào thư mục `Reference`.

## 5. Lịch còn lại
| Tuần | Thời gian | Việc |
|---|---|---|
| 4–6 | 21/10–10/11 | **Đã xong:** chốt đề tài, khung app + demo ném xiên, đưa lên GitHub, dàn ý báo cáo |
| 7 | 11–17/11 | Mỗi người đọc ≥ 2 bài kỹ thuật và điền bảng Ch.2; A: BFS/DFS/Dijkstra; B: đo hiệu năng + chốt ngưỡng, sắp xếp; C: con lắc/lò xo, hoàn thiện ném xiên |
| 8 | 18–24/11 | **Benchmark + bộ cảnh thử nghiệm**; A*, giao thoa sóng; nháp Ch.1–2 |
| 9 | 25/11–1/12 | **Dừng thêm tính năng**; chạy đủ thử nghiệm; viết Ch.3–4 |
| 10 | 2–8/12 | Hoàn thiện Doc (.doc + .pdf), Slide (.ppt + .pdf), video, BTLopNha; chạy thử source code trên máy khác, không có mạng |
| 11 | 9–13/12 | Rà soát, đóng gói 8 thư mục, tập thuyết trình; gửi mail `[K2024-CLC-DHMT-TEN NHOM]` đúng ngày thi |

Họp nhóm mỗi tuần 15–30 phút. Mỗi người làm trên nhánh Git riêng, A review trước khi gộp vào `main`.

## 6. Rủi ro
- **Trễ tiến độ:** cắt theo thứ tự con lắc/lò xo → A* → phần thêm của ném xiên. Không cắt benchmark, vì đó là số liệu chính của Ch.4.
- **Báo cáo dồn cuối:** mỗi tuần viết luôn phần báo cáo ứng với code vừa làm.
