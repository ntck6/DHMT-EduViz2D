# Dàn ý chi tiết báo cáo – Xây dựng ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục

Theo `FORMAT_PRESENTATION.md` (5 chương) và các lỗi cần tránh trong `MANUAL_FAULT.md`. Bảng đối chiếu từng yêu cầu: `KIEM_TRA_YEU_CAU.md`.

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
| Câu hỏi chính | Vẽ 2D tĩnh và động bằng HTML5 + WebGL thế nào để trực quan hóa kiến thức? Cách nào tốt hơn, vì sao? | App của nhóm có những chức năng gì? |
| Nội dung chính | Bài toán, các giải pháp đã có, nguyên lý, giải thuật, số liệu đo | Yêu cầu, sơ đồ use case, giao diện, hướng dẫn dùng |
| Vai trò của app | Bằng chứng cho Ch.3 và nguồn số liệu cho Ch.4 | Là toàn bộ nội dung báo cáo |
| Ví dụ câu viết | "Fragment shader tính màu mỗi điểm ảnh theo biên độ tổng hợp của hai nguồn sóng, nên mọi điểm ảnh được xử lý song song trên GPU." | "Người dùng bấm nút Play để bắt đầu mô phỏng." |

Ảnh chụp app chỉ dùng để minh họa một kỹ thuật hay một kết quả đo, không để giới thiệu tính năng.

---

## Chương 1. Giới thiệu *(A, khoảng 4–5 trang)*

### 1.1. Bối cảnh chung *(~1 trang)*
**Viết gì:**
1. Nhiều kiến thức Tin học và Vật lý là quá trình **diễn ra theo thời gian**: thuật toán sắp xếp đổi chỗ từng cặp, vật ném xiên bay theo quỹ đạo, sóng lan truyền. Hình tĩnh trong sách chỉ cho thấy kết quả cuối, không cho thấy quá trình.
2. Trình duyệt web có sẵn trên mọi máy tính và điện thoại, không cần cài đặt. HTML5 cung cấp 3 cách vẽ 2D: Canvas 2D, SVG và WebGL. Trong đó WebGL cho phép lập trình trực tiếp trên GPU bằng shader.
3. Câu chuyển sang 1.2: cần trực quan hóa động, tương tác được, chạy mượt với nhiều đối tượng.

**Đoạn mẫu:**
> Trong dạy và học Tin học, Vật lý, nhiều khái niệm là một quá trình chứ không phải một trạng thái: thuật toán Bubble Sort so sánh và đổi chỗ từng cặp phần tử; một vật ném xiên thay đổi vị trí và vận tốc theo từng thời điểm. Hình minh họa tĩnh chỉ thể hiện được một khoảnh khắc của quá trình đó. Trong khi đó, trình duyệt web có mặt trên hầu hết thiết bị của người học, và chuẩn HTML5 cho phép vẽ đồ họa 2D trực tiếp trên trang web qua thẻ `<canvas>`, kể cả lập trình GPU thông qua WebGL.

### 1.2. Động lực nghiên cứu *(~1 trang)*
**Viết gì:** chia hai ý, đúng như FORMAT_PRESENTATION yêu cầu.
- **Ý nghĩa khoa học:** vẽ 2D hiệu quả trên GPU là bài toán có nhiều lời giải (chia tam giác, gộp lệnh vẽ, vẽ đường cong bằng shader, tô theo dòng quét…). Trên trình duyệt, lời giải bị giới hạn bởi những gì WebGL cung cấp, nên cần khảo sát lại xem cách nào dùng được và hiệu quả đến đâu.
- **Ý nghĩa thực tiễn:** mô phỏng tương tác giúp người học hiểu khái niệm (Wieman 2008; Banda & Nzabahimana 2021 tổng hợp 31 nghiên cứu; Wang et al. 2025). Hundhausen 2002 cho thấy hiệu quả phụ thuộc vào việc người học **được thao tác**, không chỉ xem. Muốn thao tác mượt với hàng nghìn đối tượng thì cách vẽ phải nhanh.

**Đoạn mẫu (ý thực tiễn):**
> Tổng quan của Banda và Nzabahimana (2021) trên 31 nghiên cứu cho thấy việc tích hợp mô phỏng PhET hỗ trợ người học hiểu khái niệm Vật lý. Với công cụ minh họa thuật toán, Hundhausen và cộng sự (2002) chỉ ra rằng mức độ người học tham gia thao tác quan trọng hơn hình thức hiển thị. Điều này đặt ra yêu cầu kỹ thuật: ứng dụng phải phản hồi ngay khi người học kéo, thả, thay đổi tham số, kể cả khi cảnh có hàng nghìn đối tượng.

### 1.3. Phát biểu bài toán *(~1,5 trang)*
**Viết gì:**
1. **Input:** tham số mô hình (v₀, góc ném, độ cứng lò xo…) hoặc dữ liệu thuật toán (mảng, đồ thị, lưới); thời gian; thao tác chuột/bàn phím của người học.
2. **Output:** khung hình 2D trên trình duyệt:
   - tĩnh: quỹ đạo, sơ đồ, đồ thị, ảnh xuất ra;
   - động: animation, mô phỏng, phát lại từng bước, phản hồi khi kéo-thả.
3. **Framework 6 công đoạn** (chỉ nêu công đoạn, **không** nêu phương pháp – MANUAL_FAULT mục 1) và **ẩn số** của từng công đoạn (mục 2).

**Bảng 1.1 – Framework chung:**
| # | Công đoạn | Ẩn số cần tìm | Ví dụ với bài ném xiên |
|---|---|---|---|
| 1 | Tính toán mô hình | Trạng thái tại thời điểm t, hoặc bước tiếp theo của thuật toán | (x, y, vₓ, vᵧ) tại t = 1,2 s |
| 2 | Ánh xạ sang cảnh 2D | Đại lượng nào vẽ bằng hình gì, thứ tự vẽ | Vật = hình tròn, vận tốc = mũi tên, quỹ đạo = đường cong |
| 3 | Xử lý hình học | Cách đưa hình về dạng GPU vẽ được | Đường cong → các đoạn thẳng → tam giác |
| 4 | Biến đổi tọa độ | Phép biến đổi từ đơn vị thật sang điểm ảnh | 1 m = ? điểm ảnh; gốc tọa độ ở đâu |
| 5 | Tô màu điểm ảnh | Màu từng điểm ảnh; cách khử răng cưa | Mép hình tròn không bị răng cưa |
| 6 | Cập nhật và tương tác | Bước thời gian mỗi khung hình; đối tượng nào bị chọn | Kéo mũi tên v₀ → tính lại quỹ đạo |

**Hình 1.1:** sơ đồ khối 6 công đoạn, vẽ bằng draw.io: các hộp nối mũi tên, mũi tên quay lại từ công đoạn 6 về công đoạn 1.

### 1.4. Đóng góp *(~0,5–1 trang)*
**Viết gì:** liệt kê đúng những gì báo cáo làm được, mỗi đóng góp chỉ rõ **bằng chứng nằm ở đâu**. Không dùng các từ "đề xuất phương pháp mới", "tốt hơn", "vượt trội".

**Bảng 1.2 – Đóng góp và bằng chứng:**
| # | Đóng góp | Bằng chứng trong báo cáo | Trạng thái |
|---|---|---|---|
| 1 | Khảo sát và so sánh 16 giải pháp (5 ứng dụng giáo dục, 5 công nghệ vẽ trên web, 6 bài báo) theo **cùng 6 công đoạn** | Bảng 2.2 | Đã điền, còn vài ô cần kiểm chứng |
| 2 | **Trình bày và cài đặt lại phương pháp Loop & Blinn (2005) trên WebGL** cho đường cong Bézier bậc 2, áp dụng vẽ quỹ đạo ném xiên | Mục 3.3, bài Ném xiên, `js/webgl/loop-blinn.js` | **Code xong** |
| 3 | **Kiểm chứng Loop & Blinn bằng thử nghiệm (f)**: sai số hình học, độ phủ, số đỉnh, thời gian, so với cách chia đoạn thẳng, ở 4 mức phóng to | Bảng 4.3, Hình 4.1 | Công cụ xong, có số chạy thử; **[đo lại trên máy thật]** |
| 4 | Trình bày kiến thức nền HTML5 + WebGL bằng mã nguồn tự viết: chia tam giác, ma trận, instancing, chọn đối tượng bằng GPU | Mục 3.2, bài Pipeline, Bảng 3.3 | Code và hình đã có |
| 5 | Đo hiệu năng Canvas 2D, PixiJS, WebGL thuần trên phần cứng hiện nay, mở rộng phép đo của Horak et al. 2018; đo tác dụng của instancing | Bảng 4.4, 4.5 | Công cụ xong, **[cần số đo]** |
| 6 | Ứng dụng minh họa mã nguồn mở EduViz2D: các bài Tin học, Vật lý có tương tác trực tiếp | Bảng 4.2, thư mục Source code | Một phần |

**Đoạn mẫu:**
> Báo cáo có các đóng góp sau:
> (1) Khảo sát và so sánh 16 giải pháp liên quan, gồm ứng dụng trực quan hóa giáo dục, công nghệ vẽ 2D trên web và các kỹ thuật vẽ 2D trên GPU, theo cùng một khung 6 công đoạn (Bảng 2.2).
> (2) Trình bày và cài đặt lại phương pháp vẽ đường cong độc lập độ phân giải của Loop và Blinn (2005) trên WebGL, áp dụng để vẽ quỹ đạo chuyển động ném xiên (Mục 3.3).
> (3) Kiểm chứng phương pháp bằng thử nghiệm đo sai số hình học, độ phủ và chi phí vẽ ở nhiều mức phóng to, so với cách chia đường cong thành đoạn thẳng (Mục 4.4).
> (4) Trình bày kiến thức nền về HTML5 và WebGL bằng mã nguồn tự cài đặt, gồm chia đa giác thành tam giác, ma trận biến đổi, instancing và chọn đối tượng bằng GPU (Mục 3.2).
> (5) Đo hiệu năng của Canvas 2D, PixiJS và WebGL thuần trên phần cứng hiện nay, mở rộng phép đo của Horak và cộng sự (2018).
> (6) Xây dựng ứng dụng minh họa mã nguồn mở EduViz2D với các bài Tin học, Vật lý có tương tác trực tiếp.
> Báo cáo không đề xuất thuật toán vẽ mới và không đánh giá hiệu quả học tập với người học thật.

---

## Chương 2. Các công trình nghiên cứu liên quan *(A khung + gộp; B phần Tin học; C phần Vật lý; khoảng 7–9 trang)*

### 2.1. Ứng dụng trực quan hóa giáo dục *(~2 trang; B: VisuAlgo, algorithm-visualizer; C: PhET, Falstad; A: GeoGebra)*
**Viết gì, mỗi ứng dụng một đoạn theo cùng dàn 5 ý** (MANUAL_FAULT mục 3: không viết mỗi cái một kiểu):
1. Là gì, của ai, năm.
2. Minh họa kiến thức gì.
3. Vẽ bằng gì: lấy từ cột "Nền tảng, cách vẽ" của Bảng 2.2a. PhET, Falstad, VisuAlgo đã quan sát; algorithm-visualizer đã đọc mã nguồn; GeoGebra còn phải kiểm chứng.
4. Người học thao tác được gì: chỉ xem / đổi tham số / kéo-thả / tự làm.
5. Khuyết điểm theo công đoạn ở 1.3.

**Đoạn mẫu (khung để điền):**
> PhET (Wieman và cộng sự, 2008) là bộ mô phỏng của Đại học Colorado Boulder cho các môn Vật lý, Hóa học, Toán. Phiên bản hiện nay chạy bằng HTML5 trên thư viện Scenery. Bài Projectile Motion vẽ chủ yếu bằng SVG: màn hình Intro có khoảng 236 hình SVG và không có canvas (nhóm quan sát ngày 09/11/2026). Người học thay đổi tham số bằng thanh trượt và kéo trực tiếp đối tượng. Hạn chế ở công đoạn 1 (tính toán mô hình): [ví dụ: mô phỏng không cho xem sai số tính toán – cần kiểm chứng].

**Hình 2.1:** ảnh chụp 4 ứng dụng ghép thành một hình 2×2.

### 2.2. Công nghệ và kỹ thuật vẽ 2D trên web và trên GPU *(~2,5 trang; A)*
**Viết gì:** cũng theo cùng dàn 5 ý, nhưng ý 2 đổi thành "giải quyết công đoạn nào".
- Công nghệ trên trình duyệt: Canvas 2D, SVG, WebGL thuần, PixiJS, CanvasKit (Skia biên dịch sang WebAssembly).
- Bài báo:
  - Loop & Blinn 2005 – vẽ đường cong bằng shader;
  - Green 2007 – SDF cho chữ;
  - Kilgard & Bolz 2012 – path rendering trên GPU;
  - Ganacim 2014 – vẽ vector song song;
  - Li 2016 – scanline trên GPU;
  - Horak 2018 – so sánh hiệu năng web.

**Đoạn mẫu:**
> Kilgard và Bolz (2012) đề xuất vẽ đường path vector hoàn toàn trên GPU theo hai bước "stencil, then cover": bước đầu đánh dấu vùng bên trong path vào stencil buffer, bước sau tô màu các điểm ảnh đã đánh dấu. Kỹ thuật giải quyết công đoạn 3 và 5 mà không cần chia path thành tam giác trên CPU. Tuy nhiên nó dựa trên phần mở rộng OpenGL riêng của NVIDIA (NV_path_rendering), không có trong WebGL, nên không áp dụng trực tiếp được trên trình duyệt.

### 2.3. Quá trình phát triển *(~1 trang; A)*
**Viết gì:** một trục thời gian (Hình 2.2), mỗi mốc ghi công đoạn nó cải thiện.

**Hình 2.2 – Trục thời gian (điền mốc sau khi kiểm chứng):**
| Mốc | Sự kiện | Cải thiện công đoạn |
|---|---|---|
| Trước HTML5 | Java applet, Flash (bản PhET, Falstad đời đầu) | Phải cài plugin |
| HTML5 | Canvas 2D, SVG | Vẽ 2D không cần plugin |
| 2005–2016 | Loop & Blinn → Green → Kilgard → Ganacim → Li | 3, 5: vẽ vector chất lượng cao trên GPU |
| WebGL 1.0 (đặc tả hoàn chỉnh 03/2011, Khronos) | Lập trình GPU trên trình duyệt | 3, 4, 5 |
| WebGL 2.0 (2017, dựa trên OpenGL ES 3.0; các nguồn ghi tháng 1 hoặc tháng 2) | Instancing, VAO có sẵn | 6: giảm số lần gọi vẽ |
| WebGPU | Có compute shader | Hướng phát triển (Ch.5) |

### 2.4. Bảng so sánh chung *(~1,5 trang; cả nhóm điền)*
**Viết gì:** một bảng duy nhất, cột theo công đoạn ở 1.3 (MANUAL_FAULT mục 3), có cột **khuyết điểm** (mục 8). Dưới bảng là 1 đoạn nhận xét: nhóm giải pháp nào mạnh ở công đoạn nào.

Bảng dài nên chia làm 3 phần 2.2a, 2.2b, 2.2c, nhưng **cả 3 phần dùng chung một bộ cột** (MANUAL_FAULT mục 3). Cột "Nguồn" ghi rõ thông tin lấy từ đâu:
- **[QS]:** nhóm tự mở trang ngày 09/11/2026 và đếm số thẻ `canvas`, `svg`.
- **[MN]:** đọc mã nguồn.
- **[TL]:** tài liệu hoặc bài báo.
- **[TN]:** số chạy thử của nhóm (Edge không giao diện, GPU Intel Iris Xe). **Chưa dùng được cho báo cáo**, phải đo lại trên máy thật.
- **[cần kiểm chứng]:** viết theo hiểu biết chung; phải đọc nguồn gốc trước khi đưa vào báo cáo.

Các cột ứng với công đoạn ở Bảng 1.1: **(1)** tính toán mô hình, **(3)** xử lý hình học, **(5)** tô màu điểm ảnh và khử răng cưa, **(6)** cập nhật và tương tác. Công đoạn (2) và (4) giống nhau ở mọi giải pháp nên không đưa vào bảng.

**Bảng 2.2a – Ứng dụng trực quan hóa giáo dục**
| Giải pháp | Nền tảng, cách vẽ | (1) Tính toán mô hình | (3) Xử lý hình học | (5) Tô màu, khử răng cưa | (6) Cập nhật, tương tác | Hiệu năng | Khuyết điểm | Nguồn |
|---|---|---|---|---|---|---|---|---|
| **PhET** – bài Projectile Motion (ĐH Colorado Boulder) | HTML5, thư viện Scenery: vẽ được bằng SVG, Canvas, DOM, một phần WebGL. Màn hình Intro: **0 canvas, khoảng 236 hình SVG** | Mô hình vật lý viết sẵn bằng JavaScript, người học không xem được | Hình dạng mô tả bằng thư viện kite, xuất ra phần tử SVG | Trình duyệt tự khử răng cưa cho SVG | Thanh trượt, nút bắn, kéo đối tượng; thay đổi gom lại và cập nhật trang một lần | Chưa đo | Không thấy được cách tính bên trong mô hình [cần kiểm chứng]; SVG chậm dần khi có nhiều phần tử | [QS], [TL] tài liệu Scenery |
| **Falstad** – Ripple Tank và Circuit Simulator (Paul Falstad) | Bản JavaScript chuyển từ Java applet cũ. Ripple Tank: **1 canvas WebGL** cho mặt sóng + các canvas 2D phụ. Circuit: **canvas 2D** + SVG cho giao diện | Ripple: giải phương trình sóng trên lưới; mã nguồn tên `ripplegl` cho thấy tính trên GPU [cần kiểm chứng]. Circuit: giải mạch điện mỗi bước thời gian | Ripple: mặt sóng là lưới điểm ảnh. Circuit: đường, ký hiệu linh kiện | Ripple: shader tô màu theo biên độ. Circuit: Canvas 2D | Vẽ vật cản, đặt nguồn sóng; kéo-thả linh kiện | Chưa đo | Giao diện cũ; mỗi bài một chương trình riêng, không có khung chung | [QS], [MN] github.com/pfalstad/ripplegl-ts |
| **VisuAlgo** – bài Sorting (ĐH Quốc gia Singapore) | HTML5, **SVG qua thư viện D3** (trang có `d3`; 3 thẻ svg, khoảng 30 hình) | Thuật toán chạy sẵn, ghi lại từng bước để phát lại | Mỗi phần tử mảng là một hình SVG | Trình duyệt tự khử răng cưa | Play / từng bước / tua; người học nhập mảng riêng | Chưa đo | Mảng nhỏ (giới hạn số phần tử [cần kiểm chứng]); SVG không hợp với dữ liệu lớn | [QS] |
| **algorithm-visualizer.org** | Ứng dụng React. Mảng 2 chiều vẽ bằng **bảng HTML** (`<table>`); đồ thị vẽ bằng **SVG** (`<circle>`, `<path>`) | Người học tự viết code; "tracer" ghi lại lệnh minh họa để phát lại | Phần tử trang web (ô bảng, hình SVG) | Trình duyệt tự xử lý | Sửa code rồi chạy lại; xem từng bước | Chưa đo | Mỗi phần tử là một nút trên trang, nặng khi dữ liệu lớn [cần kiểm chứng]; ngày 09/11 trang báo lỗi chứng chỉ bảo mật, không mở được | [MN] mã nguồn GitHub |
| **GeoGebra** | HTML5, viết bằng Java rồi biên dịch sang JavaScript bằng GWT. Cách vẽ cụ thể **[cần kiểm chứng]**: ngày 09/11 trình duyệt kiểm tra không mở được trang | Hệ đại số máy tính, hình học động | [cần kiểm chứng] | [cần kiểm chứng] | Kéo đỉnh, cả hình cập nhật theo; thanh trượt tham số | Chưa đo | Tập trung môn Toán; không có mô phỏng theo thời gian kiểu vật lý [cần kiểm chứng] | [TL] bài eJMT về GeoGebraWeb |

**Bảng 2.2b – Công nghệ vẽ 2D trên trình duyệt**
| Giải pháp | Nền tảng, cách vẽ | (1) Tính toán mô hình | (3) Xử lý hình học | (5) Tô màu, khử răng cưa | (6) Cập nhật, tương tác | Hiệu năng | Khuyết điểm | Nguồn |
|---|---|---|---|---|---|---|---|---|
| **Canvas 2D** (HTML5) | API vẽ tức thời: gọi lệnh là vẽ ngay, không giữ lại đối tượng; trình duyệt tự quyết có dùng GPU bên trong hay không | Người lập trình tự viết | Trình duyệt tự xử lý path (`fill`, `stroke`) | Khử răng cưa sẵn | Mỗi khung hình tự xóa và vẽ lại; sự kiện chuột chỉ có ở mức cả canvas, phải tự tính đối tượng nào bị chọn | 20.000 hình: **11,4 ms CPU/khung, 27 FPS** | Mỗi hình một lệnh gọi từ JavaScript; không viết được shader | [TN] |
| **SVG** (HTML5) | Mỗi hình là một phần tử trên trang, trình duyệt giữ và tự vẽ lại | Người lập trình tự viết | Trình duyệt xử lý | Khử răng cưa sẵn | Gắn sự kiện trực tiếp vào từng hình, tương tác dễ nhất | Horak 2018: FPS giảm từ khoảng 400 node (cả SVG, Canvas, WebGL trong thử nghiệm của họ); SVG gần bằng Canvas | Trang nặng khi có hàng nghìn phần tử | [TL] Horak 2018 |
| **WebGL thuần** (1.0 năm 2011; 2.0 năm 2017, dựa trên OpenGL ES 3.0) | Lập trình GPU trực tiếp: buffer, shader GLSL, lệnh vẽ | Người lập trình tự viết | **Tự chia hình thành tam giác** (nhóm dùng ear clipping) | Tự viết fragment shader; khử răng cưa MSAA bật khi tạo context | Tự tính đối tượng bị chọn hoặc dùng GPU picking; instancing (WebGL 2) gộp nhiều bản sao vào 1 lệnh vẽ | 20.000 hình: **0,39 ms CPU, 1 lệnh vẽ** | Phải viết nhiều code; không có sẵn cách vẽ chữ, đường cong | [TN], [TL] Khronos |
| **PixiJS v8** | Thư viện 2D trên WebGL (và WebGPU) | Người lập trình tự viết | Graphics được chia tam giác bằng thư viện earcut | Shader viết sẵn; chữ bằng Text, BitmapText | Tự gộp lệnh vẽ (batching); có hệ sự kiện kèm hit-test; ParticleContainer cho số lượng lớn | 20.000 hình (ParticleContainer): **1,24 ms CPU, 1 lệnh vẽ** | Che bớt chi tiết pipeline; Graphics phức tạp tốn công chia tam giác | [TN], [TL] tài liệu PixiJS |
| **CanvasKit** (Skia biên dịch sang WebAssembly) | Bộ vẽ của Chrome/Android chạy trong trang, vẽ qua WebGL 2 | Người lập trình tự viết | Skia xử lý path trong WebAssembly | Chất lượng như Skia: path, chữ đầy đủ | Gom lệnh WebGL lại, gửi khi kết thúc khung hình | Chưa đo | Phải tải file WebAssembly lớn [cần kiểm chứng kích thước]; không dùng shader tự viết theo cách WebGL | [TL] tài liệu Skia |

**Bảng 2.2c – Kỹ thuật vẽ 2D trên GPU (bài báo)**
| Giải pháp | Nền tảng, cách vẽ | (1) Tính toán mô hình | (3) Xử lý hình học | (5) Tô màu, khử răng cưa | (6) Cập nhật, tương tác | Hiệu năng | Khuyết điểm | Nguồn |
|---|---|---|---|---|---|---|---|---|
| **Loop & Blinn 2005** | GPU có pixel shader | – | Phủ đường cong Bézier bằng vài tam giác, không chia nhỏ đường cong | Pixel shader tính phương trình ẩn của đường cong → sắc nét ở mọi độ phóng; khử răng cưa trong shader | Hình tĩnh | Theo bài báo | Tiền xử lý đường cong bậc 3 phức tạp [cần kiểm chứng]. Làm được trên WebGL vì chỉ cần fragment shader → **đồ án chọn làm phương pháp chính** (phần bậc 2) | [TL] |
| **Green 2007** (Valve) | GPU, texture + alpha test; dùng trong game Team Fortress 2 | – | Tiền xử lý: ảnh nhị phân phân giải cao (ví dụ 4096²) → "trường khoảng cách" phân giải thấp (ví dụ 64²) lưu vào texture | Ngưỡng 0,5 xác định mép; khử răng cưa bằng đạo hàm trong shader | Hình tĩnh, phóng to được | Rất nhẹ: 1 lần đọc texture mỗi điểm ảnh | Góc nhọn bị bo tròn khi phóng lớn [cần kiểm chứng]. Làm được trên WebGL | [TL] bài SIGGRAPH 2007 |
| **Kilgard & Bolz 2012** | Phần mở rộng OpenGL riêng của NVIDIA (NV_path_rendering) | – | Không chia tam giác trên CPU: bước "stencil" đánh dấu vùng trong path | Bước "cover" tô màu vùng đã đánh dấu; hỗ trợ đủ chuẩn path của SVG, PostScript | Hình tĩnh; vẽ lại nhanh khi biến đổi | Theo bài báo | **Không có trong WebGL** | [TL] |
| **Ganacim et al. 2014** | GPU, tính toán song song (CUDA [cần kiểm chứng]) | – | Xây cấu trúc tăng tốc "shortcut tree" song song | Lấy được màu của từng điểm mẫu bất kỳ → khử răng cưa chất lượng cao, biến dạng hình được | Đồ họa vector động | Theo bài báo | Cần tính toán đa dụng trên GPU, **WebGL không có compute shader** | [TL] |
| **Li, Hou, Zhou 2016** | GPU, tính toán song song | – | Đưa phương pháp quét theo dòng (scanline) lên GPU; phần bên trong hình xử lý theo đoạn ngang | Giảm số lần tính "winding number" cho từng điểm ảnh; có khử răng cưa | Dữ liệu động, độ phân giải Ultra HD | Tác giả báo nhanh khoảng 10 lần với dữ liệu động | Như trên: **cần compute shader** | [TL] |
| **Horak et al. 2018** (poster) | Trình duyệt: SVG, Canvas, WebGL (bản WebGL dùng PixiJS) | – | – | Chữ vẽ bằng WebGL (dạng bitmap) làm tụt hiệu năng | Đo FPS khi người dùng thao tác | Đồ thị 100 → 3.200 node; FPS giảm từ khoảng 400 node; WebGL nhanh nhất | Poster 1 trang; phần cứng 2018; chỉ đo đồ thị node–cạnh | [TL] |

**Nhận xét dưới bảng (đoạn mẫu):**
> Bảng 2.2 cho thấy ba nhóm giải pháp mạnh ở ba công đoạn khác nhau. Các ứng dụng giáo dục (2.2a) đầu tư vào công đoạn (1) và (6): mô hình đúng, tương tác phong phú. Nhưng phần lớn vẽ bằng SVG hoặc phần tử trang web (PhET, VisuAlgo, algorithm-visualizer), nên phù hợp với số phần tử nhỏ. Chỉ Falstad Ripple Tank dùng WebGL. Các công nghệ trên trình duyệt (2.2b) đánh đổi giữa sự tiện lợi và hiệu năng: SVG tương tác dễ nhất nhưng nặng khi nhiều phần tử, còn WebGL thuần nhanh nhất nhưng phải tự làm mọi công đoạn. Các kỹ thuật GPU tiên tiến (2.2c) cải thiện công đoạn (3) và (5), nhưng ba trong số đó (Kilgard 2012, Ganacim 2014, Li 2016) cần tính năng không có trong WebGL. Hai kỹ thuật làm được trên WebGL là Loop & Blinn 2005 và Green 2007.

**Nguồn kiểm chứng của bảng:**
- Quan sát trực tiếp 09/11/2026:
  - phet.colorado.edu/sims/html/projectile-motion;
  - falstad.com/ripple/Ripple.html;
  - falstad.com/circuit/circuitjs.html;
  - visualgo.net/en/sorting.
- Mã nguồn algorithm-visualizer: thư mục `src/core/renderers` (Array2DRenderer, GraphRenderer) trên GitHub.
- Tài liệu Scenery của PhET (github.com/phetsims/scenery).
- Tài liệu CanvasKit (docs.skia.org).
- Hướng dẫn Graphics của PixiJS v8 (pixijs.com).
- Mốc thời gian WebGL: đặc tả của Khronos (registry.khronos.org/webgl).
- Bài báo: DOI ở bảng tài liệu bên dưới.

### 2.5. Người ta đã làm gì, đồ án làm gì *(~1 trang; A)*
**Viết gì:** trả lời đúng 2 câu hỏi cốt lõi của TUTORIAL 2.5, bằng 3 đoạn:
1. **Người ta đã làm gì:** tóm tắt Bảng 2.2 theo 3 nhóm (ứng dụng giáo dục, công nghệ web, bài báo GPU).
2. **Khuyết điểm còn lại** (MANUAL_FAULT mục 8): chỉ ra **cụ thể** ở công đoạn nào, và là vấn đề **độ chính xác** hay **độ phức tạp tính toán**.
3. **Đồ án làm gì:** chọn giải pháp nào cho Ch.3 và vì sao.

**Bảng 2.3 – Khuyết điểm còn lại và đồ án xử lý thế nào:**
| Khuyết điểm quan sát được | Công đoạn | Loại vấn đề | Đồ án xử lý |
|---|---|---|---|
| Kỹ thuật GPU tiên tiến (Kilgard 2012, Ganacim 2014, Li 2016) cần tính năng WebGL không có | 3, 5 | Không triển khai được trên web | Chọn **Loop & Blinn 2005**, chỉ cần fragment shader nên chạy được trên WebGL (Ch.3) |
| Cách vẽ đường cong thông thường trên web (chia thành đoạn thẳng) bị lộ cạnh khi phóng to | 3, 5 | **Độ chính xác** hình học | Loop & Blinn tính đường cong tại từng điểm ảnh (Bảng 4.3) |
| Canvas 2D, SVG chậm khi có nhiều đối tượng **[kiểm chứng bằng Bảng 4.4]** | 6 | Độ phức tạp tính toán | Kiến thức nền: gộp nhiều hình vào 1 lệnh vẽ bằng instancing |
| Horak 2018 đo trên phần cứng cũ, chỉ với đồ thị node–cạnh | – | Thiếu số liệu | Đo lại trên máy hiện nay, nhiều loại cảnh, có/không chữ |
| Mô phỏng giáo dục thường không hiển thị sai số tính toán **[cần kiểm chứng]** | 1 | Độ chính xác | So với nghiệm giải tích, hiển thị sai số (Bảng 4.5) |

**Bảng 2.4 – Báo cáo của nhóm khác các công trình trên ở đâu:**
| Tiêu chí | Bài báo kỹ thuật | Nghiên cứu giáo dục | Báo cáo của nhóm |
|---|---|---|---|
| Loại đóng góp | Thuật toán vẽ mới, hoặc phép đo hẹp (Horak) | Đánh giá hiệu quả học tập với người học | Khảo sát + cài lại + đo |
| Nền tảng | GPU máy tính, CUDA, phần mở rộng OpenGL riêng | Ứng dụng có sẵn | Trình duyệt: HTML5 + WebGL |
| Phạm vi | Thường vẽ tĩnh một loại đối tượng | Một ứng dụng | Tĩnh và động: vector, chữ, nhiều đối tượng, shader, tương tác |
| Đánh giá | Tốc độ, chất lượng ảnh trên phần cứng của họ | Điểm kiểm tra của người học | FPS, thời gian khung hình, số lệnh vẽ, sai số |

**Không được tự nhận:** nhanh hơn hay đẹp hơn các bài kỹ thuật (nhóm không cài lại thuật toán của họ); giúp học tốt hơn PhET (nhóm không đo hiệu quả học tập).

**Đoạn mẫu (kết chương):**
> Các ứng dụng như PhET, VisuAlgo cho thấy giá trị của mô phỏng tương tác trong dạy học. Về kỹ thuật, các giải pháp vẽ 2D tiên tiến trên GPU (Kilgard và Bolz, 2012; Ganacim và cộng sự, 2014; Li và cộng sự, 2016) đòi hỏi những tính năng chưa có trong WebGL như phần mở rộng NV_path_rendering hay compute shader. Trong các kỹ thuật đã khảo sát, phương pháp của Loop và Blinn (2005) chỉ cần fragment shader, nên cài đặt được trên WebGL. Phương pháp này lại khớp với nội dung giáo dục của đồ án: quỹ đạo ném xiên là một parabol, tức đúng một đường cong Bézier bậc 2. Vì vậy, đồ án chọn trình bày và cài đặt lại phương pháp Loop & Blinn trên WebGL để vẽ quỹ đạo, rồi kiểm chứng độ chính xác hình học và chi phí vẽ của nó so với cách chia đường cong thành đoạn thẳng đang được dùng phổ biến.

**Lý do chọn Loop & Blinn (Bảng 2.5):**
| Tiêu chí | Kilgard / Ganacim / Li | Green 2007 | **Loop & Blinn 2005 (chọn)** |
|---|---|---|---|
| Đã công bố, uy tín | ACM TOG | SIGGRAPH Course | ACM TOG (SIGGRAPH 2005) |
| Chạy được trên WebGL | Không | Có | Có, chỉ cần fragment shader |
| Khớp nội dung giáo dục của app | – | Chỉ cho chữ | Quỹ đạo ném xiên = Bézier bậc 2 |
| Cài lại vừa sức, đo được | – | Có | Có: phần bậc 2; bậc 3 để làm hướng phát triển |

### Tài liệu tham khảo của Ch.2 (DOI đã đối chiếu với Crossref; tóm tắt cần kiểm tra lại khi đọc bài gốc)
| Tài liệu | DOI | Nội dung chính | Dùng ở | Ai đọc |
|---|---|---|---|---|
| Loop & Blinn, *Resolution independent curve rendering using programmable graphics hardware*, ACM TOG 2005 | 10.1145/1073204.1073303 | Vẽ đường cong Bézier sắc nét ở mọi độ phóng bằng shader | 2.2, Ch.5 | A |
| Green, *Improved alpha-tested magnification for vector textures and special effects*, SIGGRAPH 2007 Courses | 10.1145/1281500.1281665 | Signed distance field cho chữ và hình | 2.2, Ch.3 | B |
| Kilgard & Bolz, *GPU-accelerated path rendering*, ACM TOG 2012 | 10.1145/2366145.2366191 | Vẽ path vector hoàn toàn trên GPU (stencil, then cover) | 2.2 | A |
| Ganacim et al., *Massively-parallel vector graphics*, ACM TOG 2014 | 10.1145/2661229.2661274 | Vẽ đồ họa vector song song trên GPU | 2.2 | C |
| Li, Hou, Zhou, *Efficient GPU path rendering using scanline rasterization*, ACM TOG 2016 | 10.1145/2980179.2982434 | Tô path theo dòng quét trên GPU | 2.2 | C |
| Horak, Kister, Dachselt, *Comparing rendering performance of common web technologies for large graphs*, IEEE VIS 2018 poster | (poster, không có DOI) | FPS của SVG/Canvas/WebGL theo số node | 2.2, Ch.4 | A |
| Meisters, *Polygons have ears*, American Mathematical Monthly 1975 | 10.1080/00029890.1975.11993898 | Mọi đa giác đơn đều có "tai", cơ sở của ear clipping | Ch.3 | A |
| Eder, Held, Palfrader, *Parallelized ear clipping for the triangulation and constrained Delaunay triangulation of polygons*, Computational Geometry 2018 | 10.1016/j.comgeo.2018.01.004 | Ear clipping song song, bản cải tiến gần đây | Ch.3 | A |
| Carucci, *Inside geometry instancing*, GPU Gems 2 (2005), chương 3 | (sách, không có DOI; **chưa đối chiếu**) | Kỹ thuật instancing | Ch.3 | B |
| Wieman, Adams, Perkins, *PhET: Simulations that enhance learning*, Science 2008 | 10.1126/science.1161948 | Thiết kế mô phỏng PhET | 1.2, 2.1 | C |
| Banda & Nzabahimana, *Effect of integrating PhET simulations on students' conceptual understanding in physics*, Phys. Rev. PER 2021 | 10.1103/PhysRevPhysEducRes.17.023108 | Tổng quan 31 nghiên cứu về PhET | 1.2 | C |
| Wang, Zhang, Pang, *Virtual experiments in physics education: a systematic literature review*, Res. Sci. Technol. Educ. 2025 | 10.1080/02635143.2024.2327995 | Tổng quan thí nghiệm ảo trong dạy Vật lý | 1.2, 2.1 | C |
| Hundhausen, Douglas, Stasko, *A meta-study of algorithm visualization effectiveness*, JVLC 2002 | 10.1006/jvlc.2002.0237 | Mức tham gia của người học quyết định hiệu quả | 1.2, 2.1 | B |
| Shaffer et al., *Algorithm visualization: the state of the field*, ACM TOCE 2010 | 10.1145/1821996.1821997 | Khảo sát hơn 500 công cụ minh họa thuật toán | 2.1 | B |
| OpenStax, *University Physics* vol. 1, mục 4.3 | – | Nghiệm tham chiếu ném xiên | Ch.4 | C |
| **Luận văn Thạc sĩ / Tiến sĩ (TUTORIAL 2.3)** | – | **Chưa có, cần tìm 1–2 luận văn** | 2.2 | A |

---

## Chương 3. Phương pháp *(A: 3.1–3.3, 3.6; B: 3.4; C: 3.5; khoảng 9–11 trang)*
**Phương pháp chính (TUTORIAL 2.6: phương pháp tiên tiến đã công bố): Loop & Blinn 2005**, *Resolution independent curve rendering using programmable graphics hardware*, ACM TOG 24(3), DOI 10.1145/1073204.1073303. Đồ án cài lại **phần đường cong Bézier bậc 2 và nét vẽ khử răng cưa**, áp dụng vẽ quỹ đạo ném xiên. Phần bậc 3 để làm hướng phát triển (Ch.5).

Mục 3.2 là **kiến thức nền** (pipeline WebGL) mà phương pháp chạy trên đó, không phải phương pháp chính.

**Bắt buộc trước khi viết 3.3: đọc toàn văn bài Loop & Blinn**, đối chiếu cách gán (u, v) và cách khử răng cưa bằng gradient với phần cài đặt trong `js/webgl/loop-blinn.js`. Chỗ nào khác bài báo thì ghi rõ trong báo cáo.

### 3.1. Sơ đồ chung *(~1 trang)*
**Hình 3.1:** sơ đồ: Dữ liệu bài học → Mô hình (JavaScript) → Bộ đệm đỉnh (GPU) → Vertex shader → Rasterization → Fragment shader → Khung hình; vòng lặp `requestAnimationFrame` và sự kiện chuột quay lại "Mô hình". Ghi tên công đoạn 1–6 của Bảng 1.1 lên từng khối; **đánh dấu khối nào dùng Loop & Blinn** (công đoạn 3 và 5 khi vẽ đường cong).

### 3.2. Kiến thức nền: pipeline WebGL *(~3 trang; A)*
**Viết gì:** GPU vẽ nhanh vì xử lý song song hàng nghìn đỉnh và điểm ảnh. Điểm nghẽn thường nằm ở **CPU gửi lệnh vẽ**. GPU chỉ vẽ được tam giác, nên mọi hình phải qua bước chia tam giác. Minh họa bằng bài *Pipeline WebGL từng bước*.

**Đoạn mẫu:**
> Mỗi lệnh vẽ mà JavaScript gửi tới GPU đều tốn chi phí cố định ở phía CPU: kiểm tra trạng thái, chuẩn bị dữ liệu, chuyển lệnh qua trình duyệt xuống trình điều khiển đồ họa. Khi vẽ 10.000 hình bằng 10.000 lệnh, chi phí này lặp lại 10.000 lần. Instancing cho phép gửi một lệnh duy nhất kèm một bộ đệm chứa vị trí của cả 10.000 bản sao; GPU tự lặp lại hình cho từng bản sao.

| Mục | Viết gì | Code trích | Hình |
|---|---|---|---|
| 3.2.1 Chia đa giác thành tam giác | Định lý "mọi đa giác đơn có tai" (Meisters 1975); giải thuật cắt tai, độ phức tạp O(n²) | `js/webgl/triangulate.js` | 3.2: ngôi sao lõm 14 đỉnh → 12 tam giác |
| 3.2.2 Ma trận biến đổi 2D | Tọa độ thuần nhất 3×3; ma trận chiếu từ điểm ảnh sang clip space; ghép dời–xoay–co giãn | `js/webgl/matrix.js` (`ortho2D`, `multiply`) | 3.3: đa giác trước/sau khi xoay 45° |
| 3.2.3 Shader | Vertex shader nhân ma trận; fragment shader tô màu theo từng điểm ảnh | GLSL trong `js/tech/pipeline.js` | 3.4: đa giác tô chuyển màu |
| 3.2.4 Instancing | `vertexAttribDivisor`, `drawArraysInstanced`; so với vòng lặp `drawArrays` | `js/webgl/instanced-rects.js` | 3.5: 100 bản sao, 1 lệnh vẽ |
| 3.2.5 Chọn đối tượng | Hit-test bằng tính toán vs GPU picking (framebuffer + `readPixels`) | `js/core/hit-test.js`, `js/webgl/picking.js` | 3.6: bản sao #53 được chọn |

**Bảng 3.2 – So sánh 2 cách chọn đối tượng:**
| | Tính toán (hit-test) | GPU picking |
|---|---|---|
| Ý tưởng | Suy chỉ số từ tọa độ chuột (cột i = ⌊(x − lề) / độ rộng cột⌋) | Vẽ lại cảnh bằng "màu mã" vào framebuffer ẩn, đọc màu tại chuột |
| Độ phức tạp | O(1) | Một lượt vẽ thêm + chờ GPU trả 1 điểm ảnh |
| Dùng được khi | Phần tử xếp đều (cột, lưới) | Mọi hình dạng, kể cả hình lõm, xoay, hàng nghìn bản sao |
| Dùng ở bài | Sắp xếp, A* | Pipeline, đồ thị |

### 3.3. Phương pháp chính: vẽ đường cong độc lập độ phân giải (Loop & Blinn 2005) *(~3 trang; A)*
Trình bày đúng thứ tự TUTORIAL 2.6: **nguyên lý → phương pháp → giải thuật → minh họa**.

**3.3.1. Nguyên lý.**
- Cách thông thường: chia đường cong thành N đoạn thẳng rồi chia tiếp thành tam giác. Đường cong bị xấp xỉ **trước** khi lên GPU, nên phóng to là lộ cạnh, muốn mịn phải tăng N (thêm đỉnh).
- Loop & Blinn **không xấp xỉ**: biểu diễn đường cong dưới dạng **phương trình ẩn** f(u, v) = 0, để GPU kiểm tra **từng điểm ảnh** nằm phía nào của đường cong. Độ mịn vì vậy không phụ thuộc mức phóng to.

**3.3.2. Phương pháp.**
- Bézier bậc 2: B(t) = (1 − t)² P0 + 2t(1 − t) P1 + t² P2.
- Gán tọa độ (u, v) cho 3 điểm điều khiển: P0 → (0, 0), P1 → (½, 0), P2 → (1, 1). Vì (u, v) là hàm affine của (x, y), trên đường cong u = t, v = t², nên **f(u, v) = u² − v = 0**; một phía của đường cong có f < 0, phía kia f > 0.
- Áp dụng cho quỹ đạo ném xiên: P0 = điểm ném, P2 = điểm rơi (R, 0), P1 = P0 + v(0)·T/2 = (R/2, 2H). Có test chứng minh Bézier này trùng khít quỹ đạo.
- **Nét vẽ khử răng cưa:** khoảng cách gần đúng từ điểm ảnh tới đường cong d ≈ f / |∇f|, trong đó ∇f tính bằng đạo hàm màn hình `dFdx`, `dFdy`. Độ phủ = clamp(w/2 + 0,5 − |d|, 0, 1).

**Hình 3.7:** tam giác P0 P1 P2 của một quỹ đạo, ghi (u, v) ở 3 đỉnh, vùng f < 0 và f > 0 tô hai màu.

**3.3.3. Giải thuật.**
| Bước | CPU (JavaScript) | GPU |
|---|---|---|
| 1 | Tính P0, P1, P2 từ tham số ném (`parabolaToBezier`) | |
| 2 | Tính phép biến đổi affine (x, y) → (u, v) (`uvTransform`); 3 điểm thẳng hàng thì chuyển sang vẽ đoạn thẳng | |
| 3 | Lấy hộp bao 3 điểm + lề bằng nét vẽ → 4 góc tứ giác, mỗi góc kèm (u, v) | |
| 4 | Nạp 4 đỉnh vào buffer, gọi 1 lệnh `drawArrays(TRIANGLE_STRIP)` | Vertex shader: đổi vị trí sang clip space, chuyển (u, v) xuống |
| 5 | | Rasterization nội suy (u, v) cho từng điểm ảnh |
| 6 | | Fragment shader: f = u² − v; d = f / \|∇f\|; độ phủ theo d; chỉ giữ 0 ≤ u ≤ 1 |

Giả mã fragment shader (trích từ `js/webgl/loop-blinn.js`):
```
f        = u*u - v
gradient = 2u·(dFdx(u), dFdy(u)) − (dFdx(v), dFdy(v))
d        = f / |gradient|                 // khoảng cách gần đúng, đơn vị điểm ảnh
alpha    = clamp(w/2 + 0.5 − |d|, 0, 1)   // nét rộng w, mép mờ 1 điểm ảnh
```
Độ phức tạp: CPU O(1), luôn 4 đỉnh. GPU O(số điểm ảnh trong tứ giác). Cách chia đoạn thẳng: CPU O(N), 6N đỉnh.

**3.3.4. Minh họa.** **Hình 3.8**: bài Ném xiên ở mức phóng to 16× quanh đỉnh, hai cách vẽ đặt cạnh nhau (chọn ở ô "Cách vẽ"). **Hình 3.9**: ba ảnh cắt từ trang thử nghiệm `benchmark/curve.html` (Loop & Blinn, 120 đoạn, 30 đoạn).

### 3.4. Mô hình thuật toán: phát lại từng bước *(~1,5 trang; B)*
**Viết gì:** thuật toán viết bằng generator, mỗi bước "so sánh" hay "đổi chỗ" phát ra một lệnh; phần vẽ nhận lệnh và tô màu. Mảng nhỏ (khoảng ≤ 2.000 phần tử, **[cần số đo để chốt]**) thì ghi lại để tua; mảng lớn thì chạy trực tiếp. Có giả mã Bubble Sort, Quick Sort, A*.

### 3.5. Mô hình vật lý và shader sóng *(~1,5 trang; C)*
**Viết gì:**
- Phương trình ném xiên (OpenStax 4.3).
- Tích phân số Euler / Verlet / RK4: công thức một bước, bậc chính xác.
- Công thức giao thoa hai nguồn và cách viết nó trong fragment shader (mỗi điểm ảnh tự tính hiệu đường đi).

### 3.6. Tiến trình hoạt động *(~1 trang; A – MANUAL_FAULT mục 5)*
**Viết gì:** đi qua **một khung hình cụ thể** của bài ném xiên, có số thật.

**Đoạn mẫu:**
> Xét v₀ = 20 m/s, θ = 45°, g = 9,8 m/s².
> (1) Mô hình tính T = 2,89 s, R = 40,82 m, H = 10,20 m.
> (2) Quỹ đạo được biểu diễn bằng Bézier bậc 2 với P0 = (0; 0), P1 = (20,41; 20,41), P2 = (40,82; 0) m.
> (3) Thay vì chia thành đoạn thẳng, 3 điểm này được bao bằng một tứ giác 4 đỉnh, mỗi đỉnh mang (u, v).
> (4) Ma trận chiếu đổi tọa độ mét sang điểm ảnh, ví dụ với khung rộng 50 m trên 690 điểm ảnh thì P1 → **[tính lại theo kích thước thật]**.
> (5) Fragment shader tính u² − v tại từng điểm ảnh trong tứ giác và tô màu những điểm ảnh cách đường cong dưới 1,25 điểm ảnh.
> (6) Khi người học đổi v₀ hoặc kéo thanh phóng to, chỉ 4 đỉnh được tính lại; ở khung hình kế tiếp, vật dịch thêm khoảng 16,7 ms.

Kèm **Hình 3.2–3.6**: 5 ảnh chụp các bước của bài *Pipeline WebGL từng bước* (kiến thức nền).

### Bảng 3.3 – Kiến thức HTML5 / WebGL ↔ code nhóm tự viết (để trích code; phần nào PixiJS làm thì ghi rõ)
| Kiến thức | File (trong `Source code/`) | Ai viết |
|---|---|---|
| Thẻ `<canvas>`, bố cục trang | `index.html`, `css/style.css` | Nhóm |
| Control HTML5 (`range`, `button`, `checkbox`, `select`) | `js/core/controls.js` | Nhóm |
| Vòng lặp `requestAnimationFrame` | `benchmark/benchmark.js` (gọi trực tiếp); app chính qua ticker của PixiJS | Nhóm / PixiJS |
| Sự kiện bàn phím (phím tắt) | `js/core/playback.js` | Nhóm |
| Sự kiện chuột/cảm ứng (kéo-thả) | `js/core/drag.js`, `js/cs/sorting.js` | Nhóm, trên hệ sự kiện của PixiJS |
| Canvas 2D API | `benchmark/renderers.js`, `js/core/export.js` | Nhóm |
| Xuất file: `toBlob`, `URL.createObjectURL`, `<a download>` | `js/core/export.js`; CSV ở `benchmark/benchmark.js` | Nhóm |
| Fullscreen API, ResizeObserver | `js/main.js`, `js/core/stage.js` | Nhóm |
| `performance.now()` | `benchmark/benchmark.js`, `js/tech/pipeline.js` | Nhóm |
| ES modules | Toàn bộ `js/` | Nhóm |
| Context WebGL 2, biên dịch shader, liên kết program | `js/webgl/gl-utils.js` | Nhóm |
| Vertex buffer, index buffer, VAO, attribute, uniform, `vertexAttribDivisor` | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js` | Nhóm |
| Vertex / fragment shader (GLSL ES 3.0) | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js`, `js/physics/waves.js` | Nhóm |
| Ma trận chiếu, biến đổi 2D | `js/webgl/matrix.js` | Nhóm |
| **Loop & Blinn: đường cong bằng phương trình ẩn, `dFdx`/`dFdy`, khử răng cưa** | `js/webgl/loop-blinn.js`, `js/webgl/curve-math.js` | Nhóm |
| Mốc so sánh: nét vẽ từ N đoạn thẳng | `js/webgl/polyline.js` | Nhóm |
| Scissor test (cắt theo vùng vẽ) | `js/physics/projectile.js` | Nhóm |
| Chia đa giác thành tam giác | `js/webgl/triangulate.js` | Nhóm |
| `drawArrays`, `drawElements`, `drawArraysInstanced`, `drawElementsInstanced` | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js` | Nhóm |
| Framebuffer, texture, `readPixels` (GPU picking) | `js/webgl/picking.js` | Nhóm |
| Chọn đối tượng bằng tính toán | `js/core/hit-test.js` | Nhóm |
| Đếm lệnh vẽ, `devicePixelRatio` | `js/webgl/gl-utils.js` | Nhóm |
| Gộp lệnh vẽ, ParticleContainer, Text/BitmapText, Filter | Các bài dùng PixiJS | PixiJS (nhóm giải thích cơ chế) |

---

## Chương 4. Cài đặt và thử nghiệm *(cả nhóm; A tổng hợp; khoảng 8–10 trang)*

### 4.1. Môi trường *(~0,5 trang)*
**Bảng 4.1:**
- Phần cứng: CPU, RAM, GPU (các trang thử nghiệm tự ghi tên GPU). Lưu ý máy có 2 GPU (tích hợp + rời) thì trình duyệt có thể chọn GPU khác nhau giữa các lần chạy, nên phải ghi GPU của từng lần đo.
- Hệ điều hành, trình duyệt + phiên bản, độ phân giải màn hình, devicePixelRatio.
- Phần mềm: HTML5, JavaScript, WebGL 2, PixiJS 8.22.0.

Đo trên **ít nhất 2 máy** nếu được.

### 4.2. Các bài minh họa *(~1,5 trang)*
**Bảng 4.2:**
| Bài | Kiến thức | Tác vụ 2D minh họa | Tương tác trực tiếp | Người làm |
|---|---|---|---|---|
| **Ném xiên** | Vật lý | **Phương pháp chính: quỹ đạo vẽ bằng Loop & Blinn**; animation theo thời gian | Đổi cách vẽ, phóng to quanh đỉnh; kéo mũi tên v₀, bắn trúng bia (C) | A (quỹ đạo), C (tương tác) |
| Con lắc/lò xo | Vật lý | Cập nhật trạng thái theo thời gian | Kéo quả nặng rồi thả | C |
| Giao thoa sóng | Vật lý | Tính màu từng điểm ảnh bằng fragment shader | Kéo 2 nguồn | C |
| Sắp xếp | Tin học | Nhiều đối tượng bằng WebGL thuần (instancing) | Kéo-thả đổi chỗ, vẽ dữ liệu bằng chuột | B (phần vẽ + tương tác đã có) |
| BFS/DFS/Dijkstra | Tin học | Tương tác chọn, kéo-thả, vẽ chữ | Kéo node, thêm node/cạnh | A |
| A* | Tin học | Lưới nhiều ô | Vẽ tường, kéo điểm đầu/đích | B |
| Pipeline WebGL | Kiến thức nền | Toàn bộ pipeline WebGL thuần | Kéo đỉnh, GPU picking | A (đã xong) |

Mỗi bài 1 ảnh chụp kèm 2–3 câu nói rõ **tác vụ 2D nào** được minh họa, không mô tả nút bấm.

### 4.3. Bộ thử nghiệm *(~1 trang – MANUAL_FAULT mục 7)*
Không có tập dữ liệu chuẩn cho bài toán này (TUTORIAL 2.4), nên nhóm tự xây bộ kịch bản và ghi rõ tiêu chí. Dữ liệu lưu ở thư mục Data.

| Thử nghiệm | Vai trò | Mục đích | Bộ kịch bản (số mẫu) | Tiêu chí, thách thức | Đáp án đúng / mốc so sánh |
|---|---|---|---|---|---|
| **(f) Loop & Blinn** | **Chính** – kiểm chứng phương pháp Ch.3 | Loop & Blinn có giữ đường cong đúng và mịn khi phóng to như bài báo khẳng định không; tốn bao nhiêu | 1 quỹ đạo (v₀ = 20 m/s, θ = 45°) × 3 cách vẽ (Loop & Blinn, 120 đoạn, 30 đoạn) × 4 mức phóng to (1×, 4×, 16×, 64×) = 12 lần đo; nét 2 px; khung 960 × 540, pixel ratio 1 | Phóng to lớn là trường hợp khó cho cách chia đoạn thẳng | Phương trình parabol (đáp án đúng); cách chia đoạn thẳng (mốc) |
| (a) Hiệu năng vẽ | Nền | Pipeline WebGL chịu được bao nhiêu đối tượng | 3 cách vẽ × 5 mức (1k–100k) × có/không chữ = 30 lần đo × 3 s | Thang log để thấy điểm gãy (mượn từ Horak 2018); chữ là trường hợp khó | Canvas 2D, PixiJS |
| (e) Instancing | Nền | 1 lệnh vẽ so với N lệnh | 1, 10, 100, 1.000, 10.000 bản sao | Nhiều bản sao lộ chi phí mỗi lệnh | Vòng lặp `drawElements` |
| (c) CPU so với GPU | Phụ | GPU nhanh hơn bao nhiêu khi tính theo điểm ảnh | Sóng ở 4 độ phân giải (480×270 → 1920×1080) | Số điểm ảnh tăng theo bình phương | Bản CPU; hai bản phải ra cùng ảnh |
| (b) Độ chính xác mô phỏng | Phụ | Integrator nào sai ít nhất | Ném xiên, lò xo: 3 integrator × 4 dt | dt lớn là trường hợp khó | Nghiệm giải tích |
| (d) Thuật toán | Phụ, bỏ nếu thiếu thời gian | A* tiết kiệm bao nhiêu | Lưới 20², 50², 100² × tường 0/20/35 % | Tường dày, đường vòng | Độ dài đường đi của Dijkstra |

### 4.4. Kết quả *(~4 trang)*
**Độ đo** (MANUAL_FAULT mục 6):
- **Độ chính xác:** sai số hình học (px), độ phủ đường cong (%), sai số vị trí, độ trôi năng lượng.
- **Độ phức tạp, hiệu năng:** số đỉnh gửi lên GPU, thời gian vẽ, FPS, thời gian CPU, số lệnh vẽ.

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

**Hình 4.1:** biểu đồ đường, trục x = mức phóng to (thang log), trục y = sai số lớn nhất (px), 3 đường cho 3 cách vẽ. **Hình 4.2:** ba ảnh cắt ở 16× từ trang thử nghiệm.

**Bảng 4.4 – Thử nghiệm (a): hiệu năng vẽ** (số chạy thử, GPU Intel Iris Xe, **[thay bằng số đo thật]**):
| Cách vẽ | Số hình | Chữ | FPS | Khung hình TB (ms) | CPU vẽ TB (ms) | Lệnh vẽ |
|---|---|---|---|---|---|---|
| Canvas 2D | 20.000 | không | 27 | 37,8 | 11,36 | – |
| PixiJS | 20.000 | không | 60 | 16,7 | 1,24 | 1 |
| WebGL thuần | 20.000 | không | 61 | 16,7 | 0,39 | 1 |

**Bảng 4.5 – Thử nghiệm (e): instancing** (số chạy thử, **[thay bằng số đo thật]**): 10.000 bản sao: instancing 1 lệnh vẽ, CPU 0,10 ms; vòng lặp 10.000 lệnh vẽ, CPU 1,83 ms.

**Bảng 4.6 – (c) CPU so với GPU** (C điền): độ phân giải, CPU (ms/khung), GPU (ms/khung), nhanh gấp.

**Bảng 4.7 – (b) Độ chính xác mô phỏng** (C điền): integrator, dt, sai số vị trí lớn nhất (m), độ trôi năng lượng (%).

**Bảng 4.8 – (d) Dijkstra so với A\*** (B điền, nếu làm): bản đồ, ô duyệt Dijkstra, ô duyệt A*, độ dài đường đi.

### 4.5. Bàn luận *(~1,5 trang)*
**Viết gì:** giải thích **vì sao** kết quả như vậy, dựa vào Ch.3. Thử nghiệm (f) bàn trước và kỹ nhất. So hướng với Horak 2018 cho (a), không so trực tiếp con số.

**Đoạn mẫu cho (f)** (dựa trên số chạy thử, phải viết lại theo số thật):
> Ở mức phóng to 1×, cả ba cách vẽ đều gần như không sai số, vì mỗi đoạn thẳng ngắn hơn một điểm ảnh. Khi phóng to 64× quanh đỉnh, đường gấp khúc 120 đoạn lệch tới 0,65 điểm ảnh và chỉ phủ 83 % đường cong thật; đường 30 đoạn lệch tới 11 điểm ảnh. Loop & Blinn vẫn giữ sai số dưới 0,01 điểm ảnh ở mọi mức phóng to mà chỉ dùng 4 đỉnh. Nguyên nhân: đường gấp khúc xấp xỉ đường cong trên CPU **trước** khi phóng to, còn Loop & Blinn tính lại phương trình u² − v tại **từng điểm ảnh** sau khi phóng to (Mục 3.3.1). Kết quả này khớp với khẳng định "độc lập độ phân giải" của Loop và Blinn (2005) khi phương pháp được cài đặt trên WebGL.

**Đoạn mẫu cho (a):**
> Ở 20.000 hình, Canvas 2D cần khoảng 11 ms thời gian CPU mỗi khung hình, vì JavaScript phải gọi `fillRect` 20.000 lần. WebGL thuần chỉ cần 0,39 ms, vì toàn bộ vị trí được nạp vào một bộ đệm và vẽ bằng một lệnh `drawArraysInstanced` (Mục 3.2.4). Hướng kết quả tương tự Horak và cộng sự (2018), nơi WebGL nhanh hơn Canvas và SVG, dù hai thử nghiệm khác phần cứng và loại cảnh.

**Không áp dụng:** MANUAL_FAULT mục 4 (giai đoạn huấn luyện, loss function, đánh nhãn) dành cho đề tài học máy. Báo cáo ghi một câu: đồ án không có giai đoạn huấn luyện; "groundtruth" tương ứng là phương trình parabol, nghiệm giải tích và đường đi của Dijkstra.

---

## Chương 5. Kết luận và hướng phát triển *(A, khoảng 1–2 trang)*
**Viết gì:**
1. **Kết quả đạt được:** nhắc lại từng đóng góp ở Bảng 1.2, mỗi cái kèm **một con số** chính từ Ch.4. Đóng góp về Loop & Blinn nêu đầu tiên.
2. **Hạn chế:**
   - mới cài Bézier bậc 2;
   - chưa đánh giá với người học thật;
   - mới có 2 môn;
   - WebGL thuần chưa vẽ chữ;
   - đo trên ít loại máy.
3. **Hướng phát triển:**
   - Loop & Blinn cho **Bézier bậc 3** (phân loại đường cong, xử lý vòng xoắn như bài báo);
   - vẽ chữ bằng distance field (Green 2007);
   - thử nghiệm với người học (bài kiểm tra trước/sau);
   - thêm môn Toán;
   - chuyển sang WebGPU để dùng compute shader, mở đường cho Ganacim 2014, Li 2016.

**Đoạn mẫu:**
> Báo cáo đã khảo sát 16 giải pháp vẽ 2D trên web và ứng dụng trực quan hóa giáo dục, chọn trình bày và cài đặt lại phương pháp vẽ đường cong độc lập độ phân giải của Loop và Blinn (2005) trên WebGL, áp dụng vẽ quỹ đạo ném xiên trong ứng dụng EduViz2D. Ở mức phóng to 64×, phương pháp giữ sai số dưới [x] điểm ảnh với 4 đỉnh, trong khi đường gấp khúc 120 đoạn lệch [y] điểm ảnh với 720 đỉnh. Hạn chế là mới cài đặt cho đường cong bậc 2 và chưa đánh giá hiệu quả học tập với người học thật; đây là các hướng phát triển tiếp theo.

---

## Đối chiếu nhanh với MANUAL_FAULT
| Mục | Xử lý ở đâu |
|---|---|
| 1. Framework chung | 1.3, Bảng 1.1, Hình 1.1 |
| 2. Ẩn số | Bảng 1.1, cột "Ẩn số cần tìm" |
| 3. Related works cùng tiêu chí | 2.1–2.2 cùng dàn 5 ý; Bảng 2.2 |
| 4. Giai đoạn huấn luyện | Không áp dụng, ghi rõ trong 4.5 |
| 5. Tiến trình hoạt động | 3.6 (đi qua shader Loop & Blinn) |
| 6. Độ đo | 4.4 |
| 7. Tập dữ liệu | 4.3 |
| 8. Khuyết điểm related works | Bảng 2.2 cột "Khuyết điểm", Bảng 2.3 |
