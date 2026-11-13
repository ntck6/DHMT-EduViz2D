# Kế hoạch đồ án – Ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục

Cập nhật 13/11: theo file Chương 2 của nhóm (`Ch2. Cac cong trinh nghien cuu lien quan.md`, file chính của Ch.2): khung 5 công đoạn **C1–C5**; giải pháp nền **pipeline WebGL 2 + instancing**; phương pháp cải tiến **Loop & Blinn 2005**; giữ lại thử nghiệm (b) Euler/Verlet/RK4 và (c) Dijkstra/A*; bỏ Phụ lục A, B (nội dung về mục 3.4). Các bản cũ xem trong lịch sử Git.

## 1. Đề tài và thầy cần gì
- **Tên đề:** *Xây dựng ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục.* Yêu cầu: *trình bày cách sử dụng HTML5 + WebGL trong các tác vụ 2D (tĩnh và động).*
- **Lĩnh vực:** hỗ trợ giáo dục (Tin học, Vật lý), đã chốt thay cho hướng thiết kế logo của đề gốc (xem `PROJECT_NAME.md`).
- **Sản phẩm chính là báo cáo nghiên cứu** theo dàn ý `DAN_Y_BAO_CAO.md` (Ch.2 viết ở file Ch2). Web app EduViz2D là chương trình minh họa cho Ch.3–4.
- **Ch.3 gồm hai lớp:** giải pháp nền **pipeline WebGL 2 + instancing** (mọi cảnh vẽ bằng nó); **phương pháp cải tiến đã công bố: Loop & Blinn 2005**, thay bước chia đường cong thành đoạn thẳng, áp dụng vẽ quỹ đạo ném xiên, kiểm chứng bằng **thử nghiệm (f)**.
- **7 thử nghiệm Ch.4** (nhãn dùng chung với file Ch2 mục 2.6): (a) hiệu năng render · (b) Euler/Verlet/RK4 · (c) Dijkstra/A* · (d) instancing · (e) tính theo điểm ảnh GPU/CPU · **(f) Loop & Blinn** · (g) chọn đối tượng (tùy chọn).
- **Nộp bài:** 8 thư mục theo `REGULATION.md` (khung đã tạo ở gốc repo, mỗi thư mục có `README.md` ghi cần đặt gì), gửi link Drive đúng ngày thi lý thuyết (không trước, không sau).

## 2. Web app minh họa (EduViz2D)
| Bài / trang | Tác vụ 2D minh họa | Người làm | Trạng thái |
|---|---|---|---|
| **Ném xiên** | **Quỹ đạo vẽ bằng Loop & Blinn** (phương pháp cải tiến), so với 120 đoạn thẳng, phóng to tới 64×; animation | A (quỹ đạo), C (mô hình, tương tác) | Quỹ đạo Loop & Blinn **xong**; C còn kéo mũi tên v₀, bia |
| **Thử nghiệm (f)** `benchmark/curve.html` | Đo sai số, độ phủ, số đỉnh, thời gian của Loop & Blinn so với đoạn thẳng | A | **Xong**, còn đo trên máy thật |
| Sắp xếp | Nhiều đối tượng bằng WebGL thuần (instancing, giải pháp nền) | B | Vẽ + tương tác đã có; còn thuật toán |
| BFS/DFS/Dijkstra | Tương tác chọn, kéo-thả; vẽ chữ | A | Chưa làm |
| A* | Lưới nhiều ô cập nhật theo bước; chạy cạnh Dijkstra cho **thử nghiệm (c)** | B | Chưa làm |
| Con lắc/lò xo | Cập nhật trạng thái theo thời gian; 3 integrator cạnh nhau cho **thử nghiệm (b)** | C | Chưa làm |
| Giao thoa sóng | Tính màu từng điểm ảnh bằng fragment shader; kèm bản CPU cho **thử nghiệm (e)** | C | Shader đã nối sẵn, chưa có công thức |
| Pipeline WebGL từng bước | Giải pháp nền: toàn bộ pipeline WebGL thuần; có đo instancing cho **thử nghiệm (d)** | A | **Xong** |
| Benchmark `benchmark/index.html` | **Thử nghiệm (a)**: Canvas 2D / PixiJS / WebGL thuần | A | **Xong**, còn đo trên máy thật |
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
| **A – Leader** | Đã xong: khung app, lớp WebGL thuần, **Loop & Blinn + thử nghiệm (f)**, bài Pipeline, benchmark, xuất PNG. Còn: BFS/DFS/Dijkstra, **đo (f), (a), (d) trên máy thật** | Ch.1; file Ch2: 2.1, 2.2, 2.3.1, 2.3.3, 2.4–2.6 + gộp bảng; **3.1–3.3, 3.7**; 4.1, 4.3, Ch.4 phần (f), (a), (d); Ch.5; ghép Doc | Personal Information, Drive, nộp bài, chốt tên nhóm |
| **B** | Sắp xếp (thuật toán + phát lại), A* + Dijkstra trên lưới; **công cụ đo thử nghiệm (c)**; (g) chọn đối tượng nếu kịp | File Ch2: Bảng 2.2 dòng VisuAlgo, algorithm-visualizer, 2.3.4 phần Tin học; **3.4 phần thuật toán; 3.6 cập nhật động và tương tác**; Ch.4 phần (c), (g) | **Slide**; tìm 1–2 luận văn |
| **C** | Ném xiên (kéo v₀, bia), con lắc/lò xo + integrator (**thử nghiệm b**), giao thoa sóng + bản CPU (**thử nghiệm e**) | File Ch2: Bảng 2.2 dòng PhET, Falstad, 2.3.4 phần Vật lý; **3.4 phần vật lý; 3.5 tính theo từng điểm ảnh trên GPU**; Ch.4 phần (b), (e) | **Video demo**; tải PDF vào Reference |
| Cả nhóm | Review chéo code | Góp ý báo cáo | BTLopNha |

## 4. Phân công theo tuần
Hạn của mỗi tuần: **Chủ nhật 20:00**, đẩy code lên nhánh riêng và mở Pull Request. Họp nhóm tối Chủ nhật 15–30 phút: đã làm / sẽ làm / vướng mắc.

### Tuần 7 (11–17/11) – Nắm phương pháp, chạy được các phần cốt lõi
| Người | Việc | Kết quả nộp cuối tuần |
|---|---|---|
| **A** | ~~Đọc toàn văn Loop & Blinn 2005~~ **đã đối chiếu ngày 13/11** (bảng 3.3.5 trong dàn ý); đọc lại khi viết 3.3. Đo (f), (a), (d) trên máy thật, lưu CSV. Viết `cs/graph-algorithms.js` (BFS, DFS, Dijkstra bằng generator) + test. Chốt tên nhóm; hỏi đề bài BTLopNha | Ghi chú đọc bài; 3 file CSV; test đồ thị chạy |
| **B** | `cs/sorting-algorithms.js`: Bubble, Quick, Merge, Heap bằng generator + test. Nối vào `sorting.js`: Play/Pause/Step, tô màu, đặt `locked` khi chạy. Đọc Hundhausen 2002, Shaffer 2010 | Bài Sắp xếp chạy thuật toán; 2 phiếu tóm tắt |
| **C** | Ném xiên: kéo đầu mũi tên v₀, bia mục tiêu (không đổi phần vẽ quỹ đạo). `physics/integrators.js`: Euler, Verlet, RK4 + test với nghiệm lò xo. Đọc Wieman 2008, Banda 2021, Wang 2025 | Kéo v₀ chạy được; test integrator; 3 phiếu tóm tắt |
| Cả nhóm | Đọc file Ch2, làm các mục "Việc còn lại trước khi nộp" ở cuối file thuộc phần mình | File Ch2 hết việc tồn |

### Tuần 8 (18–24/11) – Hoàn thành các bài bắt buộc, viết nháp Ch.1–2
| Người | Việc | Kết quả nộp cuối tuần |
|---|---|---|
| **A** | Bài BFS/DFS/Dijkstra: kéo node, thêm node/cạnh, Dijkstra tính lại khi kéo, nhãn BitmapText. Viết nháp Ch.1, chỉnh file Ch2 và **3.3 Loop & Blinn** | Bài đồ thị chạy; nháp Ch.1–2, 3.3 |
| **B** | `cs/pathfinding.js` (A*, Dijkstra trên lưới) + test; bài A*: vẽ tường, kéo điểm đầu/đích. Đo ngưỡng sắp xếp. **Tìm 1–2 luận văn Thạc sĩ/Tiến sĩ** (TUTORIAL 2.3). Nháp 3.4 phần thuật toán, 3.6 (cập nhật động, tương tác) | Bài A* chạy; phiếu luận văn; nháp 3.4, 3.6 |
| **C** | Bài Con lắc/lò xo: 3 integrator chạy cạnh nhau, kéo quả nặng. Giao thoa sóng: công thức trong shader, kéo 2 nguồn. Nháp 3.4 phần vật lý, 3.5 (tính theo điểm ảnh) | 2 bài chạy; nháp 3.4, 3.5 |
| Cả nhóm | **Demo nội bộ Chủ nhật 24/11**: chạy thử mọi bài bắt buộc | Danh sách lỗi cần sửa |

### Tuần 9 (25/11–1/12) – Dừng thêm tính năng, chạy đủ thử nghiệm, viết Ch.3–4
| Người | Việc | Kết quả nộp cuối tuần |
|---|---|---|
| **A** | Đo lại (f), (a), (d) trên **2 máy**; vẽ Hình 4.8, 4.9; viết 3.1, 3.2, 3.7, 4.1, 4.3, Ch.4 phần (f), (a), (d); chụp hình Ch.3 | CSV cuối; Ch.3 + phần Ch.4 của A |
| **B** | **Thử nghiệm (c)**: chạy A* và Dijkstra trên 90 bản đồ (mục 4.3), xuất CSV; Ch.4 phần (c). Nếu còn thời gian: trang đo (g). Dựng khung Slide theo 5 chương | Bảng 4.8; khung Slide |
| **C** | **Thử nghiệm (e)**: bản CPU của sóng (Canvas 2D `ImageData`), đo 4 độ phân giải. **Thử nghiệm (b)**: 3 integrator × 3 bước Δt, xuất CSV sai số và năng lượng. Ch.4 phần (b), (e). Quay video demo bản nháp | Bảng 4.6, 4.7; video nháp |
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
| **B** | Tập thuyết trình phần Ch.2 (Tin học), 3.6, thử nghiệm (c) và điều khiển slide |
| **C** | Tập thuyết trình phần Vật lý, chạy demo trực tiếp |
| Cả nhóm | Tổng duyệt thuyết trình ít nhất 1 lần |

## 5. Tài liệu
**Trọng tâm (Ch.2–3):** danh mục [1]–[21] ở cuối file Ch2 và bảng tài liệu trong `DAN_Y_BAO_CAO.md`. **Loop & Blinn 2005 là bài phải đọc toàn văn đầu tiên** (A). Các bài khác: Green 2007, Kilgard & Bolz 2012, Ganacim 2014, Li 2016, Horak 2018, Meisters 1975, Eder 2018.
- Từ khóa tìm luận văn: `master thesis WebGL rendering performance`, `thesis GPU curve rendering`, `thesis interactive physics simulation web`.
- Tài liệu học: MDN (Canvas, WebGL), webgl2fundamentals.org, The Book of Shaders, tài liệu PixiJS.

**Phụ (Ch.1, mục 2.3.4):** Wieman 2008, Banda & Nzabahimana 2021, Wang 2025, Hundhausen 2002, Naps 2002, Shaffer 2010. OpenStax mục 4.3 là nghiệm tham chiếu ném xiên.

**Cách ghi tài liệu:** mỗi tài liệu một phiếu tóm tắt gồm tên, tác giả, năm, DOI/link, nội dung chính, dùng cho mục nào, điền được cột nào của Bảng 2.1–2.3 (file Ch2). Bản PDF lưu vào thư mục `Reference/` ở gốc repo.

## 6. Rủi ro
- **Trễ tiến độ:** cắt theo thứ tự (g) chọn đối tượng → con lắc kéo thả → "đoán bước tiếp" → điện trường. **Không cắt** Loop & Blinn, thử nghiệm (f), (a), ném xiên. (b), (c) đã nằm trong file Ch2 mục 2.6 nên phải có, nhưng được làm gọn (ít kịch bản hơn).
- **Lạc đề sang vật lý / thuật toán:** C2 và thử nghiệm (b), (c) không phải đồ họa. Trong Ch.3–4 viết ngắn, nói rõ chúng kiểm tra dữ liệu đầu vào cho phần vẽ; (a), (d), (e), (f) viết trước và kỹ hơn.
- **Bài báo Loop & Blinn khác với cách cài:** ghi rõ trong 3.3 phần nào làm giống, phần nào đơn giản hóa (chỉ bậc 2).
- **Báo cáo dồn cuối:** mỗi tuần viết luôn phần báo cáo ứng với code vừa làm (đã ghi trong bảng tuần).
- **Máy có 2 GPU:** trình duyệt có thể đổi GPU giữa các lần chạy; mọi CSV đã ghi tên GPU, khi đo phải kiểm tra cột này.
