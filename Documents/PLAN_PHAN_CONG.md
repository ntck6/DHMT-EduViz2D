# Kế hoạch đồ án – Ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục

Cập nhật 13/11: phương pháp chính là **Loop & Blinn 2005** (đã đối chiếu toàn văn); dàn ý viết lại theo ngôn ngữ đồ họa, nội dung vật lý/thuật toán chuyển sang phụ lục. Các bản cũ xem trong lịch sử Git.

## 1. Đề tài và thầy cần gì
- **Tên đề:** *Xây dựng ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục.* Yêu cầu: *trình bày cách sử dụng HTML5 + WebGL trong các tác vụ 2D (tĩnh và động).*
- **Lĩnh vực:** hỗ trợ giáo dục (Tin học, Vật lý), đã chốt thay cho hướng thiết kế logo của đề gốc (xem `PROJECT_NAME.md`).
- **Sản phẩm chính là báo cáo nghiên cứu** theo dàn ý `DAN_Y_BAO_CAO.md`. Web app EduViz2D là chương trình minh họa cho Ch.3–4.
- **Phương pháp chính (Ch.3):** Loop & Blinn 2005 – vẽ đường cong Bézier bậc 2 bằng GPU, áp dụng vẽ quỹ đạo ném xiên. Kiểm chứng bằng **thử nghiệm (f)**. Pipeline WebGL, instancing, picking là **kiến thức nền**.
- **Nộp bài:** 8 thư mục theo `REGULATION.md`, gửi link Drive đúng ngày thi lý thuyết (không trước, không sau).

## 2. Web app minh họa (EduViz2D)
| Bài / trang | Tác vụ 2D minh họa | Người làm | Trạng thái |
|---|---|---|---|
| **Ném xiên** | **Quỹ đạo vẽ bằng Loop & Blinn** (phương pháp chính), so với 120 đoạn thẳng, phóng to tới 64×; animation | A (quỹ đạo), C (mô hình, tương tác) | Quỹ đạo Loop & Blinn **xong**; C còn kéo mũi tên v₀, bia |
| **Thử nghiệm (f)** `benchmark/curve.html` | Đo sai số, độ phủ, số đỉnh, thời gian của Loop & Blinn so với đoạn thẳng | A | **Xong**, còn đo trên máy thật |
| Sắp xếp | Nhiều đối tượng bằng WebGL thuần (instancing) | B | Vẽ + tương tác đã có; còn thuật toán |
| BFS/DFS/Dijkstra | Tương tác chọn, kéo-thả; vẽ chữ | A | Chưa làm |
| A* | Lưới nhiều ô cập nhật theo bước | B | Chưa làm |
| Con lắc/lò xo | Cập nhật trạng thái theo thời gian | C | Chưa làm |
| Giao thoa sóng | Tính màu từng điểm ảnh bằng fragment shader; kèm bản CPU để so | C | Shader đã nối sẵn, chưa có công thức |
| Pipeline WebGL từng bước | Kiến thức nền: toàn bộ pipeline WebGL thuần | A | **Xong** |
| Benchmark `benchmark/index.html` | Kiến thức nền: Canvas 2D / PixiJS / WebGL thuần | A | **Xong**, còn đo trên máy thật |
| Xuất PNG, toàn màn hình, phím tắt | Các API HTML5 | A | **Xong** |

**Tương tác trực tiếp với phần tử:**
| Bài | Tương tác | Mức | Trạng thái |
|---|---|---|---|
| Sắp xếp (B) | Kéo-thả đổi chỗ, vẽ chiều cao cột, xem giá trị, mẫu dữ liệu; khóa khi thuật toán chạy | Bắt buộc | **Đã có**; B nối với thuật toán |
| Sắp xếp (B) | "Đoán bước tiếp" | Nếu kịp | Chưa làm |
| BFS/DFS/Dijkstra (A) | Kéo node, thêm node/cạnh, đường ngắn nhất tính lại ngay; chọn node bằng GPU picking | Bắt buộc | Chưa làm |
| A* (B) | Vẽ/xóa tường, kéo điểm đầu/đích | Bắt buộc | Chưa làm |
| Ném xiên (C) | Kéo đầu mũi tên v₀; bia kéo được, thử bắn trúng | Bắt buộc | Chưa làm |
| Con lắc/lò xo (C) | Kéo quả nặng rồi thả | Nếu kịp | Chưa làm |
| Giao thoa sóng (C) | Kéo 2 nguồn; bấm một điểm xem biên độ | Bắt buộc | Chưa làm |

**Lưu ý kỹ thuật**
- **Sắp xếp:** đến khoảng 2.000 phần tử thì ghi lại từng bước để tua; lớn hơn chỉ chạy Quick/Merge/Heap trực tiếp. B đo để chốt ngưỡng.
- **Ném xiên:** phần vẽ quỹ đạo (`drawCurve` trong `js/physics/projectile.js`) do A giữ. C sửa phần tương tác, không đổi cách vẽ quỹ đạo.
- **Chữ:** nhãn node dùng BitmapText (Horak 2018: chữ vẽ trong WebGL làm tụt hiệu năng).

**Công nghệ:** HTML5 + CSS; JavaScript thuần (ES modules, không build); PixiJS 8.22.0 ở `Source code/lib/pixi.min.js`; WebGL 2 thuần nhóm tự viết ở `Source code/js/webgl/` (Loop & Blinn, đoạn thẳng, ma trận, ear clipping, instancing, picking). Chạy bằng Live Server hoặc `python -m http.server` (xem `Source code/README.md`).

## 3. Phân công tổng
| Thành viên | Code | Báo cáo (theo `DAN_Y_BAO_CAO.md`) | Khác |
|---|---|---|---|
| **A – Leader** | Đã xong: khung app, lớp WebGL thuần, **Loop & Blinn + thử nghiệm (f)**, bài Pipeline, benchmark, xuất PNG. Còn: BFS/DFS/Dijkstra, **đo (f), (a), (e) trên máy thật** | Ch.1; 2.2, 2.3, 2.5 + gộp Bảng 2.2; **3.1–3.3, 3.6**; 4.1, 4.3, Ch.4 phần (f), (a), (e); Ch.5; ghép Doc | Personal Information, Drive, nộp bài, chốt tên nhóm |
| **B** | Sắp xếp (thuật toán + phát lại), A*; **công cụ đo thử nghiệm (g) chọn đối tượng** | 2.1 phần Tin học; Bảng 2.2a dòng VisuAlgo, algorithm-visualizer; **3.4 cập nhật động và tương tác**; Ch.4 phần (g); **Phụ lục B** (thuật toán) | **Slide**; tìm 1–2 luận văn |
| **C** | Ném xiên (kéo v₀, bia), con lắc/lò xo + integrator, giao thoa sóng + bản CPU | 2.1 phần Vật lý; Bảng 2.2a dòng PhET, Falstad; **3.5 tính theo từng điểm ảnh trên GPU**; Ch.4 phần (c); **Phụ lục A** (công thức vật lý) | **Video demo**; tải PDF vào Reference |
| Cả nhóm | Review chéo code | Góp ý báo cáo | BTLopNha |

## 4. Phân công theo tuần
Hạn của mỗi tuần: **Chủ nhật 20:00**, đẩy code lên nhánh riêng và mở Pull Request. Họp nhóm tối Chủ nhật 15–30 phút: đã làm / sẽ làm / vướng mắc.

### Tuần 7 (11–17/11) – Nắm phương pháp, chạy được các phần cốt lõi
| Người | Việc | Kết quả nộp cuối tuần |
|---|---|---|
| **A** | ~~Đọc toàn văn Loop & Blinn 2005~~ **đã đối chiếu ngày 13/11** (bảng 3.3.5 trong dàn ý); đọc lại khi viết 3.3. Đo (f), (a), (e) trên máy thật, lưu CSV. Viết `cs/graph-algorithms.js` (BFS, DFS, Dijkstra bằng generator) + test. Chốt tên nhóm; hỏi đề bài BTLopNha | Ghi chú đọc bài; 3 file CSV; test đồ thị chạy |
| **B** | `cs/sorting-algorithms.js`: Bubble, Quick, Merge, Heap bằng generator + test. Nối vào `sorting.js`: Play/Pause/Step, tô màu, đặt `locked` khi chạy. Đọc Hundhausen 2002, Shaffer 2010 | Bài Sắp xếp chạy thuật toán; 2 phiếu tóm tắt |
| **C** | Ném xiên: kéo đầu mũi tên v₀, bia mục tiêu (không đổi phần vẽ quỹ đạo). `physics/integrators.js`: Euler, Verlet, RK4 + test với nghiệm lò xo. Đọc Wieman 2008, Banda 2021, Wang 2025 | Kéo v₀ chạy được; test integrator; 3 phiếu tóm tắt |
| Cả nhóm | Điền các ô [cần kiểm chứng] của Bảng 2.2 thuộc phần mình | Bảng 2.2 bớt ô trống |

### Tuần 8 (18–24/11) – Hoàn thành các bài bắt buộc, viết nháp Ch.1–2
| Người | Việc | Kết quả nộp cuối tuần |
|---|---|---|
| **A** | Bài BFS/DFS/Dijkstra: kéo node, thêm node/cạnh, Dijkstra tính lại khi kéo, nhãn BitmapText. Viết nháp Ch.1, 2.2, 2.3, 2.5 và **3.3 Loop & Blinn** | Bài đồ thị chạy; nháp Ch.1–2, 3.3 |
| **B** | `cs/pathfinding.js` (A*, Dijkstra trên lưới) + test; bài A*: vẽ tường, kéo điểm đầu/đích. Đo ngưỡng sắp xếp. **Tìm 1–2 luận văn Thạc sĩ/Tiến sĩ** (TUTORIAL 2.3). Nháp 2.1 phần Tin học, 3.4 (cập nhật động, tương tác), Phụ lục B | Bài A* chạy; phiếu luận văn; nháp 2.1, 3.4 |
| **C** | Bài Con lắc/lò xo: 3 integrator chạy cạnh nhau, kéo quả nặng. Giao thoa sóng: công thức trong shader, kéo 2 nguồn. Nháp 2.1 phần Vật lý, 3.5 (tính theo điểm ảnh), Phụ lục A | 2 bài chạy; nháp 2.1, 3.5 |
| Cả nhóm | **Demo nội bộ Chủ nhật 24/11**: chạy thử mọi bài bắt buộc | Danh sách lỗi cần sửa |

### Tuần 9 (25/11–1/12) – Dừng thêm tính năng, chạy đủ thử nghiệm, viết Ch.3–4
| Người | Việc | Kết quả nộp cuối tuần |
|---|---|---|
| **A** | Đo lại (f), (a), (e) trên **2 máy**; vẽ Hình 4.1, 4.2; viết 3.1, 3.2, 3.6, 4.1, 4.3, Ch.4 phần (f), (a), (e); chụp hình Ch.3 | CSV cuối; Ch.3 + phần Ch.4 của A |
| **B** | Viết trang đo thử nghiệm (g): hit-test và GPU picking với 100 / 1.000 / 10.000 đối tượng, 1.000 vị trí chuột; Ch.4 phần (g). Dựng khung Slide theo 5 chương | Bảng 4.7; khung Slide |
| **C** | Thử nghiệm (c): bản CPU của sóng (Canvas 2D `ImageData`), đo 4 độ phân giải. Ch.4 phần (c). (So integrator nếu còn thời gian, đặt ở Phụ lục A.) Quay video demo bản nháp | Bảng 4.6; video nháp |
| Cả nhóm | Sửa lỗi từ demo nội bộ; **không thêm tính năng mới** | Bản nháp đủ 5 chương |

### Tuần 10 (2–8/12) – Hoàn thiện sản phẩm nộp
| Người | Việc | Kết quả nộp cuối tuần |
|---|---|---|
| **A** | Ch.5; ghép toàn bộ Doc, đánh số bảng/hình, danh mục tài liệu; lưu `.doc` + `.pdf`; Personal Information (họ tên, MSSV, bảng phân công này) | Doc bản gần cuối |
| **B** | Slide hoàn chỉnh (`.ppt` + `.pdf`, chép kèm font); review Ch.3–4 | Slide |
| **C** | Video demo hoàn chỉnh; tải PDF các tài liệu vào thư mục Reference; review Ch.1–2 | Video; thư mục Reference |
| Cả nhóm | BTLopNha; chép source sang máy khác, tắt mạng, chạy thử mọi bài; điền thư mục Data (CSV, ảnh kết quả) | BTLopNha; Data |

### Tuần 11 (9–13/12) – Rà soát và nộp
| Người | Việc |
|---|---|
| **A** | Rà theo `KIEM_TRA_YEU_CAU.md`; đóng gói 8 thư mục; upload Drive; **gửi mail `[K2024-CLC-DHMT-TEN NHOM]` đúng ngày thi**, không trước, không sau |
| **B** | Tập thuyết trình phần Ch.2 (Tin học), 3.4 và điều khiển slide |
| **C** | Tập thuyết trình phần Vật lý, chạy demo trực tiếp |
| Cả nhóm | Tổng duyệt thuyết trình ít nhất 1 lần |

## 5. Tài liệu
**Trọng tâm (Ch.2–3):** danh sách đã đối chiếu DOI trong `DAN_Y_BAO_CAO.md`. **Loop & Blinn 2005 là bài phải đọc toàn văn đầu tiên** (A). Các bài khác: Green 2007, Kilgard & Bolz 2012, Ganacim 2014, Li 2016, Horak 2018, Meisters 1975, Eder 2018.
- Từ khóa tìm luận văn: `master thesis WebGL rendering performance`, `thesis GPU curve rendering`, `thesis interactive physics simulation web`.
- Tài liệu học: MDN (Canvas, WebGL), webgl2fundamentals.org, The Book of Shaders, tài liệu PixiJS.

**Phụ (Ch.1 phần động lực):** Wieman 2008, Banda & Nzabahimana 2021, Wang 2025, Hundhausen 2002, Shaffer 2010. OpenStax mục 4.3 là nghiệm tham chiếu ném xiên.

**Cách ghi tài liệu:** mỗi tài liệu một phiếu tóm tắt gồm tên, tác giả, năm, DOI/link, nội dung chính, dùng cho mục nào, điền được cột nào của Bảng 2.2. Bản PDF lưu vào thư mục `Reference`.

## 6. Rủi ro
- **Trễ tiến độ:** cắt theo thứ tự so sánh integrator / Dijkstra–A* (phụ lục) → con lắc kéo thả → "đoán bước tiếp" → điện trường. **Không cắt** Loop & Blinn, thử nghiệm (f), ném xiên.
- **Bài báo Loop & Blinn khác với cách cài:** ghi rõ trong 3.3 phần nào làm giống, phần nào đơn giản hóa (chỉ bậc 2).
- **Báo cáo dồn cuối:** mỗi tuần viết luôn phần báo cáo ứng với code vừa làm (đã ghi trong bảng tuần).
- **Máy có 2 GPU:** trình duyệt có thể đổi GPU giữa các lần chạy; mọi CSV đã ghi tên GPU, khi đo phải kiểm tra cột này.
