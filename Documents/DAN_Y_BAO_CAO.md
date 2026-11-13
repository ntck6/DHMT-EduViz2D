# Dàn ý chi tiết báo cáo – Xây dựng ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục

Theo `FORMAT_PRESENTATION.md` (5 chương) và các lỗi cần tránh trong `MANUAL_FAULT.md`. Bảng đối chiếu từng yêu cầu: `KIEM_TRA_YEU_CAU.md`.

**Trọng tâm của báo cáo là đồ họa 2D trên web bằng HTML5 + WebGL.** Giáo dục (Tin học, Vật lý) là **nơi áp dụng**: nó sinh ra các cảnh cần vẽ. Vì vậy Ch.1–4 viết bằng ngôn ngữ đồ họa (điểm ảnh, đỉnh, ma trận, shader, lệnh vẽ, thời gian khung hình).

**Khung chung là 5 công đoạn C1–C5** theo file Chương 2 (`Ch2. Cac cong trinh nghien cuu lien quan.md`, file chính của Ch.2). C2 (mô hình hóa, tính toán: công thức vật lý, thuật toán) chỉ viết ngắn ở mục 3.4 và thử nghiệm (b), (c); các phần về vẽ (C3–C5) và thử nghiệm (a), (d), (e), (f) viết trước và kỹ hơn, để báo cáo không lệch sang vật lý hay thuật toán.

**Cách đọc dàn ý:** mỗi mục ghi 5 thứ:
- **Viết gì:** các ý phải có, theo thứ tự.
- **Bảng/Hình:** bảng, hình cần chèn, đánh số sẵn.
- **Đoạn mẫu:** viết sẵn để sửa lại, không chép nguyên.
- **Độ dài:** gợi ý số trang (khổ A4, cỡ chữ 13). Đây là con số nhóm tự đặt, thầy không quy định.
- **Người viết.**

Chỗ nào ghi **[cần số đo]** hay **[cần kiểm chứng]** thì phải thay bằng số liệu hoặc nguồn thật trước khi nộp.

**Quan hệ với file Chương 2:** Chương 2 viết đầy đủ ở `Ch2. Cac cong trinh nghien cuu lien quan.md`. Hai file dùng **chung** khung C1–C5 (Bảng 1.2), chung nhãn thử nghiệm (a)–(g), chung số trích dẫn [1]–[27] (danh mục ở cuối Ch.2 trong dàn ý này). Sửa một chỗ thì sửa cả hai.

**Trạng thái từng phần (cập nhật 14/11/2026):**
| Phần | Nội dung đã có | Còn thiếu | Người |
|---|---|---|---|
| Ch.1 | Dàn ý đủ 4 mục, đoạn mẫu cho từng mục, Bảng 1.1–1.4 | Viết thành văn; vẽ Hình 1.1 | A |
| Ch.2 | **Đã viết dạng văn** (file Ch2), 4 bảng theo mẫu của thầy, nguồn đã kiểm chứng | Ảnh chụp làm bằng chứng cho PhET, VisuAlgo, algorithm-visualizer | A, B, C |
| Ch.3 | Dàn ý, công thức, giả mã, đối chiếu bài báo (3.3.5), code 3.2, 3.3, 3.6 đã chạy | Viết văn; hình; code 3.4 (integrator, A*), 3.5 (sóng) | A, B, C |
| Ch.4 | Bộ kịch bản 7 thử nghiệm, công cụ đo (a), (d), (f), số chạy thử | Số đo trên máy thật; công cụ (b), (c), (e), (g) | Cả nhóm |
| Ch.5 | Dàn ý, đoạn mẫu | Điền số từ Ch.4 | A |

## Phần đầu báo cáo (không tính vào 5 chương)
- **Bìa:** tên trường, khoa, môn Đồ họa máy tính, tên đề tài, tên nhóm, họ tên và MSSV, giảng viên, tháng 12/2026.
- **Mục lục; danh mục bảng; danh mục hình; danh mục từ viết tắt** (GPU, CPU, API, SVG, DOM, VAO, FPS, GLSL, DPR…).
- **Tóm tắt (~1/2 trang):**
> Báo cáo khảo sát cách sử dụng HTML5 và WebGL cho các tác vụ đồ họa 2D tĩnh và động, áp dụng trong ứng dụng trực quan hóa kiến thức Tin học và Vật lý. Bài toán được chia thành 5 công đoạn: biểu diễn dữ liệu, tính toán, ánh xạ sang hình học 2D, render, và tương tác. Báo cáo so sánh 15 công trình liên quan theo các công đoạn này, chọn pipeline WebGL 2 kết hợp instancing làm giải pháp nền, và trình bày, cài đặt lại phương pháp vẽ đường cong độc lập độ phân giải của Loop và Blinn (2005) làm phương pháp cải tiến cho bước vẽ đường cong. Bảy thử nghiệm đo hiệu năng render, sai số hình học, sai số tích phân số và số ô duyệt của thuật toán tìm đường trên ứng dụng EduViz2D do nhóm xây dựng. [Một câu kết quả chính từ Ch.4.]

## Báo cáo này thuộc kiểu gì?
Thầy cần **báo cáo khảo sát và cài đặt lại**: giống một luận văn thu nhỏ, nhưng không cần phát minh gì mới (TUTORIAL: "đọc, hiểu, cài đặt lại; chưa đòi hỏi đề xuất giải pháp mới"). Mạch của cả báo cáo:

> Bài toán là gì → người ta đã giải thế nào (khảo sát) → chọn một cách tiên tiến, giải thích nó hoạt động ra sao → cài lại, đo đạc, nhận xét.

| | Báo cáo khảo sát và cài đặt lại (**thầy cần**) | Báo cáo mô tả phần mềm (**không phải**) |
|---|---|---|
| Câu hỏi chính | Vẽ 2D tĩnh và động bằng HTML5 + WebGL thế nào? Cách nào tốt hơn, vì sao? | App của nhóm có những chức năng gì? |
| Nội dung chính | Bài toán, các giải pháp đã có, nguyên lý, giải thuật, số liệu đo | Yêu cầu, sơ đồ use case, giao diện, hướng dẫn dùng |
| Vai trò của app | Bằng chứng cho Ch.3 và nguồn số liệu cho Ch.4 | Là toàn bộ nội dung báo cáo |
| Ví dụ câu viết | "Fragment shader tính u² − v tại từng điểm ảnh, nên đường cong vẫn mịn ở mọi mức phóng to." | "Người dùng bấm nút Play để bắt đầu mô phỏng." |

Ảnh chụp app chỉ dùng để minh họa một kỹ thuật hay một kết quả đo, không để giới thiệu tính năng.

---

## Chương 1. Giới thiệu *(A, khoảng 4–5 trang)*

### 1.1. Bối cảnh chung *(~1 trang)*
**Viết gì:**
1. Trình duyệt web có trên mọi máy tính và điện thoại, không cần cài đặt. HTML5 cho 3 cách vẽ 2D:
   - **SVG:** mỗi hình là một phần tử trang;
   - **Canvas 2D:** gọi lệnh vẽ lên thẻ `<canvas>`;
   - **WebGL:** lập trình GPU trực tiếp bằng shader, cũng vẽ lên `<canvas>`.
2. GPU xử lý song song hàng nghìn đỉnh và điểm ảnh; nó vẽ được điểm, đoạn thẳng và tam giác, nên **mọi vùng tô phải chia thành tam giác** (cùng cách nói với file Ch2, mục 2.2). Vì vậy hình 2D, nhất là đường cong, phải được "chuyển" về dạng GPU vẽ được, và có nhiều cách chuyển.
3. Ứng dụng giáo dục là nơi đặt ra yêu cầu khó cho đồ họa:
   - hình tĩnh phải đúng và rõ khi phóng to (ví dụ quỹ đạo, đồ thị);
   - cảnh động phải mượt (ví dụ mô phỏng, phát lại thuật toán);
   - người học phải chạm vào được từng phần tử.
4. Từ 2017 WebGL 2 có trên mọi trình duyệt chính (Safari từ bản 15, năm 2021 [21]); WebGPU mới được hỗ trợ đủ từ cuối 2025 [15]. Vì vậy báo cáo chọn WebGL 2 làm nền (file Ch2, mục 2.2).

**Đoạn mẫu:**
> Chuẩn HTML5 cho phép vẽ đồ họa 2D trực tiếp trên trang web theo ba cách: SVG, Canvas 2D và WebGL. Trong đó chỉ WebGL cho phép lập trình bộ xử lý đồ họa (GPU) thông qua shader. GPU xử lý song song hàng nghìn điểm ảnh, nhưng vùng tô phải được chia thành tam giác, nên các hình 2D như đường cong phải được chuyển về dạng GPU vẽ được trước khi hiển thị. Các ứng dụng trực quan hóa trong giáo dục, như quỹ đạo chuyển động hay quá trình sắp xếp một mảng, đòi hỏi hình vẽ vừa đúng khi phóng to, vừa mượt khi chuyển động, vừa phản hồi ngay khi người học thao tác.

### 1.2. Động lực nghiên cứu *(~1 trang)*
**Viết gì:** chia hai ý, đúng như FORMAT_PRESENTATION yêu cầu.
- **Ý nghĩa khoa học:** vẽ 2D chất lượng cao trên GPU là bài toán có nhiều lời giải (chia đoạn thẳng rồi chia tam giác, vẽ đường cong bằng shader [1], stencil rồi tô [3], tô theo dòng quét [5]…). Trên trình duyệt, lời giải bị giới hạn bởi những gì WebGL cung cấp, nên cần khảo sát lại xem cách nào dùng được và hiệu quả đến đâu.
- **Ý nghĩa thực tiễn:**
  - Mô phỏng tương tác giúp người học hiểu khái niệm (Wieman 2008 [7]; Banda & Nzabahimana 2021 tổng hợp 31 nghiên cứu [20]; Wang et al. 2025 [22]).
  - Hundhausen 2002 [17] cho thấy hiệu quả phụ thuộc vào việc người học **được thao tác**, không chỉ xem; Naps 2002 [18] phân bậc mức tham gia đó.
  - Thao tác mượt với nhiều đối tượng đòi hỏi kỹ thuật vẽ nhanh và chọn đối tượng nhanh.

**Đoạn mẫu (ý thực tiễn):**
> Tổng quan của Banda và Nzabahimana (2021) trên 31 nghiên cứu cho thấy việc tích hợp mô phỏng PhET hỗ trợ người học hiểu khái niệm Vật lý. Với công cụ minh họa thuật toán, Hundhausen và cộng sự (2002) chỉ ra rằng mức độ người học tham gia thao tác quan trọng hơn hình thức hiển thị. Từ đó đặt ra yêu cầu kỹ thuật cho phần đồ họa: mỗi khung hình phải vẽ xong trong khoảng 16,7 ms để đạt 60 khung hình/giây, và phải xác định được người học đang chạm vào phần tử nào.

### 1.3. Phát biểu bài toán *(~1,5 trang)*
**Viết gì:** phát biểu bằng **tham số đồ họa**, không bằng tham số vật lý hay thuật toán. Gồm 3 phần: bài toán chung, framework 5 công đoạn C1–C5 (chỉ nêu công đoạn, **không** nêu phương pháp – MANUAL_FAULT mục 1) kèm **ẩn số** (mục 2), và bài toán con mà Ch.3 giải.

**Bài toán chung:** cho mô tả một cảnh 2D, tạo ra ảnh trên thẻ `<canvas>` của trang web bằng WebGL, đúng hình, mịn, đủ nhanh cho cảnh động, và phản hồi thao tác của người dùng.

**Đoạn mẫu (bài toán chung):**
> Cho dữ liệu của một bài học (mảng số, đồ thị, lưới hay trạng thái của một hệ vật lý) cùng các tham số người học chỉnh, cần tạo ra hình ảnh trên thẻ `<canvas>` của trang web bằng WebGL sao cho: hình đúng và mịn ở mọi mức phóng to, mỗi khung hình của cảnh động vẽ xong trong 16,7 ms, và ứng dụng xác định được người học đang thao tác với phần tử nào. Bài toán được chia thành 5 công đoạn (Bảng 1.2); ở mỗi công đoạn có một số ẩn số cần xác định, và các công trình ở Chương 2 khác nhau chính ở cách chúng giải các ẩn số này.

**Bảng 1.1 – Input, Output, tiêu chí:**
| | Nội dung | HTML5 / WebGL cung cấp gì |
|---|---|---|
| **Input** | (1) **Dữ liệu và tham số bài học** (C1): mảng số, đồ thị, lưới, trạng thái vật lý; tham số người học chỉnh (v₀, θ, bước sóng…)<br>(2) **Thuộc tính vẽ**: màu, độ trong suốt, bề rộng nét<br>(3) **Khung nhìn**: phép biến đổi thế giới → màn hình (dời, xoay, phóng to)<br>(4) **Khung vẽ**: kích thước W × H, `devicePixelRatio`<br>(5) Với cảnh động: **thời gian** Δt mỗi khung hình và **sự kiện** người dùng | (1) mảng JavaScript, control HTML5 (`range`, `select`)<br>(2)–(3) nạp vào **vertex buffer, uniform** của WebGL<br>(4) thẻ `<canvas>`<br>(5) `requestAnimationFrame`; sự kiện chuột, cảm ứng, bàn phím của DOM |
| **Output** | Cảnh tĩnh: **một ảnh** RGBA kích thước (W·dpr) × (H·dpr), xuất được ra PNG<br>Cảnh động: **chuỗi khung hình**, mỗi khung ≤ 16,7 ms (60 Hz)<br>Khi người dùng trỏ chuột: **đối tượng bị chọn** | Framebuffer của `<canvas>`; `toBlob` để xuất ảnh; `readPixels` để đọc lại điểm ảnh |
| **Tiêu chí tốt** | Đúng hình: sai số hình học tính bằng điểm ảnh<br>Mịn: không lộ cạnh, không răng cưa, ở mọi mức phóng to<br>Nhanh: thời gian khung hình, số lệnh vẽ, số đỉnh gửi lên GPU | Là cơ sở cho các độ đo ở 4.4 |

Dữ liệu bài học được C2–C3 đổi thành **hình học 2D** mà GPU vẽ được (đây là đối tượng của các công đoạn đồ họa):
- quỹ đạo ném xiên → một đường cong Bézier bậc 2;
- mảng cần sắp xếp → N hình chữ nhật;
- đồ thị → các hình tròn và đoạn thẳng;
- giao thoa sóng → một hàm màu cho từng điểm ảnh.

**Bảng 1.2 – Framework 5 công đoạn (dùng chung cho Ch.2–4):**
| # | Công đoạn | Ẩn số cần tìm | HTML5 / WebGL tham gia | Ví dụ: quỹ đạo ném xiên | Ví dụ: sắp xếp |
|---|---|---|---|---|---|
| C1 | Biểu diễn dữ liệu / tham số bài học | Dữ liệu mô hình hóa thế nào; người học chỉnh được tham số nào | JavaScript; control HTML5 (`range`, `select`) | v₀, góc θ, g | Mảng N số |
| C2 | Mô hình hóa và tính toán | Công thức, thuật toán nào; tính ở CPU hay GPU; sai số, độ phức tạp | JavaScript, hoặc shader | Quỹ đạo → 3 điểm điều khiển P0, P1, P2 | Thuật toán sắp xếp, ghi lại từng bước |
| C3 | Ánh xạ sang hình học 2D | Mỗi đối tượng thành primitive nào; gửi bao nhiêu đỉnh; ma trận thế giới → clip space | Vertex buffer, VAO, thuộc tính bản sao; uniform `mat3` | Xấp xỉ bằng đoạn thẳng, hay tính trực tiếp tại điểm ảnh? (để mở) | N hình chữ nhật: N lệnh vẽ hay 1 lệnh? (để mở) |
| C4 | Render | Dùng API vẽ nào (SVG, Canvas 2D, WebGL, WebGPU); điểm ảnh nào thuộc hình, màu và độ phủ; số lệnh vẽ; khung W × H, `devicePixelRatio`; trộn các lớp, xuất ảnh | Vertex / fragment shader, blending, `<canvas>`, `toBlob` | Điểm ảnh cách đường cong ≤ w/2 được tô | Cột tô màu theo trạng thái (so sánh, đổi chỗ) |
| C5 | Tương tác và điều khiển thời gian | Vẽ lại khi nào, Δt; phát lại bước; đối tượng nào bị chọn | `requestAnimationFrame`, sự kiện DOM, `readPixels` | Kéo thanh phóng to → vẽ lại | Play / pause / tua; kéo-thả đổi chỗ cột |

**Hình 1.1:** sơ đồ khối 5 công đoạn, vẽ bằng draw.io: các hộp nối mũi tên, mũi tên quay lại từ C5 về C1.

**Bảng 1.3 – Bài toán con mà Ch.3 giải (vẽ đường cong):**
| | Nội dung |
|---|---|
| Input | 3 điểm điều khiển P0, P1, P2 (tọa độ thế giới); ma trận chiếu sang điểm ảnh; bề rộng nét w; màu |
| Output | Độ phủ α(X, Y) ∈ [0, 1] cho từng điểm ảnh (X, Y) của khung vẽ |
| Tiêu chí | α ≈ 1 khi khoảng cách từ tâm điểm ảnh tới đường cong ≤ w/2, giảm về 0 trong 1 điểm ảnh tiếp theo; sai số không tăng khi phóng to; ít đỉnh gửi lên GPU |
| Ẩn số | Biểu diễn đường cong sao cho GPU kiểm tra được từng điểm ảnh; cách ước lượng khoảng cách tới đường cong; hình bao cần vẽ |

### 1.4. Đóng góp *(~0,5–1 trang)*
**Viết gì:** liệt kê đúng những gì báo cáo làm được, mỗi đóng góp chỉ rõ **bằng chứng nằm ở đâu**. Không dùng các từ "đề xuất phương pháp mới", "tốt hơn", "vượt trội". Thứ tự theo mục 2.6 của file Ch2.

**Bảng 1.4 – Đóng góp và bằng chứng:**
| # | Đóng góp | Bằng chứng trong báo cáo | Trạng thái |
|---|---|---|---|
| 1 | Khảo sát và so sánh 15 công trình (5 công nghệ render trên web, 4 ứng dụng giáo dục, 5 kỹ thuật vẽ 2D trên GPU, 1 nghiên cứu đo hiệu năng) theo **mẫu bảng của thầy và 5 công đoạn C1–C5** | Ch.2, Bảng 2.1–2.3 | Đã điền đủ mọi ô; Li 2016 còn lấy theo tóm tắt |
| 2 | Engine chung cho module Tin học và Vật lý, tĩnh và động, trên **pipeline WebGL 2 + instancing** (giải pháp nền) | Mục 3.2, Bảng 4.2, thư mục Source code | Khung và bài Pipeline xong; các bài khác đang làm |
| 3 | **Trình bày và cài đặt lại Loop & Blinn (2005) trên WebGL** (phương pháp cải tiến) cho Bézier bậc 2, áp dụng vẽ quỹ đạo ném xiên | Mục 3.3, `js/webgl/loop-blinn.js` | **Code xong** |
| 4 | **Kiểm chứng Loop & Blinn bằng thử nghiệm (f)**: sai số hình học, độ phủ, số đỉnh, so với chia đoạn thẳng, ở 4 mức phóng to | Bảng 4.3 | Công cụ xong, có số chạy thử; **[đo lại trên máy thật]** |
| 5 | Đo hiệu năng render Canvas 2D / PixiJS / WebGL thuần (a), instancing (d), tính theo điểm ảnh GPU so với CPU (e) | Bảng 4.4–4.6 | (a), (d) có công cụ; (e) chưa; **[cần số đo]** |
| 6 | So sánh Euler / Verlet / RK4 (b) và Dijkstra / A* (c) | Mục 3.4, Bảng 4.7–4.8 | Chưa có code |

**Đoạn mẫu:**
> Báo cáo có các đóng góp sau:
> (1) Khảo sát và so sánh 15 công trình liên quan, gồm công nghệ vẽ 2D trên web, ứng dụng trực quan hóa giáo dục và các kỹ thuật vẽ 2D trên GPU, theo cùng một khung 5 công đoạn (Chương 2).
> (2) Xây dựng ứng dụng minh họa EduViz2D cho hai môn Tin học và Vật lý trên pipeline WebGL 2 với kỹ thuật instancing (Mục 3.2).
> (3) Trình bày và cài đặt lại phương pháp vẽ đường cong độc lập độ phân giải của Loop và Blinn (2005) trên WebGL, áp dụng vẽ quỹ đạo ném xiên (Mục 3.3), và kiểm chứng bằng số đo sai số hình học ở nhiều mức phóng to (Mục 4.4).
> (4) Đo hiệu năng của Canvas 2D, PixiJS và WebGL thuần, của instancing và của tính toán theo từng điểm ảnh trên GPU, mở rộng phép đo của Horak và cộng sự (2018).
> (5) So sánh sai số của ba phương pháp tích phân số và số ô duyệt của hai thuật toán tìm đường, làm dữ liệu đầu vào đúng cho phần vẽ.
> Báo cáo không đề xuất thuật toán vẽ mới và không đánh giá hiệu quả học tập với người học thật.

---

## Chương 2. Các công trình nghiên cứu liên quan *(A khung + gộp; B phần Tin học; C phần Vật lý; khoảng 7–9 trang)*

**File chính: `Documents/Ch2. Cac cong trinh nghien cuu lien quan.md`** (đã viết dạng văn, có đủ bảng và danh mục [1]–[21]). Ở đây chỉ tóm tắt cấu trúc.

| Mục | Nội dung | Người viết |
|---|---|---|
| 2.1 | Mục đích, framework C1–C5 kèm ẩn số, hai độ đo (độ chính xác, độ phức tạp) | A |
| 2.2 | Tiến trình phát triển 5 giai đoạn (plugin → Canvas/WebGL 1 → thư viện → WebGL 2 → WebGPU), xen các bài báo kỹ thuật; bảng tóm tắt theo hai trục | A |
| 2.3.1 | **Bảng 2.1** – công nghệ render: SVG, Canvas 2D, PixiJS, WebGL 2 thuần, WebGPU; Horak 2018 làm cột Hiệu suất | A |
| 2.3.2 | **Bảng 2.2** – ứng dụng giáo dục: PhET, Falstad Ripple Tank (C); VisuAlgo, algorithm-visualizer (B) | B, C |
| 2.3.3 | **Bảng 2.3** – kỹ thuật vẽ 2D trên GPU: Loop & Blinn, Green, Kilgard & Bolz, Ganacim, Li; dòng cuối là đồ án | A |
| 2.3.4 | Nghiên cứu về hiệu quả giáo dục (Hundhausen, Naps, Shaffer, Wieman, Banda) | B, C |
| 2.4 | Đã có / còn thiếu ở từng công đoạn C1–C5 | A |
| 2.5 | 7 khuyết điểm còn tồn đọng, ghi công đoạn và loại vấn đề | A |
| 2.6 | Mục tiêu; giải pháp nền (pipeline WebGL 2 + instancing); **phương pháp cải tiến (Loop & Blinn 2005)**; bảng khuyết điểm → thử nghiệm (a)–(g) | A |

**Quy tắc bảng** (mẫu của thầy: Tên công trình | Nguyên lý | Pipeline C1–C5 | Hiệu suất: Data, Độ đo, Kết quả | Đóng góp | Giới hạn):
1. Không để trống ô công đoạn nào; **in đậm công đoạn mà công trình có đóng góp**.
2. Hiệu suất lấy từ chính công trình hoặc nghiên cứu đã đo nó; không có thì ghi "Không công bố số đo". Số đo của nhóm chỉ ở Ch.4.
3. Công trình chưa kiểm chứng được thì không đưa vào bảng (đã bỏ GeoGebra, Desmos). Báo cáo nộp không còn dấu (\*) hay [cần kiểm chứng].
4. Trong Word: trang nằm ngang, cỡ chữ 9–10, gộp ô tiêu đề như mẫu.

Lý do chọn Loop & Blinn (Bảng 2.4) và những điều **không được tự nhận** đã ghi ở cuối mục 2.6 file Ch2.

**Đoạn mẫu (kết Chương 2, chép vào cuối mục 2.6 khi ghép):**
> Tóm lại, các ứng dụng giáo dục như PhET hay VisuAlgo đã giải tốt bài toán trực quan hóa đúng và dễ hiểu, nhưng phần lớn vẽ bằng SVG hoặc phần tử trang và không công bố số liệu hiệu năng. Các kỹ thuật vẽ 2D tiên tiến trên GPU (Kilgard và Bolz, 2012; Ganacim và cộng sự, 2014; Li và cộng sự, 2016) cần những tính năng chưa có trong WebGL. Đồ án vì vậy chọn pipeline WebGL 2 kết hợp instancing làm giải pháp nền, và phương pháp của Loop và Blinn (2005), chỉ cần fragment shader, làm phương pháp cải tiến cho bước vẽ đường cong; Chương 3 trình bày hai giải pháp này, Chương 4 kiểm chứng chúng bằng bảy thử nghiệm.

### Danh mục tài liệu tham khảo chung (dùng cho cả báo cáo)
Số [1]–[21] **trùng với file Ch2**; [22]–[27] là tài liệu chỉ dùng ở Ch.1, 3. Mọi DOI đã đối chiếu với Crossref ngày 14/11/2026. Chi tiết đầy đủ (tác giả, tập, trang) của [1]–[21] ở cuối file Ch2.

| Số | Tài liệu | DOI / link | Dùng ở | Ai đọc |
|---|---|---|---|---|
| [1] | Loop, Blinn. *Resolution independent curve rendering using programmable graphics hardware*. ACM TOG 24(3), 2005 | 10.1145/1073204.1073303. **Toàn văn:** `Reference/p1000-loop.pdf` | 1.2; Ch2 2.2, 2.3.3, 2.6; **3.3**; 4.5; Ch.5 | A |
| [2] | Green. *Improved alpha-tested magnification for vector textures and special effects*. SIGGRAPH 2007 Courses | 10.1145/1281500.1281665 (đã đọc toàn văn) | Ch2 2.2, 2.3.3; Ch.5 | B |
| [3] | Kilgard, Bolz. *GPU-accelerated path rendering*. ACM TOG 31(6), 2012 | 10.1145/2366145.2366191 | 1.2; Ch2 2.2, 2.3.3 | A |
| [4] | Ganacim, Lima, de Figueiredo, Nehab. *Massively-parallel vector graphics*. ACM TOG 33(6), 2014 | 10.1145/2661229.2661274 | Ch2 2.2, 2.3.3; Ch.5 | C |
| [5] | Li, Hou, Zhou. *Efficient GPU path rendering using scanline rasterization*. ACM TOG 35(6), 2016 | 10.1145/2980179.2982434 | 1.2; Ch2 2.2, 2.3.3; Ch.5 | C |
| [6] | Horak, Kister, Dachselt. *Comparing rendering performance of common web technologies for large graphs*. IEEE VIS 2018 Poster | Poster, không có DOI (đã đọc toàn văn) | Ch2 2.2, 2.3.1; 4.3, 4.5 | A |
| [7] | Wieman, Adams, Perkins. *PhET: Simulations that enhance learning*. Science 322, 2008 | 10.1126/science.1161948 | 1.2; Ch2 2.3.2, 2.3.4 | C |
| [8] | Falstad. *Ripple Tank Simulation* | falstad.com/ripple; github.com/pfalstad/ripplegl-ts | Ch2 2.2, 2.3.2 | C |
| [9] | Halim et al. *VisuAlgo* | visualgo.net | Ch2 2.2, 2.3.2 | B |
| [10] | *algorithm-visualizer* | github.com/algorithm-visualizer | Ch2 2.2, 2.3.2 | B |
| [11] | WHATWG. *HTML Living Standard – canvas* | html.spec.whatwg.org | 1.1; Ch2 2.2, 2.3.1 | A |
| [12] | W3C. *SVG 2* | w3.org/TR/SVG2 | 1.1; Ch2 2.2, 2.3.1 | A |
| [13] | Khronos. *WebGL 2.0 Specification* | registry.khronos.org/webgl | 1.1; Ch2 2.3.1, 2.6; **3.2** | A |
| [14] | PixiJS v8 documentation, ghi chú phát hành v8.1.0 | pixijs.com | Ch2 2.2, 2.3.1; 4.1 | A |
| [15] | W3C *WebGPU*; Beaufort, *WebGPU is now supported in major browsers*, web.dev 25/11/2025 | web.dev/blog/webgpu-supported-major-browsers | 1.1; Ch2 2.2, 2.3.1; Ch.5 | A |
| [16] | PhET. *Scenery* | github.com/phetsims/scenery | Ch2 2.2, 2.3.2 | C |
| [17] | Hundhausen, Douglas, Stasko. *A meta-study of algorithm visualization effectiveness*. JVLC 13(3), 2002 | 10.1006/jvlc.2002.0237 | 1.2; Ch2 2.2, 2.3.4 | B |
| [18] | Naps et al. *Exploring the role of visualization and engagement in CS education*. ITiCSE-WGR 2002 | 10.1145/960568.782998 | 1.2; Ch2 2.2, 2.3.4 | B |
| [19] | Shaffer et al. *Algorithm visualization: the state of the field*. ACM TOCE 10(3), 2010 | 10.1145/1821996.1821997 | Ch2 2.3.4 | B |
| [20] | Banda, Nzabahimana. *Effect of integrating physics education technology simulations on students' conceptual understanding in physics: A review of literature*. Phys. Rev. PER 17, 2021 | 10.1103/PhysRevPhysEducRes.17.023108 | 1.2; Ch2 2.3.2, 2.3.4 | C |
| [21] | Apple. *Safari 15 Release Notes*, 2021 | developer.apple.com | 1.1; Ch2 2.2 | A |
| [22] | Wang, Zhang, Pang. *Virtual experiments in physics education: a systematic literature review*. Res. Sci. Technol. Educ. 43(2): 633–655, 2025 (đăng trực tuyến 2024) | 10.1080/02635143.2024.2327995 | 1.2 | C |
| [23] | Meisters. *Polygons have ears*. Amer. Math. Monthly 82(6): 648–651, 1975 | 10.1080/00029890.1975.11993898 | 3.2.1 | A |
| [24] | Eder, Held, Palfrader. *Parallelized ear clipping for the triangulation and constrained Delaunay triangulation of polygons*. Computational Geometry 73: 15–23, 2018 | 10.1016/j.comgeo.2018.01.004 | 3.2.1 | A |
| [25] | Carucci. *Inside geometry instancing*. GPU Gems 2, chương 3, tr. 47–67, Addison-Wesley 2005 | Sách, không có DOI; developer.nvidia.com/gpugems/GPUGems2/gpugems2_chapter03.html | 3.2.4 | B |
| [26] | OpenStax. *University Physics* vol. 1, mục 4.3 | openstax.org | 3.4 | C |
| [27] | **Luận văn Thạc sĩ / Tiến sĩ (TUTORIAL 2.3)** | **Chưa có, cần tìm 1–2 luận văn** | Ch2 2.2 | B |

---

## Chương 3. Phương pháp *(A: 3.1–3.3, 3.7; B, C: 3.4; C: 3.5; B: 3.6; khoảng 9–11 trang)*
Theo mục 2.6 file Ch2, chương gồm hai lớp:
- **Giải pháp nền (3.2): pipeline WebGL 2 + instancing** – cách đồ án vẽ mọi cảnh;
- **Phương pháp cải tiến đã công bố (3.3; TUTORIAL 2.6): Loop & Blinn 2005** – thay bước vẽ đường cong của giải pháp nền. Đồ án cài lại phần Bézier bậc 2 và nét vẽ khử răng cưa, áp dụng vẽ quỹ đạo ném xiên; bậc 3 để làm hướng phát triển (Ch.5).

Các mục còn lại đi theo công đoạn: 3.4 tính toán (C2), 3.5 tính theo từng điểm ảnh (C2–C4 trên GPU), 3.6 cập nhật và tương tác (C5), 3.7 tiến trình một khung hình.

### 3.1. Sơ đồ chung *(~1 trang)*
**Đoạn mẫu:**
> Hình 3.1 trình bày sơ đồ chung của hệ thống theo 5 công đoạn ở Bảng 1.2. Dữ liệu bài học (C1) được JavaScript tính toán (C2) rồi đổi thành dữ liệu đỉnh trong bộ đệm của GPU (C3). Vertex shader đưa đỉnh về hệ tọa độ cắt, bộ raster hóa xác định các điểm ảnh bị phủ, fragment shader tính màu từng điểm ảnh và ghi vào khung vẽ `<canvas>` (C4). Vòng `requestAnimationFrame` và các sự kiện chuột, bàn phím đưa trạng thái mới trở lại C1 (C5). Giải pháp nền (Mục 3.2) đi qua toàn bộ pipeline này; phương pháp Loop & Blinn (Mục 3.3) chỉ thay cách làm ở C3 và C4 khi vẽ đường cong.

**Hình 3.1:** sơ đồ: Mô tả cảnh (JavaScript) → Vertex buffer (GPU) → Vertex shader → Raster hóa → Fragment shader → Framebuffer của `<canvas>`; vòng `requestAnimationFrame` và sự kiện DOM quay lại "Mô tả cảnh". Ghi C1–C5 của Bảng 1.2 lên từng khối; **đánh dấu khối dùng Loop & Blinn** (C3 và C4 khi vẽ đường cong) và khối dùng instancing (C3–C4 khi vẽ nhiều đối tượng).

### 3.2. Giải pháp nền: pipeline WebGL 2 + instancing *(~3 trang; A)*
Theo mục 2.6 file Ch2. Đây là **kỹ thuật nền dựa trên đặc tả** WebGL 2.0 [13], không phải một bài báo; nguồn cho từng bước: Meisters 1975 [23] (chia tam giác), Carucci 2005 [25] (instancing). Phần "phương pháp tiên tiến đã công bố" của TUTORIAL 2.6 là mục 3.3. Trình bày cũng theo thứ tự nguyên lý → phương pháp → giải thuật → minh họa.

**Viết gì** (đúng trình tự FORMAT_PRESENTATION):
- **Nguyên lý:** GPU vẽ được điểm, đoạn thẳng và tam giác; **mọi vùng tô phải chia thành tam giác**. GPU xử lý song song hàng nghìn đỉnh và điểm ảnh; điểm nghẽn thường nằm ở **CPU gửi lệnh vẽ**, nên phải gửi ít lệnh, nhiều dữ liệu.
- **Phương pháp:** đi qua pipeline WebGL 2: dữ liệu đỉnh (vertex buffer, VAO) → vertex shader nhân ma trận → raster hóa → fragment shader tô màu → framebuffer của `<canvas>`. Với N đối tượng giống nhau: một hình mẫu + một bộ đệm thuộc tính bản sao, vẽ bằng **một** lệnh `drawArraysInstanced`.
- **Giải thuật:** 4 mục con trong bảng dưới (chia tam giác, ma trận, shader, instancing), mỗi mục có giả mã hoặc đoạn code trích và độ phức tạp.
- **Minh họa:** bài *Pipeline WebGL từng bước* (Hình 3.2–3.5) và bài Sắp xếp (nhiều cột, 1 lệnh vẽ).

**Bảng 3.1 – Bốn bước của giải pháp nền:**

**Đoạn mẫu:**
> Mỗi lệnh vẽ mà JavaScript gửi tới GPU đều tốn chi phí cố định ở phía CPU: kiểm tra trạng thái, chuẩn bị dữ liệu, chuyển lệnh qua trình duyệt xuống trình điều khiển đồ họa. Khi vẽ 10.000 hình bằng 10.000 lệnh, chi phí này lặp lại 10.000 lần. Instancing cho phép gửi một lệnh duy nhất kèm một bộ đệm chứa vị trí của cả 10.000 bản sao; GPU tự lặp lại hình cho từng bản sao.

| Mục | Viết gì | Code trích | Hình |
|---|---|---|---|
| 3.2.1 Chia đa giác thành tam giác | Định lý "mọi đa giác đơn có tai" (Meisters 1975 [23]); giải thuật cắt tai, độ phức tạp O(n²); bản song song: Eder 2018 [24] | `js/webgl/triangulate.js` | 3.2: ngôi sao lõm 14 đỉnh → 12 tam giác |
| 3.2.2 Ma trận biến đổi 2D | Tọa độ thuần nhất 3×3; ma trận chiếu từ điểm ảnh sang clip space; ghép dời–xoay–co giãn | `js/webgl/matrix.js` (`ortho2D`, `multiply`) | 3.3: đa giác trước/sau khi xoay 45° |
| 3.2.3 Shader | Vertex shader nhân ma trận; fragment shader tô màu theo từng điểm ảnh | GLSL trong `js/tech/pipeline.js` | 3.4: đa giác tô chuyển màu |
| 3.2.4 Instancing | `vertexAttribDivisor`, `drawArraysInstanced`; so với vòng lặp `drawArrays`; nguồn: Carucci 2005 [25], đặc tả WebGL 2.0 [13] | `js/webgl/instanced-rects.js` | 3.5: 100 bản sao, 1 lệnh vẽ |

### 3.3. Phương pháp cải tiến: vẽ đường cong độc lập độ phân giải (Loop & Blinn 2005 [1]) *(~3 trang; A)*
Loop & Blinn thay **một bước** của giải pháp nền: bước "chia đường cong thành N đoạn thẳng" ở C3–C4 được thay bằng "tính phương trình ẩn u² − v tại từng điểm ảnh". Cải tiến là của bài báo; nhóm cài lại và đo kiểm chứng (thử nghiệm f).

Trình bày đúng thứ tự TUTORIAL 2.6: **nguyên lý → phương pháp → giải thuật → minh họa**, rồi đối chiếu với bài báo.

**3.3.1. Nguyên lý.**
- Cách thông thường: chia đường cong thành N đoạn thẳng rồi thành tam giác. Đường cong bị xấp xỉ **trước** khi lên GPU, nên phóng to là lộ cạnh; muốn mịn phải tăng N, tức thêm đỉnh. Bài báo (§1) nêu đúng nhược điểm này: phóng to sẽ thấy "các mặt phẳng của phép xấp xỉ tuyến tính từng đoạn".
- Loop & Blinn **không xấp xỉ**: biểu diễn đường cong dưới dạng **phương trình ẩn** f(u, v) = 0, để GPU kiểm tra **từng điểm ảnh** nằm phía nào của đường cong. Độ mịn vì vậy không phụ thuộc mức phóng to.

**3.3.2. Phương pháp.**
- Bézier bậc 2: B(t) = (1 − t)² P0 + 2t(1 − t) P1 + t² P2, 0 ≤ t ≤ 1.
- Gán tọa độ (u, v) cho 3 điểm điều khiển: P0 → (0, 0), P1 → (½, 0), P2 → (1, 1) (§3, Hình 1). Vì (u, v) là hàm affine của (x, y), **trên đường cong** u = t, v = t², nên **f(u, v) = u² − v = 0**. Phía lồi của đường cong có f < 0, phía kia f > 0 (§3).
- Áp dụng cho quỹ đạo: P0 = điểm ném, P2 = điểm rơi, P1 = P0 + v(0)·T/2. Với quỹ đạo từ gốc tọa độ, P2 = (R, 0) và P1 = (R/2, 2H). Có test chứng minh Bézier này trùng khít quỹ đạo.
- **Khoảng cách và khử răng cưa** (§5):
  - khoảng cách gần đúng từ điểm ảnh tới đường cong: d ≈ f / ‖∇f‖;
  - ∇f lấy theo tọa độ điểm ảnh bằng quy tắc dây chuyền: ∇f = 2u∇u − ∇v, với ∇u, ∇v tính bằng `dFdx`, `dFdy` (bài báo gọi là "gradient instructions");
  - độ phủ của điểm ảnh = clamp(w/2 + 0,5 − |d|, 0, 1). Đây là "hàm trộn đơn giản" mà §5 cho phép; nhóm chọn dốc tuyến tính rộng 1 điểm ảnh.
- **Vẽ nét thay vì tô vùng:** bài báo nêu ở §7 rằng chỉ cần sửa nhẹ shader là vẽ được biên đường cong với độ dày tùy ý; đồ án dùng đúng cách này.

**Hình 3.6:** tam giác P0 P1 P2 của một quỹ đạo, ghi (u, v) ở 3 đỉnh, vùng f < 0 và f > 0 tô hai màu.

**3.3.3. Giải thuật.**

**Bảng 3.2 – Các bước vẽ đường cong theo Loop & Blinn:**
| Bước | CPU (JavaScript) | GPU |
|---|---|---|
| 1 | Tính P0, P1, P2 (`parabolaToBezier`) | Chưa tham gia |
| 2 | Tính phép biến đổi affine (x, y) → (u, v) (`uvTransform`); 3 điểm thẳng hàng thì chuyển sang vẽ đoạn thẳng | Chưa tham gia |
| 3 | Lấy hộp bao 3 điểm + lề bằng nét vẽ → 4 góc tứ giác, mỗi góc kèm (u, v) | Chưa tham gia |
| 4 | Nạp 4 đỉnh vào buffer, gọi 1 lệnh `drawArrays(TRIANGLE_STRIP)` | Vertex shader: đổi vị trí sang clip space, chuyển (u, v) xuống |
| 5 | Không tham gia | Raster hóa nội suy (u, v) cho từng điểm ảnh |
| 6 | Không tham gia | Fragment shader: f = u² − v; d = f / ‖∇f‖; độ phủ theo d; chỉ giữ 0 ≤ u ≤ 1 |

Giả mã fragment shader (trích `js/webgl/loop-blinn.js`):
```
f        = u*u - v
gradient = 2u·(dFdx(u), dFdy(u)) − (dFdx(v), dFdy(v))
d        = f / |gradient|                 // khoảng cách gần đúng, đơn vị điểm ảnh
alpha    = clamp(w/2 + 0.5 − |d|, 0, 1)   // nét rộng w, mép mờ 1 điểm ảnh
```
**Độ phức tạp:**
- Loop & Blinn: CPU O(1), luôn 4 đỉnh; GPU O(số điểm ảnh trong tứ giác).
- Chia N đoạn thẳng: CPU O(N), 6N đỉnh.

**3.3.4. Minh họa.**
- **Hình 3.7:** bài Ném xiên ở mức phóng to 16× quanh đỉnh, hai cách vẽ đặt cạnh nhau (ô "Cách vẽ").
- **Hình 3.8:** ba ảnh cắt từ trang thử nghiệm `benchmark/curve.html` (Loop & Blinn, 120 đoạn, 30 đoạn).

**3.3.5. Đối chiếu với bài báo** (đã đọc toàn văn) – **Bảng 3.3:**
| Nội dung | Bài báo | Đồ án | Kết luận |
|---|---|---|---|
| Gán (u, v) | (0, 0), (½, 0), (1, 1) – §3, Hình 1 | Như vậy, có test | Giống |
| Phương trình ẩn | f = u² − v, f < 0 là bên trong – §3 | Như vậy | Giống |
| Khoảng cách | d = g/‖∇g‖, ∇g bằng lệnh gradient hoặc quy tắc dây chuyền – §5 | ∇f = 2u∇u − ∇v bằng `dFdx`/`dFdy` | Giống |
| Khử răng cưa | Bảng tra 1D hoặc "hàm trộn đơn giản" – §5 | Dốc tuyến tính rộng 1 điểm ảnh | Giống (một lựa chọn bài báo cho phép) |
| Vẽ nét | Có nêu – §7 | Nét rộng w | Giống |
| Hình bao | Tam giác điều khiển P0 P1 P2 | **Hộp chữ nhật** bao 3 điểm + lề | **Khác:** nét vẽ tràn ra ngoài tam giác ở phía lồi nên tam giác không đủ chứa; đổi lại GPU xử lý thêm các điểm ảnh bị loại |
| Cắt hai đầu mút | Không có (bài báo ghép nhiều tam giác thành hình kín) | Giữ 0 ≤ u ≤ 1 | **Nhóm thêm** để vẽ một đoạn đường cong đứng riêng |
| Đường cong hữu tỉ, bậc 3, phối cảnh, tam giác hóa phông chữ | §3.1, §4, §5.1, §6 | Không làm | Ngoài phạm vi; bậc 3 ở Ch.5 |
| Số đo hiệu năng | Không có bảng số | Thử nghiệm (f) | Chỉ kiểm chứng được khẳng định, không so con số |

### 3.4. Mô hình tính toán (C2) *(~1,5 trang; C: vật lý, B: thuật toán)*
**Viết gì:** ngắn gọn, chỉ những gì sinh ra dữ liệu cho phần vẽ và cho thử nghiệm (b), (c). Không trình bày lại giáo trình.

**Vật lý (C):**
- **Ném xiên** (OpenStax 4.3 [26]): x(t) = v₀cosθ·t, y(t) = v₀sinθ·t − ½gt²; T = 2v₀sinθ/g, R = v₀²sin2θ/g, H = (v₀sinθ)²/(2g). Ví dụ v₀ = 20 m/s, θ = 45°, g = 9,8 m/s²: T = 2,886 s, R = 40,816 m, H = 10,204 m. Đổi sang Bézier: P0 = điểm ném, P2 = điểm rơi, P1 = (R/2, 2H).
- **Con lắc đơn:** θ'' = −(g/L) sin θ; với góc nhỏ, chu kỳ T₀ = 2π√(L/g).
- **Lò xo:** x'' = −(k/m) x, ω = √(k/m); với x(0) = A, v(0) = 0: x(t) = A cos(ωt); năng lượng E = ½mv² + ½kx² không đổi. Đây là đáp án của thử nghiệm (b).
- **Tích phân số** (bước Δt, a = a(x)):
  - Euler hiện: xₙ₊₁ = xₙ + vₙΔt, vₙ₊₁ = vₙ + a(xₙ)Δt; sai số toàn cục O(Δt); năng lượng lò xo tăng dần.
  - Velocity Verlet: xₙ₊₁ = xₙ + vₙΔt + ½aₙΔt², vₙ₊₁ = vₙ + ½(aₙ + aₙ₊₁)Δt; O(Δt²); năng lượng dao động quanh giá trị đúng, không trôi.
  - RK4: 4 lần tính đạo hàm k₁…k₄ mỗi bước; O(Δt⁴).
- **Giao thoa hai nguồn cùng pha:** yᵢ = A sin(ωt − k rᵢ), k = 2π/λ. Biên độ tổng hợp 2A|cos(k(r₁ − r₂)/2)|; cực đại khi r₁ − r₂ = nλ, cực tiểu khi r₁ − r₂ = (n + ½)λ. Cách đưa vào shader ở mục 3.5.

**Thuật toán (B):**
- Giả mã ngắn: một thuật toán sắp xếp tiêu biểu (Quick Sort), BFS, Dijkstra, A* (heuristic Manhattan trên lưới 4 hướng, chấp nhận được nên A* vẫn cho đường ngắn nhất).
- Cách ghi các bước "so sánh / đổi chỗ / thăm" bằng generator để C5 phát lại; ngưỡng ghi lại khoảng 2.000 phần tử.
- Độ phức tạp: Dijkstra với hàng đợi ưu tiên O((V + E) log V); A* cùng cận trên nhưng thường duyệt ít ô hơn nhờ heuristic. Đây là điều thử nghiệm (c) đo.

**Đoạn mẫu:**
> Công đoạn C2 cung cấp dữ liệu cho phần vẽ. Với bài ném xiên, quỹ đạo có nghiệm giải tích nên được đổi thẳng thành ba điểm điều khiển của một đường cong Bézier bậc 2. Với con lắc và lò xo, trạng thái được tính lại sau mỗi bước thời gian Δt bằng một phương pháp tích phân số; sai số của phương pháp này quyết định vật được vẽ ở đúng vị trí hay không. Euler hiện có sai số toàn cục O(Δt) và làm năng lượng của lò xo tăng dần, Velocity Verlet có sai số O(Δt²) và giữ năng lượng dao động quanh giá trị đúng, còn RK4 có sai số O(Δt⁴) nhưng tốn bốn lần tính đạo hàm mỗi bước. Với các bài thuật toán, mỗi bước so sánh, đổi chỗ hay thăm ô được ghi lại để công đoạn C5 phát lại.

### 3.5. Tính toán theo từng điểm ảnh trên GPU *(~1,5 trang; C)*
**Viết gì:** fragment shader như một "chương trình chạy song song cho mọi điểm ảnh", ví dụ bài giao thoa sóng.
1. Mỗi điểm ảnh (X, Y) tự tính khoảng cách tới 2 nguồn r₁, r₂ và màu theo biên độ tổng hợp. Công thức giao thoa ở mục 3.4; ở đây chỉ trình bày **cách đưa công thức vào shader**: vị trí nguồn, bước sóng, thời gian truyền qua uniform; `gl_FragCoord` cho tọa độ điểm ảnh (gốc ở góc **dưới** trái, phải nhân `devicePixelRatio`).
2. So với cách làm trên CPU: JavaScript lặp W × H điểm ảnh, ghi vào `ImageData` của Canvas 2D. Số phép tính như nhau, khác ở chỗ chạy tuần tự hay song song. Đo ở thử nghiệm (e).
3. **Hình 3.9:** ảnh giao thoa và đoạn GLSL tương ứng.

**Đoạn mẫu:**
> Fragment shader được gọi một lần cho mỗi điểm ảnh, và GPU chạy hàng nghìn lần gọi này song song. Bài giao thoa sóng tận dụng điều đó: mỗi điểm ảnh tự tính khoảng cách r₁, r₂ tới hai nguồn, suy ra biên độ tổng hợp 2A|cos(k(r₁ − r₂)/2)| và đổi biên độ thành màu. Vị trí nguồn, bước sóng và thời gian được JavaScript gửi xuống qua uniform mỗi khung hình. Tọa độ điểm ảnh lấy từ `gl_FragCoord`, có gốc ở góc dưới trái và tính theo điểm ảnh thật, nên vị trí nguồn phải được lật trục y và nhân `devicePixelRatio` trước khi gửi. Bản đối chứng trên CPU thực hiện đúng công thức đó trong một vòng lặp JavaScript qua W × H điểm ảnh rồi ghi vào `ImageData` (thử nghiệm e).

### 3.6. Cập nhật động và tương tác trong HTML5 *(~1,5 trang; B)*
**Viết gì:** công đoạn C5, phần "động" của đề tài.
1. **Vòng cập nhật:** `requestAnimationFrame` gọi hàm vẽ mỗi khung hình, đưa vào Δt; chỉ vẽ lại lớp thay đổi (lớp tĩnh như hệ trục giữ nguyên).
2. **Đưa dữ liệu mới lên GPU:** `bufferSubData` thay vì tạo buffer mới.
3. **Nhận thao tác:** sự kiện chuột/cảm ứng/bàn phím của DOM.
4. **Phát lại bước:** thuật toán ghi các bước bằng generator (mục 3.4), C5 chỉ phát lại, tua, đổi tốc độ; phần tính toán tách khỏi phần vẽ.
5. **Chọn đối tượng** (ẩn số "đối tượng nào bị chọn"): 2 cách, so sánh ở Bảng 3.4; đo ở thử nghiệm (g).
6. **Hình 3.10:** bài Sắp xếp khi kéo-thả một cột; **Hình 3.11:** bài Pipeline khi chọn bản sao #53.

**Đoạn mẫu:**
> Chế độ động được dựng trên vòng `requestAnimationFrame`: trình duyệt gọi hàm vẽ trước mỗi lần làm tươi màn hình và cho biết thời gian đã trôi qua Δt. Mỗi khung hình chỉ dữ liệu thay đổi được gửi lại lên GPU bằng `bufferSubData`, lớp tĩnh như hệ trục giữ nguyên. Với các bài thuật toán, toàn bộ các bước được ghi trước; vòng cập nhật chỉ chọn bước cần hiển thị theo thanh tua và tốc độ, nhờ đó phần tính toán tách hẳn khỏi phần vẽ. Để biết người học đang chạm vào phần tử nào, đồ án dùng hai cách ở Bảng 3.4: tính chỉ số trực tiếp từ tọa độ chuột khi phần tử xếp đều, và GPU picking khi hình dạng bất kỳ.

**Bảng 3.4 – Hai cách chọn đối tượng:**
| | Tính toán (hit-test) | GPU picking |
|---|---|---|
| Ý tưởng | Suy chỉ số từ tọa độ chuột (cột i = ⌊(x − lề) / độ rộng cột⌋) | Vẽ lại cảnh bằng "màu mã" vào framebuffer ẩn, đọc màu tại chuột bằng `readPixels` |
| Độ phức tạp | O(1) | Một lượt vẽ thêm + chờ GPU trả 1 điểm ảnh |
| Dùng được khi | Phần tử xếp đều (cột, lưới) | Mọi hình dạng, kể cả hình lõm, xoay, hàng nghìn bản sao |
| Code | `js/core/hit-test.js` (bài Sắp xếp) | `js/webgl/picking.js` (bài Pipeline, Đồ thị) |

### 3.7. Tiến trình hoạt động *(~1 trang; A – MANUAL_FAULT mục 5)*
**Viết gì:** đi qua **một khung hình cụ thể**, bằng tham số đồ họa.

**Đoạn mẫu:**
> Xét quỹ đạo có P0 = (0; 0), P1 = (20,41; 20,41), P2 = (40,82; 0) m (ném với 20 m/s, 45°). Khung vẽ 746 × 574 điểm ảnh, `devicePixelRatio` = 1 **[thay bằng kích thước thật]**.
> (C1) Dữ liệu: người học chọn v₀ = 20 m/s, θ = 45° bằng thanh trượt; nét rộng 2,5 điểm ảnh, màu xanh.
> (C2) Tính toán: từ nghiệm giải tích tính T, R, H, rồi 3 điểm điều khiển P0, P1, P2 của Bézier bậc 2.
> (C3) Ánh xạ hình học: không chia đường cong; CPU tính (u, v) cho 4 góc của hộp bao, nạp 4 đỉnh × 4 số thực vào vertex buffer. Ma trận khung nhìn đổi mét sang điểm ảnh, ma trận chiếu đổi điểm ảnh sang clip space; khi phóng to 16×, chỉ ma trận đổi, 4 đỉnh được tính lại.
> (C4) Render: GPU nội suy (u, v) cho mọi điểm ảnh trong tứ giác; fragment shader tính u² − v và tô các điểm ảnh cách đường cong dưới 1,25 điểm ảnh, mép mờ thêm 1 điểm ảnh. Lớp WebGL nằm dưới, PixiJS vẽ hệ trục và chữ đè lên; nút "Xuất PNG" ghép hai lớp thành một ảnh.
> (C5) Tương tác: khi người học kéo thanh phóng to, sự kiện `input` gọi vẽ lại; tổng cộng 1 lệnh vẽ cho quỹ đạo mỗi khung hình.

Kèm **Hình 3.2–3.5**: ảnh chụp các bước của bài *Pipeline WebGL từng bước* (giải pháp nền).

### Bảng 3.5 – Kiến thức HTML5 / WebGL ↔ code nhóm tự viết (để trích code; phần nào PixiJS làm thì ghi rõ)
| Kiến thức | File (trong `Source code/`) | Ai viết |
|---|---|---|
| Thẻ `<canvas>`, bố cục trang | `index.html`, `css/style.css` | Nhóm |
| Control HTML5 (`range`, `button`, `checkbox`, `select`) | `js/core/controls.js` | Nhóm |
| Vòng lặp `requestAnimationFrame` | `benchmark/benchmark.js` (gọi trực tiếp); app chính qua ticker của PixiJS | Nhóm / PixiJS |
| Sự kiện bàn phím (phím tắt) | `js/core/playback.js` | Nhóm |
| Sự kiện chuột/cảm ứng (kéo-thả) | `js/core/drag.js`, `js/cs/sorting.js` | Nhóm, trên hệ sự kiện của PixiJS |
| Canvas 2D API | `benchmark/renderers.js`, `js/core/export.js` | Nhóm |
| Xuất file: `toBlob`, `URL.createObjectURL`, `<a download>` | `js/core/export.js`; CSV ở `benchmark/` | Nhóm |
| Fullscreen API, ResizeObserver | `js/main.js`, `js/core/stage.js` | Nhóm |
| `performance.now()` | `benchmark/`, `js/tech/pipeline.js` | Nhóm |
| ES modules | Toàn bộ `js/` | Nhóm |
| Context WebGL 2, biên dịch shader, liên kết program | `js/webgl/gl-utils.js` | Nhóm |
| Vertex buffer, index buffer, VAO, attribute, uniform, `vertexAttribDivisor` | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js` | Nhóm |
| Vertex / fragment shader (GLSL ES 3.0) | `js/webgl/*.js`, `js/tech/pipeline.js`, `js/physics/waves.js` | Nhóm |
| **Loop & Blinn: phương trình ẩn, `dFdx`/`dFdy`, khử răng cưa** | `js/webgl/loop-blinn.js`, `js/webgl/curve-math.js` | Nhóm |
| Mốc so sánh: nét vẽ từ N đoạn thẳng | `js/webgl/polyline.js` | Nhóm |
| Scissor test (cắt theo vùng vẽ) | `js/physics/projectile.js` | Nhóm |
| Ma trận chiếu, biến đổi 2D | `js/webgl/matrix.js` | Nhóm |
| Chia đa giác thành tam giác | `js/webgl/triangulate.js` | Nhóm |
| `drawArrays`, `drawElements`, `drawArraysInstanced`, `drawElementsInstanced` | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js` | Nhóm |
| Framebuffer, texture, `readPixels` (GPU picking, đo sai số) | `js/webgl/picking.js`, `benchmark/curve.js` | Nhóm |
| Chọn đối tượng bằng tính toán | `js/core/hit-test.js` | Nhóm |
| Đếm lệnh vẽ, `devicePixelRatio` | `js/webgl/gl-utils.js` | Nhóm |
| Gộp lệnh vẽ, ParticleContainer, Text/BitmapText, Filter | Các bài dùng PixiJS | PixiJS (nhóm giải thích cơ chế) |

---

## Chương 4. Cài đặt và thử nghiệm *(cả nhóm; A tổng hợp; khoảng 8–10 trang)*

### 4.1. Môi trường và cài đặt *(~1 trang)*
**Viết gì:** FORMAT_PRESENTATION yêu cầu "tận dụng source code có sẵn và tự viết": phải nói rõ phần nào **có sẵn**, phần nào **nhóm tự viết**.

**Bảng 4.1a – Mã nguồn có sẵn và tự viết:**
| Phần | Có sẵn (dùng lại) | Nhóm tự viết | Dùng cho |
|---|---|---|---|
| Vẽ đối tượng, chữ, sự kiện | PixiJS 8.22.0 (đồ thị cảnh, gộp lệnh vẽ, BitmapText, hệ sự kiện) | Khung ứng dụng `js/core/` (điều khiển, phát lại, khung nhìn, xuất ảnh) | Các bài minh họa; đối chứng ở (a) |
| Pipeline WebGL 2 | API WebGL 2 của trình duyệt | `js/webgl/`: context, shader, buffer, ma trận, chia tam giác, instancing, GPU picking | Giải pháp nền (3.2); (a), (d), (g) |
| Loop & Blinn | Thuật toán từ bài báo (không có code mẫu) | `loop-blinn.js`, `curve-math.js`, mốc so sánh `polyline.js` | Phương pháp cải tiến (3.3); (f) |
| Trang đo | Không có (nhóm tự viết toàn bộ) | `benchmark/` (Canvas 2D, PixiJS, WebGL thuần; đo sai số đường cong) | (a), (f) |
| Mô phỏng, thuật toán | Công thức trong giáo trình (OpenStax), giả mã chuẩn | Integrator, Dijkstra/A*, sắp xếp bằng generator (B, C đang làm) | (b), (c) |
| Kiểm tra | Node.js `node --test` | 35 test (công thức, ma trận, chia tam giác, đo đường cong) | Bảo đảm đúng trước khi đo |

**Bảng 4.1b – Môi trường:**
- Phần cứng: CPU, RAM, GPU (các trang thử nghiệm tự ghi tên GPU). Máy có 2 GPU (tích hợp + rời) thì trình duyệt có thể chọn GPU khác nhau giữa các lần chạy, nên phải ghi GPU của từng lần đo.
- Hệ điều hành, trình duyệt + phiên bản, độ phân giải màn hình, devicePixelRatio.
- Phần mềm: HTML5, JavaScript, WebGL 2, PixiJS 8.22.0.

Đo trên **ít nhất 2 máy** nếu được. Trình bày thành bảng 2 cột (Máy 1, Máy 2) với các dòng: CPU, RAM, GPU, hệ điều hành, trình duyệt và phiên bản, độ phân giải, `devicePixelRatio`.

**Đoạn mẫu:**
> Ứng dụng được viết bằng HTML5, CSS và JavaScript thuần (ES modules), không qua bước biên dịch. Phần vẽ dùng hai lớp: thư viện PixiJS 8.22.0 cho hệ trục, chữ và các đối tượng thông thường, và lớp WebGL 2 do nhóm tự viết cho các kỹ thuật được trình bày ở Chương 3 (Bảng 4.1a). Các trang thử nghiệm tự ghi tên GPU, trình duyệt, kích thước khung vẽ và `devicePixelRatio` vào mỗi tệp kết quả CSV, vì máy có hai GPU có thể dùng GPU khác nhau giữa các lần chạy.

### 4.2. Các bài minh họa *(~1,5 trang)*
**Bảng 4.2** – mỗi bài ghi **tác vụ đồ họa** nó minh họa:
| Bài | Tác vụ HTML5 / WebGL minh họa | Tĩnh / động | Tương tác trực tiếp | Người làm |
|---|---|---|---|---|
| **Ném xiên** | **Phương pháp cải tiến: đường cong bằng Loop & Blinn**; phóng to 1×–64×; scissor; animation | Cả hai | Đổi cách vẽ, phóng to; kéo mũi tên v₀, bắn trúng bia | A (quỹ đạo), C (tương tác) |
| Sắp xếp | Nhiều hình bằng instancing (WebGL thuần, giải pháp nền); chọn cột bằng hit-test | Động | Kéo-thả đổi chỗ, vẽ dữ liệu bằng chuột | B |
| BFS/DFS/Dijkstra | Chọn node bằng GPU picking; chữ bằng BitmapText | Cả hai | Kéo node, thêm node/cạnh | A |
| A* | Lưới nhiều ô cập nhật từng bước; chọn ô bằng hit-test; chạy cạnh Dijkstra để so số ô duyệt (c) | Động | Vẽ tường, kéo điểm đầu/đích | B |
| Giao thoa sóng | Tính màu từng điểm ảnh bằng fragment shader; bản CPU để so (e) | Động | Kéo 2 nguồn | C |
| Con lắc/lò xo | Vòng cập nhật `requestAnimationFrame` theo Δt; 3 integrator chạy cạnh nhau (b) | Động | Kéo quả nặng rồi thả | C |
| Pipeline WebGL | Giải pháp nền: toàn bộ pipeline WebGL thuần; đo instancing (d) | Cả hai | Kéo đỉnh, GPU picking | A (đã xong) |

Mỗi bài 1 ảnh chụp (**Hình 4.1–4.7**, theo thứ tự các dòng của Bảng 4.2) kèm 2–3 câu nói rõ **tác vụ đồ họa nào** được minh họa, không mô tả nút bấm.

**Đoạn mẫu (bài Sắp xếp):**
> Bài Sắp xếp vẽ mỗi phần tử của mảng thành một hình chữ nhật. Toàn bộ N hình được vẽ bằng một lệnh `drawArraysInstanced`: một hình chữ nhật mẫu và một bộ đệm chứa vị trí, chiều cao, màu của từng cột (Mục 3.2.4). Khi người học kéo một cột, chỉ số cột được tính trực tiếp từ tọa độ chuột (Bảng 3.4) và chỉ dữ liệu của hai cột đổi chỗ được gửi lại lên GPU.

### 4.3. Bộ thử nghiệm *(~1 trang – MANUAL_FAULT mục 7)*
Không có tập dữ liệu chuẩn cho bài toán này (TUTORIAL 2.4), nên nhóm tự xây bộ kịch bản và ghi rõ tiêu chí. Dữ liệu lưu ở thư mục Data. Mọi thử nghiệm đo **đại lượng đồ họa**.

| Thử nghiệm | Vai trò | Mục đích | Bộ kịch bản (số mẫu) | Tiêu chí, thách thức | Đáp án đúng / mốc so sánh |
|---|---|---|---|---|---|
| **(f) Loop & Blinn** | **Chính** – kiểm chứng phương pháp cải tiến | Đường cong có giữ đúng và mịn khi phóng to như bài báo khẳng định không; tốn bao nhiêu | 1 đường cong (quỹ đạo 20 m/s, 45°) × 3 cách vẽ (Loop & Blinn, 120 đoạn, 30 đoạn) × 4 mức phóng to (1×, 4×, 16×, 64×) = 12 lần đo; nét 2 px; khung 960 × 540, pixel ratio 1 | Phóng to lớn là trường hợp khó cho cách chia đoạn thẳng | Đường cong thật (phương trình) là đáp án; chia đoạn thẳng là mốc |
| (a) Hiệu năng render | Giải pháp nền | Pipeline WebGL chịu được bao nhiêu đối tượng | 3 cách vẽ × 5 mức (1k–100k) × có/không chữ = 30 lần đo × 3 s | Thang log để thấy điểm gãy (mượn từ Horak 2018); chữ là trường hợp khó | Canvas 2D, PixiJS |
| (d) Instancing | Giải pháp nền | 1 lệnh vẽ so với N lệnh vẽ | 1, 10, 100, 1.000, 10.000 bản sao | Nhiều bản sao lộ chi phí mỗi lệnh | Vòng lặp `drawElements` |
| (e) Tính theo điểm ảnh | Giải pháp nền | GPU nhanh hơn CPU bao nhiêu khi tính màu từng điểm ảnh | Giao thoa sóng ở 4 độ phân giải (480 × 270 → 1920 × 1080) | Số điểm ảnh tăng theo bình phương kích thước | Bản CPU (Canvas 2D `ImageData`); hai bản phải ra cùng ảnh |
| (b) Tích phân số | C2 – dữ liệu đầu vào cho phần vẽ | Euler, Verlet, RK4 sai bao nhiêu so với nghiệm đúng | Lò xo không ma sát, 3 phương pháp × 3 bước Δt (1/30, 1/60, 1/120 s) × 10 chu kỳ | Bước lớn, thời gian dài làm sai số tích lũy | Nghiệm giải tích x(t) = A cos(ωt); năng lượng E không đổi |
| (c) Dijkstra / A* | C2 – dữ liệu đầu vào cho phần vẽ | A* duyệt ít ô hơn Dijkstra bao nhiêu, đường đi có cùng độ dài không | Lưới 20², 50², 100² × mật độ tường 0 %, 20 %, 30 % × 10 cặp điểm ngẫu nhiên (seed cố định) = 90 lần | Tường dày, đích bị che làm heuristic kém hiệu quả | Độ dài đường của Dijkstra (ngắn nhất) |
| (g) Chọn đối tượng *(tùy chọn)* | C5 | Hit-test và GPU picking mất bao lâu, có chọn đúng không | 100, 1.000, 10.000 đối tượng × 1.000 vị trí chuột ngẫu nhiên | Đối tượng nhỏ, chồng lên nhau, hình lõm | Vị trí đối tượng đã biết (đáp án); hai cách so với nhau. **[Chưa có công cụ đo]** |

Thứ tự trình bày ở 4.4–4.5: (f) trước và kỹ nhất, rồi (a), (d), (e); (b), (c) viết ngắn, nói rõ chúng kiểm tra dữ liệu đầu vào cho phần vẽ. Nhãn (a)–(g) trùng với bảng cuối mục 2.6 file Ch2.

**Đoạn mẫu:**
> Bài toán vẽ 2D trên web không có tập dữ liệu chuẩn như các bài toán nhận dạng, nên nhóm tự xây bộ kịch bản cho từng thử nghiệm và ghi rõ số mẫu, tiêu chí và đáp án đúng (bảng trên). Với thử nghiệm chính (f), đáp án là đường cong thật tính từ phương trình; với (b) là nghiệm giải tích của lò xo; với (c) là độ dài đường ngắn nhất do Dijkstra tìm được. Mỗi cấu hình được đo trong 3 giây sau khi bỏ qua các khung hình đầu, kết quả lưu ở thư mục Data.

### 4.4. Kết quả *(~4 trang)*
**Độ đo** (MANUAL_FAULT mục 6), lấy từ "tiêu chí tốt" ở Bảng 1.1:
- **Độ chính xác:** sai số hình học (điểm ảnh), độ phủ đường cong (%), sai số vị trí và độ trôi năng lượng của tích phân số (%), tỉ lệ chọn đúng đối tượng (%).
- **Độ phức tạp, hiệu năng:** số đỉnh gửi lên GPU, số lệnh vẽ, thời gian vẽ, thời gian khung hình (trung bình, p95), FPS, thời gian CPU; số ô duyệt (thử nghiệm c).

Mỗi thử nghiệm trình bày theo **cùng mẫu 3 phần**: bảng số → biểu đồ / hình → 1 đoạn nhận xét.

**Bảng 4.3 – Thử nghiệm (f): Loop & Blinn so với chia đoạn thẳng.** Trang `benchmark/curve.html`, xuất CSV. Hàng mẫu lấy từ lần chạy thử trên Edge không giao diện (GPU NVIDIA RTX 3050 Laptop), **[thay bằng số đo trên máy thật, có cửa sổ hiện]**:
| Cách vẽ | Phóng to | Số đỉnh | Sai số lớn nhất (px) | Độ phủ (%) |
|---|---|---|---|---|
| Loop & Blinn | 1× | 4 | 0,000 | 99,9 |
| Loop & Blinn | 64× | 4 | 0,003 | 100,0 |
| 120 đoạn thẳng | 1× | 720 | 0,000 | 100,0 |
| 120 đoạn thẳng | 64× | 720 | 0,647 | 83,3 |
| 30 đoạn thẳng | 16× | 180 | 3,070 | 18,6 |
| 30 đoạn thẳng | 64× | 180 | 11,290 | 7,1 |

Cột thời gian vẽ có trong CSV nhưng số chạy thử dao động mạnh (khoảng 0,01–0,24 ms mỗi lần vẽ), nên phải đo lại nhiều lần trên máy thật trước khi kết luận.

- **Hình 4.8:** biểu đồ đường, trục x = mức phóng to (thang log), trục y = sai số lớn nhất (px), 3 đường cho 3 cách vẽ.
- **Hình 4.9:** ba ảnh cắt ở 16× từ trang thử nghiệm.

**Bảng 4.4 – Thử nghiệm (a): hiệu năng vẽ** (số chạy thử, GPU Intel Iris Xe, **[thay bằng số đo thật]**):
| Cách vẽ | Số hình | Chữ | FPS | Khung hình TB (ms) | CPU vẽ TB (ms) | Lệnh vẽ |
|---|---|---|---|---|---|---|
| Canvas 2D | 20.000 | không | 27 | 37,8 | 11,36 | – |
| PixiJS | 20.000 | không | 60 | 16,7 | 1,24 | 1 |
| WebGL thuần | 20.000 | không | 61 | 16,7 | 0,39 | 1 |

**Bảng 4.5 – Thử nghiệm (d): instancing** (số chạy thử, **[thay bằng số đo thật]**): 10.000 bản sao: instancing 1 lệnh vẽ, CPU 0,10 ms; vòng lặp 10.000 lệnh vẽ, CPU 1,83 ms.

**Bảng 4.6 – Thử nghiệm (e): tính theo điểm ảnh** (C điền, khung bảng có sẵn):
| Độ phân giải | Số điểm ảnh | CPU (ms/khung) | GPU (ms/khung) | Nhanh gấp | Hai ảnh giống nhau? |
|---|---|---|---|---|---|
| 480 × 270 | 129.600 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 960 × 540 | 518.400 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 1280 × 720 | 921.600 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 1920 × 1080 | 2.073.600 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |

**Bảng 4.7 – Thử nghiệm (b): tích phân số** (C điền; 9 dòng = 3 phương pháp × 3 bước Δt):
| Phương pháp | Δt (s) | Sai số vị trí lớn nhất sau 10 chu kỳ (m) | Độ trôi năng lượng (%) | Thời gian mỗi bước (µs) |
|---|---|---|---|---|
| Euler hiện | 1/30, 1/60, 1/120 | [cần số đo] | [cần số đo] | [cần số đo] |
| Velocity Verlet | 1/30, 1/60, 1/120 | [cần số đo] | [cần số đo] | [cần số đo] |
| RK4 | 1/30, 1/60, 1/120 | [cần số đo] | [cần số đo] | [cần số đo] |

Kèm **Hình 4.10:** năng lượng theo thời gian, 3 đường. Kiểm tra bậc sai số: khi Δt giảm một nửa, sai số của Euler giảm khoảng 2 lần, Verlet khoảng 4 lần, RK4 khoảng 16 lần.

**Bảng 4.8 – Thử nghiệm (c): Dijkstra / A*** (B điền; 9 dòng = 3 kích thước × 3 mật độ tường, mỗi dòng trung bình 10 cặp điểm):
| Lưới | Tường (%) | Ô duyệt – Dijkstra | Ô duyệt – A* | Tỉ lệ A*/Dijkstra | Thời gian Dijkstra / A* (ms) | Độ dài đường bằng nhau? |
|---|---|---|---|---|---|---|
| 20 × 20 | 0, 20, 30 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 50 × 50 | 0, 20, 30 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 100 × 100 | 0, 20, 30 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |

**Bảng 4.9 – Thử nghiệm (g): chọn đối tượng** (B điền, tùy chọn): số đối tượng, cách chọn, thời gian trung bình mỗi lần chọn (ms), tỉ lệ chọn đúng (%).

### 4.5. Bàn luận *(~1,5 trang)*
**Viết gì:** giải thích **vì sao** kết quả như vậy, dựa vào Ch.3. Mỗi thử nghiệm một đoạn, theo thứ tự:
- **(f)** trước và kỹ nhất: vì sao đường gấp khúc lộ cạnh còn Loop & Blinn không (3.3.1); có khớp khẳng định "độc lập độ phân giải" của bài báo không.
- **(a)** so hướng với Horak 2018 (WebGL nhanh nhất, SVG ≈ Canvas), không so trực tiếp con số vì khác phần cứng và loại cảnh.
- **(d)** chi phí mỗi lệnh vẽ ở phía CPU: thời gian tăng gần tuyến tính theo số lệnh, instancing giữ gần như không đổi.
- **(e)** GPU nhanh hơn CPU bao nhiêu lần, có tăng theo số điểm ảnh không; hai bản có ra cùng ảnh không.
- **(b), (c)** ngắn: Euler trôi năng lượng, Verlet không trôi, RK4 sai số nhỏ nhất (đúng bậc O(Δt), O(Δt²), O(Δt⁴) ở 3.4); A* duyệt ít ô hơn nhưng cùng độ dài đường. Nói rõ đây là kiểm tra **dữ liệu đầu vào** cho phần vẽ.
- **(g)** nếu có: khi nào hit-test đủ, khi nào cần GPU picking.
- Cuối mục: **hạn chế của phép đo** (ít máy, số lần đo, trình duyệt).

**Đoạn mẫu cho (f)** (dựa trên số chạy thử, phải viết lại theo số thật):
> Ở mức phóng to 1×, cả ba cách vẽ đều gần như không sai số, vì mỗi đoạn thẳng ngắn hơn một điểm ảnh. Khi phóng to 64× quanh đỉnh, đường gấp khúc 120 đoạn lệch tới 0,65 điểm ảnh và chỉ phủ 83 % đường cong thật; đường 30 đoạn lệch tới 11 điểm ảnh. Loop & Blinn vẫn giữ sai số dưới 0,01 điểm ảnh ở mọi mức phóng to mà chỉ dùng 4 đỉnh. Nguyên nhân: đường gấp khúc xấp xỉ đường cong trên CPU **trước** khi phóng to, còn Loop & Blinn tính lại phương trình u² − v tại **từng điểm ảnh** sau khi phóng to (Mục 3.3.1). Kết quả này khớp với tính chất "độc lập độ phân giải" mà Loop và Blinn (2005) khẳng định. Bài báo không công bố bảng số đo, nên báo cáo chỉ kiểm chứng tính chất đó, không so sánh con số với bài báo.

**Đoạn mẫu cho (d)** (số chạy thử):
> Với 10.000 bản sao, vòng lặp gọi 10.000 lệnh vẽ tốn khoảng 1,83 ms thời gian CPU mỗi khung hình, trong khi instancing chỉ gọi một lệnh và tốn 0,10 ms. Chênh lệch này đến từ chi phí cố định của mỗi lệnh vẽ ở phía CPU (Mục 3.2), không phải từ GPU: số tam giác GPU phải vẽ ở hai cách là như nhau.

**Đoạn mẫu cho (a):**
> Ở 20.000 hình, Canvas 2D cần khoảng 11 ms thời gian CPU mỗi khung hình, vì JavaScript phải gọi `fillRect` 20.000 lần. WebGL thuần chỉ cần 0,39 ms, vì toàn bộ vị trí được nạp vào một bộ đệm và vẽ bằng một lệnh `drawArraysInstanced` (Mục 3.2.4, thử nghiệm d). Hướng kết quả tương tự Horak và cộng sự (2018), nơi WebGL nhanh hơn Canvas và SVG, dù hai thử nghiệm khác phần cứng và loại cảnh.

**Không áp dụng:** MANUAL_FAULT mục 4 (giai đoạn huấn luyện, loss function, đánh nhãn) dành cho đề tài học máy. Báo cáo ghi một câu: đồ án không có giai đoạn huấn luyện; "groundtruth" tương ứng là đường cong thật (phương trình, thử nghiệm f), nghiệm giải tích (b), đường ngắn nhất của Dijkstra (c), ảnh tính trên CPU (e) và vị trí đối tượng đã biết (g).

---

## Chương 5. Kết luận và hướng phát triển *(A, khoảng 1–2 trang)*
**Viết gì:**
1. **Kết quả đạt được:** nhắc lại từng đóng góp ở Bảng 1.4, mỗi cái kèm **một con số** chính từ Ch.4. Nêu trước phương pháp cải tiến Loop & Blinn (f), rồi giải pháp nền (a), (d), (e); (b), (c) một câu mỗi cái. Trả lời lại hai câu hỏi của Ch.2: người ta đã làm gì, đồ án đã làm được gì.
2. **Hạn chế:**
   - Loop & Blinn mới cài cho Bézier bậc 2, hình bao là hộp chữ nhật (thừa điểm ảnh);
   - mô phỏng mới dùng các integrator cơ bản, lưới tìm đường cỡ vừa;
   - WebGL thuần chưa vẽ chữ;
   - đo trên ít loại máy;
   - chưa đánh giá với người học thật.
3. **Hướng phát triển:**
   - Loop & Blinn cho **Bézier bậc 3** (phân loại đường cong, kiểm tra hướng, chia nhỏ đường có vòng – §4 bài báo); dùng tam giác điều khiển cộng dải lề thay cho hộp chữ nhật;
   - vẽ chữ bằng distance field (Green 2007 [2]), dùng 2 kênh để giữ góc nhọn;
   - chuyển sang WebGPU [15] để dùng compute shader, mở đường cho Ganacim 2014 [4], Li 2016 [5];
   - thử nghiệm với người học (bài kiểm tra trước/sau).

**Đoạn mẫu:**
> Báo cáo đã khảo sát 15 công trình vẽ 2D trên web và ứng dụng trực quan hóa giáo dục, xây dựng ứng dụng trên pipeline WebGL 2 với instancing, và chọn trình bày, cài đặt lại phương pháp vẽ đường cong độc lập độ phân giải của Loop và Blinn (2005) trên WebGL, áp dụng vẽ quỹ đạo trong ứng dụng EduViz2D. Ở mức phóng to 64×, phương pháp giữ sai số dưới [x] điểm ảnh với 4 đỉnh, trong khi đường gấp khúc 120 đoạn lệch [y] điểm ảnh với 720 đỉnh. Hạn chế là mới cài đặt cho đường cong bậc 2; mở rộng sang bậc 3 và WebGPU là hướng phát triển tiếp theo.

---

## Đối chiếu nhanh với FORMAT_PRESENTATION
| Yêu cầu của thầy | Ở đâu trong báo cáo |
|---|---|
| 1.1 Bối cảnh chung | 1.1 |
| 1.2 Động lực: ý nghĩa khoa học **và** thực tiễn | 1.2, hai ý tách riêng |
| 1.3 Input, Output; framework các công đoạn chính, chưa gắn phương pháp | 1.3: Bảng 1.1 (Input/Output/tiêu chí), Bảng 1.2 (C1–C5 kèm ẩn số), Bảng 1.3 (bài toán con) |
| 1.4 Đóng góp | 1.4, Bảng 1.4 (mỗi đóng góp có chỗ chứng minh) |
| Ch.2 Chọn lọc công trình liên quan | File Ch2, mục 2.3: 15 công trình, 3 nhóm + nghiên cứu giáo dục |
| Ch.2 Quá trình phát triển | File Ch2, mục 2.2: 5 giai đoạn + bảng tóm tắt |
| Ch.2 Bảng so sánh theo tiêu chí tự chọn | File Ch2, Bảng 2.1–2.3 (mẫu của thầy, cột C1–C5) |
| Ch.2 Trả lời "người ta đã làm gì, mình muốn làm gì" | File Ch2, mục 2.4–2.6 |
| Ch.3 Chọn một giải pháp tiên tiến | 3.3 Loop & Blinn 2005, trên nền 3.2 |
| Ch.3 Sơ đồ chung → nguyên lý → phương pháp → giải thuật → minh họa | 3.1 sơ đồ; 3.2 và 3.3 đều theo đúng 4 bước (3.3.1–3.3.4); 3.7 tiến trình |
| Ch.4 Tận dụng code có sẵn + tự viết | 4.1, Bảng 4.1a |
| Ch.4 Mục đích, kết quả, bàn luận thử nghiệm | 4.3 (mục đích, bộ kịch bản), 4.4 (kết quả), 4.5 (bàn luận từng thử nghiệm) |
| Ch.5 Tóm tắt kết quả, hướng cải tiến | Ch.5: kết quả kèm số, hạn chế, hướng phát triển |

## Đối chiếu nhanh với MANUAL_FAULT
| Mục | Xử lý ở đâu |
|---|---|
| 1. Framework chung, không gắn phương pháp | 1.3, Bảng 1.2: 5 công đoạn C1–C5 (C3 để mở: "xấp xỉ hay tính trực tiếp?", "N lệnh vẽ hay 1 lệnh?") |
| 2. Ẩn số | Bảng 1.2 cột "Ẩn số cần tìm"; Bảng 1.3 |
| 3. Related works cùng tiêu chí | File Ch2, Bảng 2.1–2.3 theo **mẫu của thầy** (Nguyên lý, Pipeline C1–C5, Hiệu suất: Data / Độ đo / Kết quả, Đóng góp, Giới hạn) |
| 4. Giai đoạn huấn luyện | Không áp dụng, ghi rõ trong 4.5 |
| 5. Tiến trình hoạt động | 3.7 (một khung hình đi qua C1–C5, bằng tham số đồ họa) |
| 6. Độ đo | 4.4, dẫn từ "tiêu chí tốt" ở Bảng 1.1 |
| 7. Tập dữ liệu | 4.3 |
| 8. Khuyết điểm related works | File Ch2: cột "Giới hạn / Hướng phát triển", mục 2.5 (7 khuyết điểm, ghi công đoạn và loại vấn đề) |
