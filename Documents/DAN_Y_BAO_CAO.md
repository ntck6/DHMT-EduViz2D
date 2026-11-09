# Dàn ý báo cáo – Đồ án 1.2: HTML5 + WebGL cho các tác vụ 2D (tĩnh và động)

Theo `FORMAT_PRESENTATION.md` (5 chương) và các lỗi cần tránh trong `MANUAL_FAULT.md`.

**Nguyên tắc chung:** báo cáo là sản phẩm chính; web app EduViz2D chỉ để minh họa Ch.3–4. Ch.1–3 viết về **kỹ thuật vẽ 2D trên web**, không viết về giáo dục. Lĩnh vực giáo dục chỉ xuất hiện ở phần động lực (1.2) và ở các demo của Ch.4.

## Báo cáo này thuộc kiểu gì?
Thầy cần **báo cáo khảo sát và cài đặt lại**: giống một luận văn thu nhỏ, nhưng không cần phát minh gì mới (TUTORIAL: "đọc, hiểu, cài đặt lại; chưa đòi hỏi đề xuất giải pháp mới"). Mạch của cả báo cáo đi theo đúng các bước TUTORIAL 2.1–2.7:

> Bài toán là gì → người ta đã giải thế nào (khảo sát) → chọn một cách tiên tiến, giải thích nó hoạt động ra sao → cài lại, đo đạc, nhận xét.

Đây **không phải** báo cáo mô tả phần mềm (phân tích yêu cầu, use case, giới thiệu từng màn hình, hướng dẫn sử dụng).

| | Báo cáo khảo sát và cài đặt lại (**thầy cần**) | Báo cáo mô tả phần mềm (**không phải**) |
|---|---|---|
| Câu hỏi chính | Vẽ 2D tĩnh và động bằng HTML5 + WebGL thế nào? Cách nào tốt hơn, vì sao? | App của nhóm có những chức năng gì? |
| Nội dung chính | Bài toán, các giải pháp đã có, nguyên lý, giải thuật, số liệu đo | Yêu cầu, sơ đồ use case, giao diện, hướng dẫn dùng |
| Tài liệu trích dẫn | Bài báo hội nghị/tạp chí, luận văn, tài liệu kỹ thuật | Hầu như không cần |
| Vai trò của app | Bằng chứng cho Ch.3 và nguồn số liệu cho Ch.4 | Là toàn bộ nội dung báo cáo |
| Ví dụ câu viết | "Fragment shader tính màu mỗi điểm ảnh theo biên độ tổng hợp của hai nguồn sóng, nên mọi điểm ảnh được xử lý song song trên GPU." | "Người dùng bấm nút Play để bắt đầu mô phỏng." |
| Kết quả | Bảng và biểu đồ FPS, sai số, kèm giải thích nguyên nhân | Ảnh chụp các màn hình |

Ảnh chụp app vẫn được dùng, nhưng chỉ để minh họa một kỹ thuật hay một kết quả đo, không để giới thiệu tính năng.

## Chương 1. Giới thiệu
**1.1. Bối cảnh chung** – Đồ họa 2D trên web: Canvas 2D, SVG, WebGL. GPU có mặt trên hầu hết máy tính và điện thoại. *(A)*

**1.2. Động lực nghiên cứu** *(A)*
- Ý nghĩa khoa học: vẽ 2D hiệu quả trên GPU (tam giác hóa, batching, khử răng cưa) là bài toán đồ họa có nhiều lời giải.
- Ý nghĩa thực tiễn: các ứng dụng 2D cần nhiều đối tượng hoặc chuyển động mượt. Ví dụ minh họa: ứng dụng hỗ trợ giáo dục (trích Wieman 2008, Hundhausen 2002).

**1.3. Phát biểu bài toán** *(A)*
- **Input:** mô tả cảnh 2D gồm hình, đường, chữ, ảnh, tham số; với cảnh động có thêm thời gian và thao tác người dùng.
- **Output:** khung hình hiển thị trên canvas đủ mượt (cảnh động); ảnh xuất ra (cảnh tĩnh).
- **Framework chung** (chỉ nêu công đoạn, chưa gắn phương pháp – MANUAL_FAULT mục 1):

| # | Công đoạn | Ẩn số cần tìm (MANUAL_FAULT mục 2) |
|---|---|---|
| 1 | Mô tả cảnh | Cách biểu diễn đối tượng và thứ tự vẽ |
| 2 | Xử lý hình học | Cách chia hình/đường cong thành tam giác (hoặc cách khác) |
| 3 | Biến đổi tọa độ | Ma trận đưa tọa độ thế giới về tọa độ màn hình |
| 4 | Tô màu điểm ảnh | Màu từng điểm ảnh; cách khử răng cưa |
| 5 | Cập nhật theo thời gian/tương tác | Trạng thái cảnh tại thời điểm t; đối tượng nào bị chọn |
| 6 | Xuất kết quả | Số lần gọi vẽ (draw call) mỗi khung hình; ảnh tĩnh xuất ra |

**1.4. Đóng góp** – Khảo sát các giải pháp vẽ 2D trên web; trình bày lại pipeline vẽ 2D trên WebGL; cài đặt minh họa và đo hiệu năng, độ chính xác. *(A)*

## Chương 2. Các công trình liên quan *(A viết khung + gộp; B, C điền phần mình)*
Mọi giải pháp điền vào **cùng một bảng**, cột theo các công đoạn ở 1.3 (MANUAL_FAULT mục 3), thêm cột **khuyết điểm** (mục 8):

| Giải pháp | Năm | Xử lý hình học | Biến đổi | Tô màu / khử răng cưa | Tĩnh / động | Hiệu năng (số đối tượng) | Khuyết điểm |
|---|---|---|---|---|---|---|---|
| Canvas 2D | | | | | | | |
| SVG | | | | | | | |
| WebGL thuần | | | | | | | |
| PixiJS (trên WebGL) | | | | | | | |
| CanvasKit / Skia (WASM) | | | | | | | |
| Loop & Blinn 2005 | | | | | | | |
| Green 2007 | | | | | | | |
| Kilgard & Bolz 2012 | | | | | | | |
| Ganacim et al. 2014 | | | | | | | |
| Li et al. 2016 | | | | | | | |
| Horak et al. 2018 (so sánh) | | | | | | | |

**Tài liệu kỹ thuật** (DOI đã đối chiếu với Crossref ngày 09/11):
| Tài liệu | DOI | Nội dung chính | Ai đọc |
|---|---|---|---|
| Loop & Blinn, *Resolution independent curve rendering using programmable graphics hardware*, ACM TOG 2005 (SIGGRAPH) | 10.1145/1073204.1073303 | Vẽ đường cong Bézier sắc nét ở mọi độ phóng bằng shader | A |
| Green, *Improved alpha-tested magnification for vector textures and special effects*, SIGGRAPH 2007 Courses | 10.1145/1281500.1281665 | Signed distance field cho chữ và hình | B |
| Kilgard & Bolz, *GPU-accelerated path rendering*, ACM TOG 2012 | 10.1145/2366145.2366191 | Vẽ path vector hoàn toàn trên GPU (stencil, then cover) | A |
| Ganacim et al., *Massively-parallel vector graphics*, ACM TOG 2014 | 10.1145/2661229.2661274 | Vẽ đồ họa vector song song trên GPU | C |
| Li, Hou, Zhou, *Efficient GPU path rendering using scanline rasterization*, ACM TOG 2016 | 10.1145/2980179.2982434 | Rasterize path theo scanline trên GPU | C |
| Horak, Kister, Dachselt, *Comparing rendering performance of common web technologies for large graphs*, IEEE VIS 2018 poster | (poster, không có DOI) | FPS của SVG/Canvas/WebGL theo số node | A |

Kết thúc chương bằng 2 câu trả lời: **người ta đã làm gì** và **nhóm muốn làm gì** (chọn giải pháp nào để trình bày ở Ch.3, vì sao).

## Chương 3. Phương pháp *(A: pipeline + đồ thị; B: batching/instancing; C: shader + mô phỏng)*
Giải pháp chọn: **pipeline vẽ 2D trên WebGL theo kiểu batching/instancing (cách PixiJS làm) + shader cho hiệu ứng theo điểm ảnh.** Trình bày theo thứ tự:
1. **Sơ đồ chung:** HTML5 (canvas, `requestAnimationFrame`, sự kiện chuột) → WebGL (buffer → vertex shader → rasterization → fragment shader) → khung hình.
2. **Nguyên lý:** vì sao GPU nhanh hơn cho 2D: xử lý song song, giảm số lần gọi vẽ.
3. **Phương pháp và giải thuật:** tam giác hóa đa giác; ma trận chiếu 2D; batching và instancing; khử răng cưa / SDF; vòng lặp animation với bước thời gian; hit-test cho tương tác.
4. **Minh họa:** đoạn code ngắn + hình chụp từ app.
5. **Tiến trình hoạt động** (MANUAL_FAULT mục 5): đi qua một khung hình cụ thể từ dữ liệu đầu vào đến điểm ảnh.

## Chương 4. Cài đặt và thử nghiệm *(cả nhóm; A tổng hợp)*
**4.1. Môi trường:** CPU, GPU, trình duyệt + phiên bản, độ phân giải; HTML5 + JavaScript + PixiJS 8.22.0.

**4.2. Demo ứng với từng tác vụ 2D**
| Demo | Tác vụ 2D minh họa | Tĩnh / động | Người làm |
|---|---|---|---|
| Ném xiên | Vẽ vector (trục, đường cong, chữ) + animation theo thời gian | Cả hai | C (bản đầu đã có) |
| Sắp xếp | Vẽ rất nhiều đối tượng: batching/instancing | Động | B |
| BFS/DFS/Dijkstra | Tương tác chọn, kéo-thả; vẽ chữ hiệu quả | Cả hai | A |
| A* | Lưới nhiều ô, cập nhật từng ô | Động | B |
| Con lắc/lò xo | Cập nhật trạng thái theo thời gian | Động | C |
| Giao thoa sóng | Tính màu từng điểm ảnh bằng fragment shader | Động | C |
| Xuất PNG | Xuất ảnh tĩnh từ canvas | Tĩnh | A |
| Benchmark | So sánh Canvas2D / PixiJS / WebGL thuần | – | A |

**4.3. Bộ cảnh thử nghiệm** (thay cho "tập dữ liệu", MANUAL_FAULT mục 7; lưu vào thư mục Data)
- Số đối tượng tăng dần: 1k, 5k, 10k, 50k, 100k.
- Có / không có chữ (Horak 2018 cho thấy chữ trong WebGL làm tụt hiệu năng).
- 2–3 kích thước màn hình.
- Thách thức của bộ cảnh: nhiều đối tượng, nhiều chữ, cập nhật mỗi khung hình.

**4.4. Độ đo** (MANUAL_FAULT mục 6)
| Loại | Độ đo |
|---|---|
| Hiệu năng | FPS, thời gian mỗi khung hình (ms), số draw call |
| Độ chính xác | Sai số so với nghiệm giải tích (ném xiên, con lắc); khác biệt điểm ảnh so với ảnh tham chiếu vẽ bằng Canvas 2D |
| Độ phức tạp | Độ phức tạp theo số đối tượng n của từng cách vẽ |

**4.5. Kết quả và bàn luận:** bảng + biểu đồ (thang log theo số đối tượng); giải thích vì sao kết quả như vậy dựa vào Ch.3.

**Không áp dụng:** MANUAL_FAULT mục 4 (giai đoạn huấn luyện, loss function, đánh nhãn) dành cho đề tài học máy. Báo cáo ghi rõ một câu: đồ án không có giai đoạn huấn luyện; "groundtruth" tương ứng là nghiệm giải tích và ảnh tham chiếu.

## Chương 5. Kết luận và hướng phát triển *(A)*
Tóm tắt kết quả đo được; hạn chế; hướng phát triển: WebGPU, vẽ đường cong bằng shader (Loop & Blinn), mở rộng sang 3D.

## Đối chiếu nhanh với MANUAL_FAULT
| Mục | Xử lý ở đâu |
|---|---|
| 1. Framework chung | 1.3, bảng công đoạn |
| 2. Ẩn số | 1.3, cột "Ẩn số cần tìm" |
| 3. Related works cùng tiêu chí | Ch.2, một bảng chung |
| 4. Giai đoạn huấn luyện | Không áp dụng, ghi rõ trong Ch.4 |
| 5. Tiến trình hoạt động | 3.5 |
| 6. Độ đo | 4.4 |
| 7. Tập dữ liệu | 4.3 |
| 8. Khuyết điểm related works | Ch.2, cột "Khuyết điểm" |
