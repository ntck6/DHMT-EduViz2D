# Dàn ý chi tiết báo cáo – Xây dựng ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục

Theo `FORMAT_PRESENTATION.md` (5 chương) và các lỗi cần tránh trong `MANUAL_FAULT.md`. Bảng đối chiếu từng yêu cầu: `KIEM_TRA_YEU_CAU.md`.

**Trọng tâm của báo cáo là đồ họa 2D trên web bằng HTML5 + WebGL.** Giáo dục (Tin học, Vật lý) là **nơi áp dụng**: nó sinh ra các cảnh cần vẽ. Vì vậy Ch.1–4 viết bằng ngôn ngữ đồ họa (điểm ảnh, đỉnh, ma trận, shader, lệnh vẽ, thời gian khung hình). Công thức vật lý và giả mã thuật toán nằm ở **Phụ lục A, B**.

**Cách đọc dàn ý:** mỗi mục ghi 5 thứ:
- **Viết gì:** các ý phải có, theo thứ tự.
- **Bảng/Hình:** bảng, hình cần chèn, đánh số sẵn.
- **Đoạn mẫu:** viết sẵn để sửa lại, không chép nguyên.
- **Độ dài:** gợi ý số trang (khổ A4, cỡ chữ 13). Đây là con số nhóm tự đặt, thầy không quy định.
- **Người viết.**

Chỗ nào ghi **[cần số đo]** hay **[cần kiểm chứng]** thì phải thay bằng số liệu hoặc nguồn thật trước khi nộp.

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
2. GPU xử lý song song hàng nghìn đỉnh và điểm ảnh, nhưng chỉ tô được vùng dưới dạng tam giác. Vì vậy hình 2D, nhất là đường cong, phải được "chuyển" về dạng GPU vẽ được, và có nhiều cách chuyển.
3. Ứng dụng giáo dục là nơi đặt ra yêu cầu khó cho đồ họa:
   - hình tĩnh phải đúng và rõ khi phóng to (ví dụ quỹ đạo, đồ thị);
   - cảnh động phải mượt (ví dụ mô phỏng, phát lại thuật toán);
   - người học phải chạm vào được từng phần tử.

**Đoạn mẫu:**
> Chuẩn HTML5 cho phép vẽ đồ họa 2D trực tiếp trên trang web theo ba cách: SVG, Canvas 2D và WebGL. Trong đó chỉ WebGL cho phép lập trình bộ xử lý đồ họa (GPU) thông qua shader. GPU xử lý song song hàng nghìn điểm ảnh, nhưng chỉ tô được vùng dưới dạng tam giác, nên các hình 2D như đường cong phải được chuyển về dạng GPU vẽ được trước khi hiển thị. Các ứng dụng trực quan hóa trong giáo dục, như quỹ đạo chuyển động hay quá trình sắp xếp một mảng, đòi hỏi hình vẽ vừa đúng khi phóng to, vừa mượt khi chuyển động, vừa phản hồi ngay khi người học thao tác.

### 1.2. Động lực nghiên cứu *(~1 trang)*
**Viết gì:** chia hai ý, đúng như FORMAT_PRESENTATION yêu cầu.
- **Ý nghĩa khoa học:** vẽ 2D chất lượng cao trên GPU là bài toán có nhiều lời giải (chia đoạn thẳng rồi chia tam giác, vẽ đường cong bằng shader, tô theo dòng quét…). Trên trình duyệt, lời giải bị giới hạn bởi những gì WebGL cung cấp, nên cần khảo sát lại xem cách nào dùng được và hiệu quả đến đâu.
- **Ý nghĩa thực tiễn:**
  - Mô phỏng tương tác giúp người học hiểu khái niệm (Wieman 2008; Banda & Nzabahimana 2021 tổng hợp 31 nghiên cứu; Wang et al. 2025).
  - Hundhausen 2002 cho thấy hiệu quả phụ thuộc vào việc người học **được thao tác**, không chỉ xem.
  - Thao tác mượt với nhiều đối tượng đòi hỏi kỹ thuật vẽ nhanh và chọn đối tượng nhanh.

**Đoạn mẫu (ý thực tiễn):**
> Tổng quan của Banda và Nzabahimana (2021) trên 31 nghiên cứu cho thấy việc tích hợp mô phỏng PhET hỗ trợ người học hiểu khái niệm Vật lý. Với công cụ minh họa thuật toán, Hundhausen và cộng sự (2002) chỉ ra rằng mức độ người học tham gia thao tác quan trọng hơn hình thức hiển thị. Từ đó đặt ra yêu cầu kỹ thuật cho phần đồ họa: mỗi khung hình phải vẽ xong trong khoảng 16,7 ms để đạt 60 khung hình/giây, và phải xác định được người học đang chạm vào phần tử nào.

### 1.3. Phát biểu bài toán *(~1,5 trang)*
**Viết gì:** phát biểu bằng **tham số đồ họa**, không bằng tham số vật lý hay thuật toán. Gồm 3 phần: bài toán chung, framework 6 công đoạn (chỉ nêu công đoạn, **không** nêu phương pháp – MANUAL_FAULT mục 1) kèm **ẩn số** (mục 2), và bài toán con mà Ch.3 giải.

**Bài toán chung:** cho mô tả một cảnh 2D, tạo ra ảnh trên thẻ `<canvas>` của trang web bằng WebGL, đúng hình, mịn, đủ nhanh cho cảnh động, và phản hồi thao tác của người dùng.

**Bảng 1.1 – Input, Output, tiêu chí:**
| | Nội dung | HTML5 / WebGL cung cấp gì |
|---|---|---|
| **Input** | (1) **Hình học 2D**: điểm, đoạn thẳng, đa giác, đường cong Bézier (tọa độ điểm điều khiển)<br>(2) **Thuộc tính vẽ**: màu, độ trong suốt, bề rộng nét<br>(3) **Khung nhìn**: phép biến đổi thế giới → màn hình (dời, xoay, phóng to)<br>(4) **Khung vẽ**: kích thước W × H, `devicePixelRatio`<br>(5) Với cảnh động: **thời gian** Δt mỗi khung hình và **sự kiện** người dùng | (1)–(3) nạp vào **vertex buffer, uniform** của WebGL<br>(4) thẻ `<canvas>`<br>(5) `requestAnimationFrame`; sự kiện chuột, cảm ứng, bàn phím của DOM |
| **Output** | Cảnh tĩnh: **một ảnh** RGBA kích thước (W·dpr) × (H·dpr), xuất được ra PNG<br>Cảnh động: **chuỗi khung hình**, mỗi khung ≤ 16,7 ms (60 Hz)<br>Khi người dùng trỏ chuột: **đối tượng bị chọn** | Framebuffer của `<canvas>`; `toBlob` để xuất ảnh; `readPixels` để đọc lại điểm ảnh |
| **Tiêu chí tốt** | Đúng hình: sai số hình học tính bằng điểm ảnh<br>Mịn: không lộ cạnh, không răng cưa, ở mọi mức phóng to<br>Nhanh: thời gian khung hình, số lệnh vẽ, số đỉnh gửi lên GPU | Là cơ sở cho các độ đo ở 4.4 |

Nội dung giáo dục chỉ là **nơi sinh ra Input**:
- quỹ đạo ném xiên → một đường cong Bézier bậc 2;
- mảng cần sắp xếp → N hình chữ nhật;
- đồ thị → các hình tròn và đoạn thẳng;
- giao thoa sóng → một hàm màu cho từng điểm ảnh.

**Bảng 1.2 – Framework 6 công đoạn:**
| # | Công đoạn | Ẩn số cần tìm | HTML5 / WebGL tham gia | Ví dụ (quỹ đạo ném xiên) |
|---|---|---|---|---|
| 1 | Mô tả cảnh | Đối tượng hình học nào, thuộc tính gì | JavaScript | 1 đường cong Bézier bậc 2, nét 2,5 px |
| 2 | Xử lý hình học | Đưa hình về dạng GPU vẽ được thế nào; gửi bao nhiêu đỉnh | Vertex buffer, index buffer, VAO | Xấp xỉ bằng đoạn thẳng, hay tính trực tiếp tại điểm ảnh? (để mở) |
| 3 | Biến đổi tọa độ | Ma trận đưa tọa độ thế giới → clip space | Uniform `mat3`, vertex shader | Phóng to 1× → 64× quanh đỉnh |
| 4 | Raster hóa và tô màu | Điểm ảnh nào thuộc hình; màu và độ phủ (khử răng cưa) của từng điểm ảnh | Fragment shader | Điểm ảnh cách đường cong ≤ w/2 được tô |
| 5 | Hợp thành và xuất | Trộn các lớp, thứ tự vẽ; ảnh tĩnh xuất ra | Blending, `<canvas>`, `toBlob` | Lớp WebGL ở dưới, lớp chữ ở trên; xuất PNG |
| 6 | Cập nhật và tương tác | Vẽ lại khi nào, bước thời gian; đối tượng nào bị chọn | `requestAnimationFrame`, sự kiện DOM, `readPixels` | Kéo thanh phóng to → vẽ lại |

**Hình 1.1:** sơ đồ khối 6 công đoạn, vẽ bằng draw.io: các hộp nối mũi tên, mũi tên quay lại từ công đoạn 6 về công đoạn 1.

**Bảng 1.3 – Bài toán con mà Ch.3 giải (vẽ đường cong):**
| | Nội dung |
|---|---|
| Input | 3 điểm điều khiển P0, P1, P2 (tọa độ thế giới); ma trận chiếu sang điểm ảnh; bề rộng nét w; màu |
| Output | Độ phủ α(X, Y) ∈ [0, 1] cho từng điểm ảnh (X, Y) của khung vẽ |
| Tiêu chí | α ≈ 1 khi khoảng cách từ tâm điểm ảnh tới đường cong ≤ w/2, giảm về 0 trong 1 điểm ảnh tiếp theo; sai số không tăng khi phóng to; ít đỉnh gửi lên GPU |
| Ẩn số | Biểu diễn đường cong sao cho GPU kiểm tra được từng điểm ảnh; cách ước lượng khoảng cách tới đường cong; hình bao cần vẽ |

### 1.4. Đóng góp *(~0,5–1 trang)*
**Viết gì:** liệt kê đúng những gì báo cáo làm được, mỗi đóng góp chỉ rõ **bằng chứng nằm ở đâu**. Không dùng các từ "đề xuất phương pháp mới", "tốt hơn", "vượt trội".

**Bảng 1.4 – Đóng góp và bằng chứng:**
| # | Đóng góp | Bằng chứng trong báo cáo | Trạng thái |
|---|---|---|---|
| 1 | Khảo sát và so sánh 15 công trình (4 ứng dụng giáo dục, 5 công nghệ vẽ trên web, 5 kỹ thuật GPU, 1 nghiên cứu đánh giá) theo **mẫu bảng của thầy và 6 công đoạn đồ họa** | Bảng 2.2a–d | Đã điền đủ mọi ô; Li 2016 còn lấy theo tóm tắt |
| 2 | **Trình bày và cài đặt lại phương pháp Loop & Blinn (2005) trên WebGL** cho đường cong Bézier bậc 2, áp dụng vẽ quỹ đạo ném xiên | Mục 3.3, `js/webgl/loop-blinn.js` | **Code xong** |
| 3 | **Kiểm chứng Loop & Blinn bằng thử nghiệm (f)**: sai số hình học, độ phủ, số đỉnh, thời gian, so với cách chia đoạn thẳng, ở 4 mức phóng to | Bảng 4.3, Hình 4.1 | Công cụ xong, có số chạy thử; **[đo lại trên máy thật]** |
| 4 | Trình bày kiến thức nền HTML5 + WebGL bằng mã nguồn tự viết: chia tam giác, ma trận, instancing, cập nhật động, chọn đối tượng, tính theo điểm ảnh | Mục 3.2, 3.4, 3.5; Bảng 3.3 | Code đã có |
| 5 | Đo hiệu năng Canvas 2D, PixiJS, WebGL thuần trên phần cứng hiện nay (mở rộng phép đo của Horak et al. 2018); đo instancing, tính theo điểm ảnh trên GPU so với CPU, chọn đối tượng | Bảng 4.4–4.7 | Một phần công cụ xong, **[cần số đo]** |
| 6 | Ứng dụng minh họa mã nguồn mở EduViz2D: các bài Tin học, Vật lý có tương tác trực tiếp | Bảng 4.2, thư mục Source code | Một phần |

**Đoạn mẫu:**
> Báo cáo có các đóng góp sau:
> (1) Khảo sát và so sánh 15 công trình liên quan, gồm ứng dụng trực quan hóa giáo dục, công nghệ vẽ 2D trên web và các kỹ thuật vẽ 2D trên GPU, theo cùng một khung 6 công đoạn đồ họa (Bảng 2.2).
> (2) Trình bày và cài đặt lại phương pháp vẽ đường cong độc lập độ phân giải của Loop và Blinn (2005) trên WebGL, áp dụng vẽ quỹ đạo chuyển động ném xiên (Mục 3.3).
> (3) Kiểm chứng phương pháp bằng thử nghiệm đo sai số hình học, độ phủ và chi phí vẽ ở nhiều mức phóng to, so với cách chia đường cong thành đoạn thẳng (Mục 4.4).
> (4) Trình bày các kỹ thuật nền của HTML5 và WebGL bằng mã nguồn tự cài đặt, gồm chia đa giác thành tam giác, ma trận biến đổi, instancing, vòng cập nhật động, chọn đối tượng và tính toán theo từng điểm ảnh (Mục 3.2, 3.4, 3.5).
> (5) Đo hiệu năng của Canvas 2D, PixiJS và WebGL thuần trên phần cứng hiện nay, mở rộng phép đo của Horak và cộng sự (2018).
> (6) Xây dựng ứng dụng minh họa mã nguồn mở EduViz2D với các bài Tin học, Vật lý có tương tác trực tiếp.
> Báo cáo không đề xuất thuật toán vẽ mới và không đánh giá hiệu quả học tập với người học thật.

---

## Chương 2. Các công trình nghiên cứu liên quan *(A khung + gộp; B phần Tin học; C phần Vật lý; khoảng 7–9 trang)*

### 2.1. Ứng dụng trực quan hóa giáo dục *(~2 trang; B: VisuAlgo, algorithm-visualizer; C: PhET, Falstad)*
**Viết gì:** mỗi công trình một đoạn, **đi theo đúng thứ tự các cột của bảng mẫu** ở 2.4 (MANUAL_FAULT mục 3: không viết mỗi cái một kiểu):
1. **Tên công trình** (của ai, năm, minh họa kiến thức gì).
2. **Nguyên lý** (1–2 câu).
3. **Phương pháp theo pipeline:** công đoạn 1 → 6 làm thế nào (chỉ nêu công đoạn có điểm đáng nói).
4. **Hiệu suất:** dữ liệu (Data), độ đo (Measure), kết quả.
5. **Đóng góp.**
6. **Giới hạn / hướng phát triển.**

**Đoạn mẫu:**
> PhET (Wieman và cộng sự, 2008) là bộ mô phỏng của Đại học Colorado Boulder cho các môn Vật lý, Hóa học, Toán. Phiên bản hiện nay chạy bằng HTML5 trên thư viện đồ thị cảnh Scenery, có thể vẽ bằng SVG, Canvas, DOM và một phần WebGL. Bài Projectile Motion vẽ chủ yếu bằng SVG: màn hình Intro có khoảng 236 hình SVG và không có canvas (nhóm quan sát ngày 09/11/2026). Cách vẽ này thuận lợi cho tương tác vì mỗi hình là một phần tử nhận được sự kiện chuột, nhưng chi phí tăng theo số phần tử trên trang (công đoạn 6).

**Hình 2.1:** ảnh chụp 4 ứng dụng ghép thành một hình 2×2.

### 2.2. Công nghệ và kỹ thuật vẽ 2D trên web và trên GPU *(~2,5 trang; A)*
**Viết gì:** cũng theo đúng 6 ý như 2.1 (thứ tự cột của bảng mẫu).
- Công nghệ trên trình duyệt: Canvas 2D, SVG, WebGL thuần, PixiJS, CanvasKit (Skia biên dịch sang WebAssembly).
- Bài báo:
  - Loop & Blinn 2005 – vẽ đường cong bằng shader;
  - Green 2007 – distance field cho chữ;
  - Kilgard & Bolz 2012 – path rendering trên GPU;
  - Ganacim 2014 – vẽ vector song song;
  - Li 2016 – scanline trên GPU;
  - Horak 2018 – so sánh hiệu năng web.

**Đoạn mẫu:**
> Kilgard và Bolz (2012) đề xuất vẽ đường path vector hoàn toàn trên GPU theo hai bước "stencil, then cover": bước đầu đánh dấu vùng bên trong path vào stencil buffer, bước sau tô màu các điểm ảnh đã đánh dấu. Kỹ thuật giải quyết công đoạn 2 và 4 mà không cần chia path thành tam giác trên CPU. Tuy nhiên nó dựa trên phần mở rộng OpenGL riêng của NVIDIA (NV_path_rendering), không có trong WebGL, nên không áp dụng trực tiếp được trên trình duyệt.

### 2.3. Quá trình phát triển *(~1 trang; A)*
**Viết gì:** một trục thời gian (Hình 2.2), mỗi mốc ghi công đoạn nó cải thiện.

**Hình 2.2 – Trục thời gian:**
| Mốc | Sự kiện | Cải thiện công đoạn |
|---|---|---|
| Trước HTML5 | Java applet, Flash (bản PhET, Falstad đời đầu) | Phải cài plugin |
| HTML5 | Canvas 2D, SVG | Vẽ 2D không cần plugin |
| 2005–2016 | Loop & Blinn → Green → Kilgard → Ganacim → Li | 2, 4: vẽ vector chất lượng cao trên GPU |
| WebGL 1.0 (đặc tả hoàn chỉnh 03/2011, Khronos) | Lập trình GPU trên trình duyệt | 2, 3, 4 |
| WebGL 2.0 (2017, dựa trên OpenGL ES 3.0; các nguồn ghi tháng 1 hoặc tháng 2) | Instancing, VAO có sẵn | 2, 6: giảm số lệnh vẽ |
| WebGPU | Có compute shader | Hướng phát triển (Ch.5) |

### 2.4. Bảng so sánh chung theo mẫu của thầy *(~2 trang; cả nhóm)*
**Mẫu bảng của thầy:** Tên công trình | Nguyên lý | **Phương pháp (Pipeline)**: Công đoạn 1…n | **Hiệu suất**: Data, Độ đo (Measure), Kết quả | Đóng góp | Giới hạn / Hướng phát triển.

**Quy tắc điền (bắt buộc với bản đưa vào báo cáo):**
1. **Không để trống ô công đoạn nào.** Kỹ thuật vẽ nào cũng đi qua đủ 6 công đoạn; ở công đoạn không cải tiến, ghi ngắn cách thông thường mà nó dùng.
2. **In đậm công đoạn mà công trình có đóng góp**, để thấy ngay mỗi công trình đóng góp ở đâu (MANUAL_FAULT mục 3).
3. **Hiệu suất lấy từ chính công trình hoặc từ nghiên cứu đã đo nó**, ghi trích dẫn. Không có số đo thì ghi rõ "Không công bố số đo", không để "–". Trong Word có thể gộp 3 ô Data – Độ đo – Kết quả thành một ô "Không công bố số đo". **Không đưa số đo của nhóm vào Ch.2** (số của nhóm nằm ở Ch.4).
4. Mỗi ô là một cụm từ ngắn; giải thích dài để ở phần chữ 2.1–2.2. Không ghi ký hiệu nội bộ, tên hàm hay số mục bài báo trong ô; trích dẫn một lần bằng số [n] ở cột tên.
5. Công trình **không phải là một cách vẽ** (nghiên cứu đo đạc) để ở bảng riêng (Bảng 2.2d). Công trình **chưa kiểm chứng được** thì không đưa vào bảng (đã bỏ GeoGebra).

Các cột công đoạn là 6 công đoạn của Bảng 1.2: **CĐ1** Mô tả cảnh · **CĐ2** Xử lý hình học · **CĐ3** Biến đổi tọa độ · **CĐ4** Raster hóa, tô màu · **CĐ5** Hợp thành, xuất · **CĐ6** Cập nhật, tương tác.

Trong Word: trang nằm ngang, cỡ chữ 9–10, gộp ô tiêu đề "Phương pháp (Pipeline)" và "Hiệu suất" như mẫu. Ba phần 2.2a–c giữ nguyên một bộ cột; **dòng cuối là đồ án của nhóm**.

Bản chi tiết dùng để kiểm chứng (có nguồn từng ô) nằm ở `Documents/BANG_LAM_VIEC_CH2.md`.

**Bảng 2.2a – Ứng dụng trực quan hóa giáo dục**
| Tên công trình | Nguyên lý | CĐ1 | CĐ2 | CĐ3 | CĐ4 | CĐ5 | CĐ6 | Data | Độ đo | Kết quả | Đóng góp | Giới hạn / Hướng phát triển |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PhET [7], [16] | Đồ thị cảnh giữ đối tượng; trình duyệt vẽ lại khi đối tượng đổi | **Đồ thị cảnh Scenery, chọn được SVG / Canvas / WebGL cho từng phần** | Hình xuất thành path SVG | Ma trận của từng nút trong đồ thị cảnh | Trình duyệt tô, khử răng cưa SVG | Trình duyệt ghép các phần tử SVG | **Gom thay đổi, cập nhật một lần mỗi khung hình**; sự kiện trên từng đối tượng | Không công bố | Không công bố | Không công bố | Mô phỏng tương tác dùng rộng rãi trong dạy học | SVG chậm dần khi nhiều phần tử |
| Falstad Ripple Tank [8] | Mô phỏng sóng chạy trên GPU bằng WebGL | Lưới trạng thái mặt sóng | 1 hình phủ khung vẽ | Cố định theo khung vẽ | **Shader tính sóng và tô màu theo biên độ** | Lớp WebGL + lớp Canvas 2D phụ | **Mỗi khung hình chạy bước mô phỏng trên GPU**; vẽ vật cản bằng chuột | Không công bố | Không công bố | Không công bố | Mô phỏng sóng thời gian thực trên trình duyệt | Mỗi bài một chương trình riêng, không có khung chung |
| VisuAlgo [9] | Mỗi phần tử dữ liệu là một hình SVG do thư viện D3 cập nhật | Mảng → các hình SVG | Phần tử SVG, trình duyệt xử lý | D3 đặt thuộc tính vị trí, kích thước | Trình duyệt tô SVG | Trang HTML chứa SVG | **Phát lại từng bước thuật toán, tua** | Không công bố | Không công bố | Không công bố | Minh họa thuật toán có phát lại từng bước | Hợp với số phần tử nhỏ |
| algorithm-visualizer [10] | React dựng lại phần tử trang theo lệnh ghi từ code của người học | **Code người học → lệnh minh họa** | Bảng HTML (mảng), SVG (đồ thị) | Bố cục trang | Trình duyệt tô | Trang HTML | React vẽ lại mỗi bước | Không công bố | Không công bố | Không công bố | Người học tự viết code rồi xem minh họa | Mỗi phần tử là một nút trang, nặng khi dữ liệu lớn |

**Bảng 2.2b – Công nghệ vẽ 2D trên trình duyệt**
| Tên công trình | Nguyên lý | CĐ1 | CĐ2 | CĐ3 | CĐ4 | CĐ5 | CĐ6 | Data | Độ đo | Kết quả | Đóng góp | Giới hạn / Hướng phát triển |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Canvas 2D [11] | Vẽ tức thời, không giữ đối tượng | Lệnh vẽ hình, path | Trình duyệt xử lý path | Ma trận `setTransform` | Trình duyệt tô, có khử răng cưa | Xuất ảnh `toBlob` | Tự vẽ lại mỗi khung hình; tự xác định đối tượng bị chọn | Đồ thị 100–3.200 node [6] | FPS | Giảm từ khoảng 400 node; gần bằng SVG [6] | **API vẽ đơn giản, có trên mọi trình duyệt** | Không lập trình được GPU |
| SVG [12] | Vẽ giữ lại: mỗi hình là một phần tử trang | Phần tử hình | Trình duyệt xử lý | Thuộc tính `transform` | Trình duyệt tô, có khử răng cưa | Lưu thành file vector | **Sự kiện gắn trực tiếp vào từng hình** | Như trên [6] | FPS | Giảm từ khoảng 400 node [6] | **Hình vector, tương tác dễ nhất** | Nặng khi có hàng nghìn phần tử |
| WebGL 2.0 [13] | Lập trình GPU bằng shader | Dữ liệu đỉnh trong buffer | **Người lập trình tự chia hình thành tam giác** | **Ma trận tự viết, gửi qua uniform** | **Fragment shader tự viết; khử răng cưa MSAA** | Đọc lại điểm ảnh, xuất ảnh | **Instancing: nhiều bản sao trong 1 lệnh vẽ** | Như trên [6] | FPS | Nhanh nhất trong 3 công nghệ [6] | **Truy cập GPU trên trình duyệt, không cần plugin** | Viết nhiều code; chưa có compute shader |
| PixiJS [14] | Thư viện đồ thị cảnh trên WebGL | Đối tượng Graphics, Sprite, Text | **Chia tam giác tự động (thư viện earcut)** | Ma trận trong đồ thị cảnh | Shader viết sẵn; chữ dạng bitmap | Xuất ảnh từ renderer | **Tự gộp lệnh vẽ; hệ sự kiện kèm hit-test** | Bản WebGL trong [6] dùng PixiJS | FPS | Như WebGL [6] | Dùng WebGL dễ dàng | Đường cong bị chia thành đoạn thẳng |
| CanvasKit [15] | Đưa bộ vẽ Skia vào trang bằng WebAssembly | API giống Canvas | **Skia xử lý path trong WebAssembly** | Ma trận của Skia | Chất lượng vẽ path, chữ của Skia | Ghi ra canvas WebGL | Gom lệnh, gửi khi kết thúc khung hình | Không công bố | Không công bố | Không công bố | Chất lượng vẽ của trình duyệt Chrome trên mọi trang | Phải tải thư viện WebAssembly lớn |

**Bảng 2.2c – Kỹ thuật vẽ 2D trên GPU và đồ án của nhóm**
| Tên công trình | Nguyên lý | CĐ1 | CĐ2 | CĐ3 | CĐ4 | CĐ5 | CĐ6 | Data | Độ đo | Kết quả | Đóng góp | Giới hạn / Hướng phát triển |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Loop & Blinn 2005 [1] | Đường cong Bézier dạng phương trình ẩn, kiểm tra tại từng điểm ảnh | Phông chữ, hình vector (Bézier bậc 2, 3) | **Tam giác điều khiển mang tọa độ (u, v); không chia nhỏ đường cong** | Biến đổi phối cảnh tùy ý | **Pixel shader tính u² − v; khử răng cưa theo khoảng cách gần đúng** | Trộn alpha theo độ phủ | Hình cố định; đổi hình dạng phải tiền xử lý lại | Phông chữ TrueType, hình vector, ảnh dán lên vật 3D | Chất lượng ảnh (định tính) | Đường cong mịn ở mọi độ phóng; không công bố số đo | Vẽ đường cong độc lập độ phân giải chỉ bằng shader | Bậc 3 phức tạp; tiền xử lý trên CPU |
| Green 2007 [2] | Trường khoảng cách lưu trong texture, so ngưỡng khi vẽ | Chữ, hình dạng ảnh đen trắng | **Tiền xử lý: ảnh lớn → trường khoảng cách nhỏ**; khi vẽ: 2 tam giác dán texture | Ma trận như hình thường | **So ngưỡng 0,5; khử răng cưa bằng đạo hàm** | Trộn alpha thông thường | Hình tĩnh; đổi hình phải tạo lại trường | Chữ, decal trong game Team Fortress 2 | Chất lượng mép khi phóng to (định tính) | Mép sắc với texture rất nhỏ (ví dụ 64 × 64) | Chữ sắc nét, chi phí thấp | Góc nhọn bị bo tròn khi phóng lớn |
| Kilgard & Bolz 2012 [3] | Vẽ path trên GPU qua 2 bước "stencil, then cover" | Path chuẩn SVG, PostScript, Flash | **Bước stencil: đánh dấu vùng trong path, không chia tam giác trên CPU** | Biến đổi tùy ý, kể cả phối cảnh 3D | **Bước cover: tô vùng đã đánh dấu; khử răng cưa bằng nhiều mẫu mỗi điểm ảnh** | Ghép được với cảnh 3D của OpenGL | Path lưu sẵn trên GPU, vẽ lại không cần CPU | Cảnh SVG đa dạng, cửa sổ 100² → 1100²; trang web, game Flash | Tỉ lệ tốc độ so với Cairo, Skia, Direct2D, Qt; thời gian vẽ (ms) | Nhiều lần nhanh hơn; cảnh cắt phức tạp 8,69 ms so với Cairo 909 ms (1000 × 1000) | Path rendering đầy đủ trên GPU | Cần phần mở rộng riêng của NVIDIA, không có trong WebGL |
| Ganacim et al. 2014 [4] | Cấu trúc tăng tốc "shortcut tree", lấy mẫu song song toàn bộ ảnh | Nội dung SVG, PDF: path tô, nét, gradient, texture | **Xây shortcut tree song song** | Biến đổi phối cảnh, biến dạng tùy ý áp lên mẫu | **Lấy mẫu song song, chia sẻ mẫu giữa các điểm ảnh (tới 512 mẫu mỗi điểm ảnh)** | **Lấy mẫu mọi lớp trong 1 lượt, không sai do trộn chồng lớp** | Xây cây nhanh nên hợp nội dung động | 13 ảnh vector (Tiger, trang bài báo, bản đồ…), rộng 1024 px, GPU GTX Titan | Thời gian vẽ, tiền xử lý (ms), bộ nhớ, chất lượng khử răng cưa | Nhanh hơn Kilgard & Bolz khi nội dung đủ phức tạp; vừa nhanh hơn vừa đẹp hơn ở nội dung phức tạp | Vẽ vector song song chất lượng cao | Viết bằng CUDA, không chạy trong WebGL |
| Li, Hou, Zhou 2016 [5] | Đưa phương pháp quét dòng (scanline) lên GPU | Path | **Chỉ điểm ảnh ở biên xử lý riêng; phần trong xử lý theo đoạn ngang** | Biến đổi path mỗi khung hình | **Giảm số lần tính winding number; có khử răng cưa** | Ghi vào ảnh đầu ra | Hợp dữ liệu động | Dữ liệu động, độ phân giải Ultra HD (theo tóm tắt) | Tốc độ vẽ | Nhanh khoảng 10 lần với dữ liệu động (theo tóm tắt) | Path rendering hiệu quả trên GPU | Cần tính toán đa dụng trên GPU, không có trong WebGL |
| **Đồ án EduViz2D** | Cài lại Loop & Blinn trên WebGL cho Bézier bậc 2 | Cảnh giáo dục → hình học (quỹ đạo → Bézier bậc 2) | **1 tứ giác 4 đỉnh mang (u, v); không chia nhỏ đường cong** | Ma trận qua uniform; phóng to 1× → 64× | **Fragment shader tính u² − v; khử răng cưa theo khoảng cách** | Lớp WebGL dưới, lớp chữ trên; xuất PNG | `requestAnimationFrame`; chọn đối tượng bằng hit-test, GPU picking | Bộ kịch bản mục 4.3 | Sai số hình học, độ phủ, số đỉnh, thời gian vẽ | Trình bày ở Bảng 4.3 | Tái hiện Loop & Blinn trên WebGL, kiểm chứng bằng số đo | Mới làm bậc 2; hình bao là hộp chữ nhật |

**Bảng 2.2d – Nghiên cứu đánh giá hiệu năng** (không phải một cách vẽ nên không xếp vào bảng trên)
| Tên công trình | Mục tiêu | Data | Độ đo | Kết quả | Đóng góp | Giới hạn / Hướng phát triển |
|---|---|---|---|---|---|---|
| Horak, Kister, Dachselt 2018 [6] | So sánh hiệu năng SVG, Canvas, WebGL (bản WebGL dùng PixiJS) | Đồ thị node–cạnh 100 → 3.200 node | FPS khi người dùng thao tác | FPS giảm từ khoảng 400 node ở cả 3; SVG gần bằng Canvas; WebGL nhanh nhất; vẽ chữ làm chậm WebGL | Số liệu so sánh công nghệ vẽ trên web | Poster 1 trang; phần cứng 2018; chỉ đồ thị → đồ án đo lại trên máy hiện nay, nhiều loại cảnh |

**Nhận xét dưới bảng (đoạn mẫu):**
> Nhìn các ô in đậm ở cột Phương pháp: các ứng dụng giáo dục (2.2a) đóng góp chủ yếu ở công đoạn 6 (cập nhật, tương tác), còn việc vẽ giao cho SVG hoặc phần tử trang web; chỉ Falstad Ripple Tank dùng WebGL. Các công nghệ trên trình duyệt (2.2b) khác nhau ở công đoạn 2 và 6: SVG tương tác dễ nhất, WebGL buộc người lập trình tự xử lý hình học nhưng cho phép gộp lệnh vẽ. Các kỹ thuật GPU (2.2c) đều đóng góp ở công đoạn 2 và 4, nhưng Kilgard & Bolz, Ganacim, Li cần tính năng không có trong WebGL. Ở cột Hiệu suất, Loop & Blinn chỉ đánh giá bằng hình, không công bố số đo. Đồ án chọn Loop & Blinn vì chạy được trên WebGL, và bổ sung phần còn thiếu là đo sai số hình học bằng số.

**Trích dẫn dùng trong bảng** (đánh số tạm, khi ghép báo cáo sẽ đánh lại theo danh mục tài liệu cuối):
[1] Loop & Blinn 2005 · [2] Green 2007 · [3] Kilgard & Bolz 2012 · [4] Ganacim et al. 2014 · [5] Li, Hou, Zhou 2016 · [6] Horak, Kister, Dachselt 2018 · [7] Wieman, Adams, Perkins 2008 · [8] P. Falstad, Ripple Tank (falstad.com/ripple; mã nguồn github.com/pfalstad/ripplegl-ts) · [9] VisuAlgo (visualgo.net) · [10] algorithm-visualizer (github.com/algorithm-visualizer) · [11] WHATWG HTML Standard – Canvas 2D · [12] W3C SVG · [13] Khronos WebGL 2.0 Specification · [14] PixiJS v8 documentation · [15] Skia CanvasKit documentation · [16] PhET Scenery (github.com/phetsims/scenery).

**Còn phải làm trước khi nộp:** đọc toàn văn Li et al. 2016 để thay các ô "theo tóm tắt" bằng số liệu trong bài.

### 2.5. Người ta đã làm gì, đồ án làm gì *(~1 trang; A)*
**Viết gì:** trả lời đúng 2 câu hỏi cốt lõi của TUTORIAL 2.5, bằng 3 đoạn:
1. **Người ta đã làm gì:** tóm tắt Bảng 2.2 theo 3 nhóm.
2. **Khuyết điểm còn lại** (MANUAL_FAULT mục 8): chỉ ra **cụ thể** ở công đoạn nào, và là vấn đề **độ chính xác** hay **độ phức tạp tính toán**.
3. **Đồ án làm gì:** chọn giải pháp nào cho Ch.3 và vì sao.

**Bảng 2.3 – Khuyết điểm còn lại và đồ án xử lý thế nào:**
| Khuyết điểm quan sát được | Công đoạn | Loại vấn đề | Đồ án xử lý |
|---|---|---|---|
| Kỹ thuật GPU tiên tiến (Kilgard 2012, Ganacim 2014, Li 2016) cần tính năng WebGL không có | 2, 4 | Không triển khai được trên web | Chọn **Loop & Blinn 2005**, chỉ cần fragment shader nên chạy được trên WebGL (Ch.3) |
| Vẽ đường cong bằng cách chia đoạn thẳng bị lộ cạnh khi phóng to | 2, 4 | **Độ chính xác** hình học | Loop & Blinn tính đường cong tại từng điểm ảnh (Bảng 4.3) |
| Canvas 2D, SVG chậm khi có nhiều đối tượng **[kiểm chứng bằng Bảng 4.4]** | 2, 6 | Độ phức tạp tính toán | Kiến thức nền: gộp nhiều hình vào 1 lệnh vẽ bằng instancing |
| Horak 2018 đo trên phần cứng cũ, chỉ với đồ thị node–cạnh | – | Thiếu số liệu | Đo lại trên máy hiện nay, nhiều loại cảnh, có/không chữ |

**Bảng 2.4 – Báo cáo của nhóm khác các công trình trên ở đâu:**
| Tiêu chí | Bài báo kỹ thuật | Nghiên cứu giáo dục | Báo cáo của nhóm |
|---|---|---|---|
| Loại đóng góp | Thuật toán vẽ mới, hoặc phép đo hẹp (Horak) | Đánh giá hiệu quả học tập với người học | Khảo sát + cài lại + đo |
| Nền tảng | GPU máy tính, Direct3D, CUDA, phần mở rộng OpenGL riêng | Ứng dụng có sẵn | Trình duyệt: HTML5 + WebGL |
| Phạm vi | Thường vẽ tĩnh một loại đối tượng | Một ứng dụng | Tĩnh và động: đường cong, nhiều đối tượng, shader, tương tác |
| Đánh giá | Tốc độ, chất lượng ảnh trên phần cứng của họ | Điểm kiểm tra của người học | Sai số hình học, độ phủ, thời gian khung hình, số lệnh vẽ, số đỉnh |

**Không được tự nhận:** nhanh hơn hay đẹp hơn các bài kỹ thuật (nhóm không cài lại thuật toán của họ); giúp học tốt hơn PhET (nhóm không đo hiệu quả học tập).

**Bảng 2.5 – Lý do chọn Loop & Blinn:**
| Tiêu chí | Kilgard / Ganacim / Li | Green 2007 | **Loop & Blinn 2005 (chọn)** |
|---|---|---|---|
| Đã công bố, uy tín | ACM TOG | SIGGRAPH Course | ACM TOG (SIGGRAPH 2005) |
| Chạy được trên WebGL | Không | Có | Có, chỉ cần fragment shader |
| Khớp với cảnh cần vẽ trong app | – | Chỉ cho chữ | Quỹ đạo ném xiên = Bézier bậc 2 |
| Cài lại vừa sức, đo được | – | Có | Có: phần bậc 2; bậc 3 để làm hướng phát triển |

**Đoạn mẫu (kết chương):**
> Các ứng dụng như PhET, VisuAlgo cho thấy giá trị của mô phỏng tương tác trong dạy học, nhưng phần lớn vẽ bằng SVG. Về kỹ thuật, các giải pháp vẽ 2D tiên tiến trên GPU (Kilgard và Bolz, 2012; Ganacim và cộng sự, 2014; Li và cộng sự, 2016) đòi hỏi những tính năng chưa có trong WebGL như phần mở rộng NV_path_rendering hay compute shader. Phương pháp của Loop và Blinn (2005) chỉ cần fragment shader nên cài đặt được trên WebGL, và khớp với cảnh cần vẽ của đồ án: quỹ đạo ném xiên là một parabol, tức đúng một đường cong Bézier bậc 2. Vì vậy, đồ án chọn trình bày và cài đặt lại phương pháp Loop & Blinn trên WebGL, rồi kiểm chứng độ chính xác hình học và chi phí vẽ của nó so với cách chia đường cong thành đoạn thẳng.

### Tài liệu tham khảo (DOI đã đối chiếu với Crossref)
| Tài liệu | DOI | Nội dung chính | Dùng ở | Ai đọc |
|---|---|---|---|---|
| Charles Loop, Jim Blinn (Microsoft Research), *Resolution independent curve rendering using programmable graphics hardware*, ACM TOG 24(3): 1000–1009, 2005 | 10.1145/1073204.1073303 | Vẽ đường cong Bézier bằng phương trình ẩn trong pixel shader. **Đã có toàn văn** (`Documents/p1000-loop.pdf`) | 2.2, **3.3**, 4.5, Ch.5 | A |
| Green, *Improved alpha-tested magnification for vector textures and special effects*, SIGGRAPH 2007 Courses | 10.1145/1281500.1281665 | Distance field cho chữ và hình | 2.2 | B |
| Kilgard & Bolz, *GPU-accelerated path rendering*, ACM TOG 2012 | 10.1145/2366145.2366191 | Vẽ path vector hoàn toàn trên GPU (stencil, then cover) | 2.2 | A |
| Ganacim et al., *Massively-parallel vector graphics*, ACM TOG 2014 | 10.1145/2661229.2661274 | Vẽ đồ họa vector song song trên GPU | 2.2 | C |
| Li, Hou, Zhou, *Efficient GPU path rendering using scanline rasterization*, ACM TOG 2016 | 10.1145/2980179.2982434 | Tô path theo dòng quét trên GPU | 2.2 | C |
| Horak, Kister, Dachselt, *Comparing rendering performance of common web technologies for large graphs*, IEEE VIS 2018 poster | (poster, không có DOI) | FPS của SVG/Canvas/WebGL theo số node | 2.2, Ch.4 | A |
| Meisters, *Polygons have ears*, American Mathematical Monthly 1975 | 10.1080/00029890.1975.11993898 | Mọi đa giác đơn đều có "tai", cơ sở của ear clipping | 3.2 | A |
| Eder, Held, Palfrader, *Parallelized ear clipping for the triangulation and constrained Delaunay triangulation of polygons*, Computational Geometry 2018 | 10.1016/j.comgeo.2018.01.004 | Ear clipping song song | 3.2 | A |
| Carucci, *Inside geometry instancing*, GPU Gems 2 (2005), chương 3 | (sách, không có DOI; **chưa đối chiếu**) | Instancing | 3.2 | B |
| Wieman, Adams, Perkins, *PhET: Simulations that enhance learning*, Science 2008 | 10.1126/science.1161948 | Thiết kế mô phỏng PhET | 1.2, 2.1 | C |
| Banda & Nzabahimana, *Effect of integrating PhET simulations on students' conceptual understanding in physics*, Phys. Rev. PER 2021 | 10.1103/PhysRevPhysEducRes.17.023108 | Tổng quan 31 nghiên cứu về PhET | 1.2 | C |
| Wang, Zhang, Pang, *Virtual experiments in physics education: a systematic literature review*, Res. Sci. Technol. Educ. 2025 | 10.1080/02635143.2024.2327995 | Tổng quan thí nghiệm ảo trong dạy Vật lý | 1.2, 2.1 | C |
| Hundhausen, Douglas, Stasko, *A meta-study of algorithm visualization effectiveness*, JVLC 2002 | 10.1006/jvlc.2002.0237 | Mức tham gia của người học quyết định hiệu quả | 1.2, 2.1 | B |
| Shaffer et al., *Algorithm visualization: the state of the field*, ACM TOCE 2010 | 10.1145/1821996.1821997 | Khảo sát hơn 500 công cụ minh họa thuật toán | 2.1 | B |
| OpenStax, *University Physics* vol. 1, mục 4.3 | – | Công thức ném xiên | Phụ lục A | C |
| **Luận văn Thạc sĩ / Tiến sĩ (TUTORIAL 2.3)** | – | **Chưa có, cần tìm 1–2 luận văn** | 2.2 | B |

---

## Chương 3. Phương pháp *(A: 3.1–3.3, 3.6; B: 3.4; C: 3.5; khoảng 9–11 trang)*
**Phương pháp chính (TUTORIAL 2.6: phương pháp tiên tiến đã công bố): Loop & Blinn 2005.** Đồ án cài lại **phần đường cong Bézier bậc 2 và nét vẽ khử răng cưa**, áp dụng vẽ quỹ đạo ném xiên. Phần bậc 3 để làm hướng phát triển (Ch.5).

Các mục khác của chương trình bày **kỹ thuật HTML5 + WebGL** mà phương pháp và ứng dụng dựa vào:
- 3.2: pipeline WebGL;
- 3.4: cập nhật động và tương tác;
- 3.5: tính toán theo từng điểm ảnh.

### 3.1. Sơ đồ chung *(~1 trang)*
**Hình 3.1:** sơ đồ: Mô tả cảnh (JavaScript) → Vertex buffer (GPU) → Vertex shader → Raster hóa → Fragment shader → Framebuffer của `<canvas>`; vòng `requestAnimationFrame` và sự kiện DOM quay lại "Mô tả cảnh". Ghi số công đoạn 1–6 của Bảng 1.2 lên từng khối; **đánh dấu khối dùng Loop & Blinn** (công đoạn 2 và 4 khi vẽ đường cong).

### 3.2. Kiến thức nền: pipeline WebGL *(~3 trang; A)*
**Viết gì:**
- GPU vẽ được điểm, đoạn thẳng và tam giác; **mọi vùng tô phải chia thành tam giác**.
- GPU xử lý song song hàng nghìn đỉnh và điểm ảnh; điểm nghẽn thường nằm ở **CPU gửi lệnh vẽ**.
- Minh họa bằng bài *Pipeline WebGL từng bước*.

**Đoạn mẫu:**
> Mỗi lệnh vẽ mà JavaScript gửi tới GPU đều tốn chi phí cố định ở phía CPU: kiểm tra trạng thái, chuẩn bị dữ liệu, chuyển lệnh qua trình duyệt xuống trình điều khiển đồ họa. Khi vẽ 10.000 hình bằng 10.000 lệnh, chi phí này lặp lại 10.000 lần. Instancing cho phép gửi một lệnh duy nhất kèm một bộ đệm chứa vị trí của cả 10.000 bản sao; GPU tự lặp lại hình cho từng bản sao.

| Mục | Viết gì | Code trích | Hình |
|---|---|---|---|
| 3.2.1 Chia đa giác thành tam giác | Định lý "mọi đa giác đơn có tai" (Meisters 1975); giải thuật cắt tai, độ phức tạp O(n²) | `js/webgl/triangulate.js` | 3.2: ngôi sao lõm 14 đỉnh → 12 tam giác |
| 3.2.2 Ma trận biến đổi 2D | Tọa độ thuần nhất 3×3; ma trận chiếu từ điểm ảnh sang clip space; ghép dời–xoay–co giãn | `js/webgl/matrix.js` (`ortho2D`, `multiply`) | 3.3: đa giác trước/sau khi xoay 45° |
| 3.2.3 Shader | Vertex shader nhân ma trận; fragment shader tô màu theo từng điểm ảnh | GLSL trong `js/tech/pipeline.js` | 3.4: đa giác tô chuyển màu |
| 3.2.4 Instancing | `vertexAttribDivisor`, `drawArraysInstanced`; so với vòng lặp `drawArrays` | `js/webgl/instanced-rects.js` | 3.5: 100 bản sao, 1 lệnh vẽ |

### 3.3. Phương pháp chính: vẽ đường cong độc lập độ phân giải (Loop & Blinn 2005) *(~3 trang; A)*
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

**Hình 3.7:** tam giác P0 P1 P2 của một quỹ đạo, ghi (u, v) ở 3 đỉnh, vùng f < 0 và f > 0 tô hai màu.

**3.3.3. Giải thuật.**
| Bước | CPU (JavaScript) | GPU |
|---|---|---|
| 1 | Tính P0, P1, P2 (`parabolaToBezier`) | |
| 2 | Tính phép biến đổi affine (x, y) → (u, v) (`uvTransform`); 3 điểm thẳng hàng thì chuyển sang vẽ đoạn thẳng | |
| 3 | Lấy hộp bao 3 điểm + lề bằng nét vẽ → 4 góc tứ giác, mỗi góc kèm (u, v) | |
| 4 | Nạp 4 đỉnh vào buffer, gọi 1 lệnh `drawArrays(TRIANGLE_STRIP)` | Vertex shader: đổi vị trí sang clip space, chuyển (u, v) xuống |
| 5 | | Raster hóa nội suy (u, v) cho từng điểm ảnh |
| 6 | | Fragment shader: f = u² − v; d = f / ‖∇f‖; độ phủ theo d; chỉ giữ 0 ≤ u ≤ 1 |

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
- **Hình 3.8:** bài Ném xiên ở mức phóng to 16× quanh đỉnh, hai cách vẽ đặt cạnh nhau (ô "Cách vẽ").
- **Hình 3.9:** ba ảnh cắt từ trang thử nghiệm `benchmark/curve.html` (Loop & Blinn, 120 đoạn, 30 đoạn).

**3.3.5. Đối chiếu với bài báo** (đã đọc toàn văn):
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

### 3.4. Cập nhật động và tương tác trong HTML5 *(~1,5 trang; B)*
**Viết gì:** công đoạn 6, phần "động" của đề tài.
1. **Vòng cập nhật:** `requestAnimationFrame` gọi hàm vẽ mỗi khung hình, đưa vào Δt; chỉ vẽ lại lớp thay đổi (lớp tĩnh như hệ trục giữ nguyên).
2. **Đưa dữ liệu mới lên GPU:** `bufferSubData` thay vì tạo buffer mới.
3. **Nhận thao tác:** sự kiện chuột/cảm ứng/bàn phím của DOM.
4. **Chọn đối tượng** (ẩn số "đối tượng nào bị chọn"): 2 cách, so sánh ở Bảng 3.2; đo ở thử nghiệm (g).
5. **Hình:** bài Sắp xếp khi kéo-thả một cột; bài Pipeline khi chọn bản sao #53.

**Bảng 3.2 – Hai cách chọn đối tượng:**
| | Tính toán (hit-test) | GPU picking |
|---|---|---|
| Ý tưởng | Suy chỉ số từ tọa độ chuột (cột i = ⌊(x − lề) / độ rộng cột⌋) | Vẽ lại cảnh bằng "màu mã" vào framebuffer ẩn, đọc màu tại chuột bằng `readPixels` |
| Độ phức tạp | O(1) | Một lượt vẽ thêm + chờ GPU trả 1 điểm ảnh |
| Dùng được khi | Phần tử xếp đều (cột, lưới) | Mọi hình dạng, kể cả hình lõm, xoay, hàng nghìn bản sao |
| Code | `js/core/hit-test.js` (bài Sắp xếp) | `js/webgl/picking.js` (bài Pipeline, Đồ thị) |

### 3.5. Tính toán theo từng điểm ảnh trên GPU *(~1,5 trang; C)*
**Viết gì:** fragment shader như một "chương trình chạy song song cho mọi điểm ảnh", ví dụ bài giao thoa sóng.
1. Mỗi điểm ảnh (X, Y) tự tính khoảng cách tới 2 nguồn r₁, r₂ và màu theo biên độ tổng hợp. Công thức vật lý ở Phụ lục A; ở đây chỉ trình bày **cách đưa công thức vào shader**: vị trí nguồn, bước sóng, thời gian truyền qua uniform; `gl_FragCoord` cho tọa độ điểm ảnh (gốc ở góc **dưới** trái, phải nhân `devicePixelRatio`).
2. So với cách làm trên CPU: JavaScript lặp W × H điểm ảnh, ghi vào `ImageData` của Canvas 2D. Số phép tính như nhau, khác ở chỗ chạy tuần tự hay song song. Đo ở thử nghiệm (c).
3. **Hình:** ảnh giao thoa và đoạn GLSL tương ứng.

### 3.6. Tiến trình hoạt động *(~1 trang; A – MANUAL_FAULT mục 5)*
**Viết gì:** đi qua **một khung hình cụ thể**, bằng tham số đồ họa.

**Đoạn mẫu:**
> Xét quỹ đạo có P0 = (0; 0), P1 = (20,41; 20,41), P2 = (40,82; 0) m (ném với 20 m/s, 45°). Khung vẽ 746 × 574 điểm ảnh, `devicePixelRatio` = 1 **[thay bằng kích thước thật]**.
> (1) Mô tả cảnh: một đường cong Bézier bậc 2, nét rộng 2,5 điểm ảnh, màu xanh.
> (2) Xử lý hình học: không chia đường cong; CPU tính (u, v) cho 4 góc của hộp bao, nạp 4 đỉnh × 4 số thực vào vertex buffer.
> (3) Biến đổi: ma trận khung nhìn đổi mét sang điểm ảnh, ma trận chiếu đổi điểm ảnh sang clip space; khi phóng to 16×, chỉ ma trận đổi, 4 đỉnh được tính lại.
> (4) Raster hóa và tô màu: GPU nội suy (u, v) cho mọi điểm ảnh trong tứ giác; fragment shader tính u² − v và tô các điểm ảnh cách đường cong dưới 1,25 điểm ảnh, mép mờ thêm 1 điểm ảnh.
> (5) Hợp thành: lớp WebGL nằm dưới, PixiJS vẽ hệ trục và chữ đè lên; nút "Xuất PNG" ghép hai lớp thành một ảnh.
> (6) Cập nhật: khi người học kéo thanh phóng to, sự kiện `input` gọi vẽ lại; tổng cộng 1 lệnh vẽ cho quỹ đạo mỗi khung hình.

Kèm **Hình 3.2–3.5**: ảnh chụp các bước của bài *Pipeline WebGL từng bước* (kiến thức nền).

### Bảng 3.3 – Kiến thức HTML5 / WebGL ↔ code nhóm tự viết (để trích code; phần nào PixiJS làm thì ghi rõ)
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

### 4.1. Môi trường *(~0,5 trang)*
**Bảng 4.1:**
- Phần cứng: CPU, RAM, GPU (các trang thử nghiệm tự ghi tên GPU). Máy có 2 GPU (tích hợp + rời) thì trình duyệt có thể chọn GPU khác nhau giữa các lần chạy, nên phải ghi GPU của từng lần đo.
- Hệ điều hành, trình duyệt + phiên bản, độ phân giải màn hình, devicePixelRatio.
- Phần mềm: HTML5, JavaScript, WebGL 2, PixiJS 8.22.0.

Đo trên **ít nhất 2 máy** nếu được.

### 4.2. Các bài minh họa *(~1,5 trang)*
**Bảng 4.2** – mỗi bài ghi **tác vụ đồ họa** nó minh họa:
| Bài | Tác vụ HTML5 / WebGL minh họa | Tĩnh / động | Tương tác trực tiếp | Người làm |
|---|---|---|---|---|
| **Ném xiên** | **Phương pháp chính: đường cong bằng Loop & Blinn**; phóng to 1×–64×; scissor; animation | Cả hai | Đổi cách vẽ, phóng to; kéo mũi tên v₀, bắn trúng bia | A (quỹ đạo), C (tương tác) |
| Sắp xếp | Nhiều hình bằng instancing (WebGL thuần); chọn cột bằng hit-test | Động | Kéo-thả đổi chỗ, vẽ dữ liệu bằng chuột | B |
| BFS/DFS/Dijkstra | Chọn node bằng GPU picking; chữ bằng BitmapText | Cả hai | Kéo node, thêm node/cạnh | A |
| A* | Lưới nhiều ô cập nhật từng bước; chọn ô bằng hit-test | Động | Vẽ tường, kéo điểm đầu/đích | B |
| Giao thoa sóng | Tính màu từng điểm ảnh bằng fragment shader | Động | Kéo 2 nguồn | C |
| Con lắc/lò xo | Vòng cập nhật `requestAnimationFrame` theo Δt | Động | Kéo quả nặng rồi thả | C |
| Pipeline WebGL | Kiến thức nền: toàn bộ pipeline WebGL thuần | Cả hai | Kéo đỉnh, GPU picking | A (đã xong) |

Mỗi bài 1 ảnh chụp kèm 2–3 câu nói rõ **tác vụ đồ họa nào** được minh họa, không mô tả nút bấm.

### 4.3. Bộ thử nghiệm *(~1 trang – MANUAL_FAULT mục 7)*
Không có tập dữ liệu chuẩn cho bài toán này (TUTORIAL 2.4), nên nhóm tự xây bộ kịch bản và ghi rõ tiêu chí. Dữ liệu lưu ở thư mục Data. Mọi thử nghiệm đo **đại lượng đồ họa**.

| Thử nghiệm | Vai trò | Mục đích | Bộ kịch bản (số mẫu) | Tiêu chí, thách thức | Đáp án đúng / mốc so sánh |
|---|---|---|---|---|---|
| **(f) Loop & Blinn** | **Chính** – kiểm chứng phương pháp Ch.3 | Đường cong có giữ đúng và mịn khi phóng to như bài báo khẳng định không; tốn bao nhiêu | 1 đường cong (quỹ đạo 20 m/s, 45°) × 3 cách vẽ (Loop & Blinn, 120 đoạn, 30 đoạn) × 4 mức phóng to (1×, 4×, 16×, 64×) = 12 lần đo; nét 2 px; khung 960 × 540, pixel ratio 1 | Phóng to lớn là trường hợp khó cho cách chia đoạn thẳng | Đường cong thật (phương trình) là đáp án; chia đoạn thẳng là mốc |
| (a) Hiệu năng vẽ | Nền | Pipeline WebGL chịu được bao nhiêu đối tượng | 3 cách vẽ × 5 mức (1k–100k) × có/không chữ = 30 lần đo × 3 s | Thang log để thấy điểm gãy (mượn từ Horak 2018); chữ là trường hợp khó | Canvas 2D, PixiJS |
| (e) Instancing | Nền | 1 lệnh vẽ so với N lệnh vẽ | 1, 10, 100, 1.000, 10.000 bản sao | Nhiều bản sao lộ chi phí mỗi lệnh | Vòng lặp `drawElements` |
| (c) Tính theo điểm ảnh | Nền | GPU nhanh hơn CPU bao nhiêu khi tính màu từng điểm ảnh | Giao thoa sóng ở 4 độ phân giải (480 × 270 → 1920 × 1080) | Số điểm ảnh tăng theo bình phương kích thước | Bản CPU (Canvas 2D `ImageData`); hai bản phải ra cùng ảnh |
| (g) Chọn đối tượng | Nền | Hit-test và GPU picking mất bao lâu, có chọn đúng không | 100, 1.000, 10.000 đối tượng × 1.000 vị trí chuột ngẫu nhiên | Đối tượng nhỏ, chồng lên nhau, hình lõm | Vị trí đối tượng đã biết (đáp án); hai cách so với nhau. **[Chưa có công cụ đo]** |

### 4.4. Kết quả *(~4 trang)*
**Độ đo** (MANUAL_FAULT mục 6), lấy từ "tiêu chí tốt" ở Bảng 1.1:
- **Độ chính xác:** sai số hình học (điểm ảnh), độ phủ đường cong (%), tỉ lệ chọn đúng đối tượng (%).
- **Độ phức tạp, hiệu năng:** số đỉnh gửi lên GPU, số lệnh vẽ, thời gian vẽ, thời gian khung hình (trung bình, p95), FPS, thời gian CPU.

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

- **Hình 4.1:** biểu đồ đường, trục x = mức phóng to (thang log), trục y = sai số lớn nhất (px), 3 đường cho 3 cách vẽ.
- **Hình 4.2:** ba ảnh cắt ở 16× từ trang thử nghiệm.

**Bảng 4.4 – Thử nghiệm (a): hiệu năng vẽ** (số chạy thử, GPU Intel Iris Xe, **[thay bằng số đo thật]**):
| Cách vẽ | Số hình | Chữ | FPS | Khung hình TB (ms) | CPU vẽ TB (ms) | Lệnh vẽ |
|---|---|---|---|---|---|---|
| Canvas 2D | 20.000 | không | 27 | 37,8 | 11,36 | – |
| PixiJS | 20.000 | không | 60 | 16,7 | 1,24 | 1 |
| WebGL thuần | 20.000 | không | 61 | 16,7 | 0,39 | 1 |

**Bảng 4.5 – Thử nghiệm (e): instancing** (số chạy thử, **[thay bằng số đo thật]**): 10.000 bản sao: instancing 1 lệnh vẽ, CPU 0,10 ms; vòng lặp 10.000 lệnh vẽ, CPU 1,83 ms.

**Bảng 4.6 – Thử nghiệm (c): tính theo điểm ảnh** (C điền): độ phân giải, số điểm ảnh, CPU (ms/khung), GPU (ms/khung), nhanh gấp.

**Bảng 4.7 – Thử nghiệm (g): chọn đối tượng** (B điền): số đối tượng, cách chọn, thời gian trung bình mỗi lần chọn (ms), tỉ lệ chọn đúng (%).

### 4.5. Bàn luận *(~1,5 trang)*
**Viết gì:** giải thích **vì sao** kết quả như vậy, dựa vào Ch.3. Thử nghiệm (f) bàn trước và kỹ nhất. Với (a), so hướng với Horak 2018, không so trực tiếp con số.

**Đoạn mẫu cho (f)** (dựa trên số chạy thử, phải viết lại theo số thật):
> Ở mức phóng to 1×, cả ba cách vẽ đều gần như không sai số, vì mỗi đoạn thẳng ngắn hơn một điểm ảnh. Khi phóng to 64× quanh đỉnh, đường gấp khúc 120 đoạn lệch tới 0,65 điểm ảnh và chỉ phủ 83 % đường cong thật; đường 30 đoạn lệch tới 11 điểm ảnh. Loop & Blinn vẫn giữ sai số dưới 0,01 điểm ảnh ở mọi mức phóng to mà chỉ dùng 4 đỉnh. Nguyên nhân: đường gấp khúc xấp xỉ đường cong trên CPU **trước** khi phóng to, còn Loop & Blinn tính lại phương trình u² − v tại **từng điểm ảnh** sau khi phóng to (Mục 3.3.1). Kết quả này khớp với tính chất "độc lập độ phân giải" mà Loop và Blinn (2005) khẳng định. Bài báo không công bố bảng số đo, nên báo cáo chỉ kiểm chứng tính chất đó, không so sánh con số với bài báo.

**Đoạn mẫu cho (a):**
> Ở 20.000 hình, Canvas 2D cần khoảng 11 ms thời gian CPU mỗi khung hình, vì JavaScript phải gọi `fillRect` 20.000 lần. WebGL thuần chỉ cần 0,39 ms, vì toàn bộ vị trí được nạp vào một bộ đệm và vẽ bằng một lệnh `drawArraysInstanced` (Mục 3.2.4). Hướng kết quả tương tự Horak và cộng sự (2018), nơi WebGL nhanh hơn Canvas và SVG, dù hai thử nghiệm khác phần cứng và loại cảnh.

**Không áp dụng:** MANUAL_FAULT mục 4 (giai đoạn huấn luyện, loss function, đánh nhãn) dành cho đề tài học máy. Báo cáo ghi một câu: đồ án không có giai đoạn huấn luyện; "groundtruth" tương ứng là đường cong thật (phương trình), ảnh tính trên CPU (thử nghiệm c) và vị trí đối tượng đã biết (thử nghiệm g).

---

## Chương 5. Kết luận và hướng phát triển *(A, khoảng 1–2 trang)*
**Viết gì:**
1. **Kết quả đạt được:** nhắc lại từng đóng góp ở Bảng 1.4, mỗi cái kèm **một con số** chính từ Ch.4. Đóng góp về Loop & Blinn nêu đầu tiên.
2. **Hạn chế:**
   - Loop & Blinn mới cài cho Bézier bậc 2, hình bao là hộp chữ nhật (thừa điểm ảnh);
   - WebGL thuần chưa vẽ chữ;
   - đo trên ít loại máy;
   - chưa đánh giá với người học thật.
3. **Hướng phát triển:**
   - Loop & Blinn cho **Bézier bậc 3** (phân loại đường cong, kiểm tra hướng, chia nhỏ đường có vòng – §4 bài báo); dùng tam giác điều khiển cộng dải lề thay cho hộp chữ nhật;
   - vẽ chữ bằng distance field (Green 2007);
   - chuyển sang WebGPU để dùng compute shader, mở đường cho Ganacim 2014, Li 2016;
   - thử nghiệm với người học (bài kiểm tra trước/sau).

**Đoạn mẫu:**
> Báo cáo đã khảo sát 15 công trình vẽ 2D trên web và ứng dụng trực quan hóa giáo dục, chọn trình bày và cài đặt lại phương pháp vẽ đường cong độc lập độ phân giải của Loop và Blinn (2005) trên WebGL, áp dụng vẽ quỹ đạo trong ứng dụng EduViz2D. Ở mức phóng to 64×, phương pháp giữ sai số dưới [x] điểm ảnh với 4 đỉnh, trong khi đường gấp khúc 120 đoạn lệch [y] điểm ảnh với 720 đỉnh. Hạn chế là mới cài đặt cho đường cong bậc 2; mở rộng sang bậc 3 và WebGPU là hướng phát triển tiếp theo.

---

## Phụ lục A. Mô hình vật lý dùng để sinh cảnh *(C)*
Không thuộc phần đánh giá đồ họa; chỉ giải thích dữ liệu đầu vào của các bài Vật lý.
- **Ném xiên** (OpenStax 4.3): x(t) = v₀cosθ·t, y(t) = v₀sinθ·t − ½gt²; T = 2v₀sinθ/g, R = v₀²sin2θ/g, H = (v₀sinθ)²/(2g). Ví dụ v₀ = 20 m/s, θ = 45°, g = 9,8 m/s²: T = 2,886 s, R = 40,816 m, H = 10,204 m.
- **Con lắc đơn:** θ'' = −(g/L) sin θ; với góc nhỏ, chu kỳ T₀ = 2π√(L/g).
- **Lò xo:** x'' = −(k/m) x, ω = √(k/m); với x(0) = A, v(0) = 0: x(t) = A cos(ωt); năng lượng E = ½mv² + ½kx² không đổi.
- **Tích phân số** (bước Δt, a = a(x)):
  - Euler hiện: xₙ₊₁ = xₙ + vₙΔt, vₙ₊₁ = vₙ + a(xₙ)Δt; sai số toàn cục O(Δt); năng lượng lò xo tăng dần.
  - Velocity Verlet: xₙ₊₁ = xₙ + vₙΔt + ½aₙΔt², vₙ₊₁ = vₙ + ½(aₙ + aₙ₊₁)Δt; O(Δt²); năng lượng dao động quanh giá trị đúng, không trôi.
  - RK4: 4 lần tính đạo hàm k₁…k₄ mỗi bước; O(Δt⁴).
- **Giao thoa hai nguồn cùng pha:** yᵢ = A sin(ωt − k rᵢ), k = 2π/λ. Biên độ tổng hợp 2A|cos(k(r₁ − r₂)/2)|; cực đại khi r₁ − r₂ = nλ, cực tiểu khi r₁ − r₂ = (n + ½)λ.
- Nếu C làm so sánh integrator, kết quả đặt ở đây (không phải Ch.4).

## Phụ lục B. Thuật toán dùng để sinh cảnh *(B)*
- Giả mã Bubble, Quick, Merge, Heap Sort; BFS, DFS, Dijkstra; A* (heuristic Manhattan trên lưới).
- Cách ghi các bước "so sánh / đổi chỗ / thăm" bằng generator để phát lại; ngưỡng ghi lại khoảng 2.000 phần tử.
- Nếu B làm so sánh Dijkstra với A*, kết quả đặt ở đây (không phải Ch.4).

---

## Đối chiếu nhanh với MANUAL_FAULT
| Mục | Xử lý ở đâu |
|---|---|
| 1. Framework chung, không gắn phương pháp | 1.3, Bảng 1.2 (công đoạn 2 để mở: "xấp xỉ hay tính trực tiếp?") |
| 2. Ẩn số | Bảng 1.2 cột "Ẩn số cần tìm"; Bảng 1.3 |
| 3. Related works cùng tiêu chí | Bảng 2.2a–c theo **mẫu của thầy** (Nguyên lý, Pipeline công đoạn 1–6, Hiệu suất: Data / Độ đo / Kết quả, Đóng góp, Giới hạn); 2.1–2.2 viết theo cùng thứ tự cột |
| 4. Giai đoạn huấn luyện | Không áp dụng, ghi rõ trong 4.5 |
| 5. Tiến trình hoạt động | 3.6 (đi qua shader Loop & Blinn, bằng tham số đồ họa) |
| 6. Độ đo | 4.4, dẫn từ "tiêu chí tốt" ở Bảng 1.1 |
| 7. Tập dữ liệu | 4.3 |
| 8. Khuyết điểm related works | Bảng 2.2 cột "Giới hạn / Hướng phát triển", Bảng 2.3 |
