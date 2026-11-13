# Chương 1. Giới thiệu

> Bản viết dạng văn của Chương 1. Trích dẫn [n] theo danh mục chung `Tai lieu tham khao.md`. Khung 5 công đoạn C1–C5 ở Bảng 1.2 dùng chung cho Chương 2–4.

## 1.1. Bối cảnh chung

Trình duyệt web có mặt trên hầu hết máy tính và điện thoại, và một trang web chạy được ngay mà không cần cài đặt. Chuẩn HTML5 cho phép vẽ đồ họa 2D trực tiếp trên trang theo ba cách. Với **SVG** [12], mỗi hình là một phần tử của trang, trình duyệt tự lo việc vẽ và gắn sự kiện. Với **Canvas 2D** [11], chương trình JavaScript gọi từng lệnh vẽ lên thẻ `<canvas>`. Với **WebGL** [13], chương trình gửi dữ liệu và các chương trình nhỏ gọi là *shader* xuống bộ xử lý đồ họa (GPU), rồi GPU vẽ kết quả lên cùng thẻ `<canvas>`. Trong ba cách, chỉ WebGL cho phép người lập trình điều khiển GPU.

GPU xử lý song song hàng nghìn đỉnh và điểm ảnh cùng lúc. Tuy nhiên GPU chỉ vẽ được điểm, đoạn thẳng và tam giác, nên mọi vùng cần tô phải được chia thành tam giác. Một hình 2D bất kỳ, nhất là đường cong, vì vậy phải được chuyển về dạng GPU vẽ được trước khi hiển thị, và có nhiều cách chuyển với độ chính xác và chi phí khác nhau.

Từ năm 2017, WebGL 2.0 có mặt trên Chrome và Firefox, và từ Safari 15 (2021) thì có trên mọi trình duyệt chính [21]. API thế hệ sau là WebGPU chỉ mới được hỗ trợ trên đủ các trình duyệt chính từ cuối năm 2025 [15]. Do đó WebGL 2 hiện là nền tảng ổn định nhất để lập trình GPU trên web.

Ứng dụng trực quan hóa trong giáo dục là nơi đặt ra những yêu cầu khó cho đồ họa 2D:
- **hình tĩnh phải đúng và rõ khi phóng to**, ví dụ quỹ đạo của một vật bị ném hay đồ thị của một hàm;
- **cảnh động phải mượt**, ví dụ mô phỏng dao động hay quá trình sắp xếp một mảng được phát lại từng bước;
- **người học phải thao tác được trực tiếp** trên từng phần tử: kéo một cột, chọn một đỉnh của đồ thị, di chuyển một nguồn sóng.

Báo cáo này khảo sát cách dùng HTML5 và WebGL để đáp ứng ba yêu cầu trên, và minh họa bằng ứng dụng web EduViz2D gồm các bài học Tin học và Vật lý do nhóm xây dựng.

## 1.2. Động lực nghiên cứu

**Ý nghĩa khoa học.** Vẽ hình 2D chất lượng cao trên GPU là bài toán có nhiều lời giải đã công bố. Cách thông thường chia đường cong thành nhiều đoạn thẳng rồi chia thành tam giác. Loop và Blinn (2005) tính đường cong trực tiếp tại từng điểm ảnh bằng shader [1]. Kilgard và Bolz (2012) đánh dấu vùng bên trong hình vào bộ đệm stencil rồi mới tô [3]. Li và cộng sự (2016) đưa phương pháp quét dòng lên GPU [5]. Các lời giải này được đề xuất cho GPU máy tính với Direct3D, OpenGL hoặc CUDA. Trên trình duyệt, người lập trình chỉ có những gì WebGL cung cấp, nên cần khảo sát lại xem lời giải nào áp dụng được, và áp dụng thì hiệu quả đến đâu.

**Ý nghĩa thực tiễn.** Mô phỏng tương tác giúp người học hiểu khái niệm. Wieman và cộng sự (2008) mô tả cách thiết kế bộ mô phỏng PhET [7]; tổng quan của Banda và Nzabahimana (2021) trên 31 nghiên cứu cho thấy việc tích hợp PhET hỗ trợ người học hiểu khái niệm Vật lý [20]; Wang và cộng sự (2025) tổng hợp các nghiên cứu về thí nghiệm ảo trong dạy Vật lý [22]. Với công cụ minh họa thuật toán, phân tích tổng hợp của Hundhausen và cộng sự (2002) chỉ ra rằng mức độ người học tham gia thao tác quan trọng hơn hình thức hiển thị [17], và Naps và cộng sự (2002) phân các mức tham gia đó thành nhiều bậc [18]. Từ đó đặt ra yêu cầu kỹ thuật cho phần đồ họa: mỗi khung hình của cảnh động phải vẽ xong trong khoảng 16,7 ms để đạt 60 khung hình mỗi giây, hình phải đúng ở mọi mức phóng to, và ứng dụng phải xác định được người học đang chạm vào phần tử nào.

## 1.3. Phát biểu bài toán

### 1.3.1. Bài toán chung

Cho dữ liệu của một bài học (mảng số, đồ thị, lưới, hay trạng thái của một hệ vật lý) cùng các tham số người học chỉnh, cần tạo ra hình ảnh trên thẻ `<canvas>` của trang web bằng WebGL sao cho: hình đúng và mịn ở mọi mức phóng to; mỗi khung hình của cảnh động vẽ xong trong 16,7 ms; và ứng dụng xác định được người học đang thao tác với phần tử nào. Bảng 1.1 nêu Input, Output và tiêu chí đánh giá, kèm thành phần HTML5/WebGL tương ứng.

**Bảng 1.1 – Input, Output và tiêu chí của bài toán**
| | Nội dung | HTML5 / WebGL cung cấp |
|---|---|---|
| **Input** | (1) Dữ liệu và tham số bài học: mảng số, đồ thị, lưới, trạng thái vật lý; tham số người học chỉnh (vận tốc ném, góc ném, bước sóng…)<br>(2) Thuộc tính vẽ: màu, độ trong suốt, bề rộng nét<br>(3) Khung nhìn: phép biến đổi từ tọa độ thế giới sang màn hình (dời, xoay, phóng to)<br>(4) Khung vẽ: kích thước W × H điểm ảnh, tỉ lệ điểm ảnh `devicePixelRatio`<br>(5) Với cảnh động: khoảng thời gian Δt giữa hai khung hình và các sự kiện người dùng | (1) mảng JavaScript, control HTML5 (`range`, `select`)<br>(2), (3) vertex buffer và uniform của WebGL<br>(4) thẻ `<canvas>`<br>(5) `requestAnimationFrame`; sự kiện chuột, cảm ứng, bàn phím của DOM |
| **Output** | Cảnh tĩnh: một ảnh RGBA kích thước (W·dpr) × (H·dpr), xuất được ra tệp PNG<br>Cảnh động: chuỗi khung hình, mỗi khung không quá 16,7 ms<br>Khi người dùng trỏ chuột: đối tượng đang được chọn | Framebuffer của `<canvas>`; `toBlob` để xuất ảnh; `readPixels` để đọc lại điểm ảnh |
| **Tiêu chí** | Đúng hình: sai số hình học tính bằng điểm ảnh<br>Mịn: không lộ cạnh, không răng cưa ở mọi mức phóng to<br>Nhanh: thời gian khung hình, số lệnh vẽ, số đỉnh gửi lên GPU<br>Đúng dữ liệu: sai số của mô phỏng so với nghiệm giải tích | Là cơ sở của các độ đo ở Mục 4.4 |

Dữ liệu bài học không được vẽ trực tiếp mà phải được đổi thành hình học 2D: quỹ đạo ném xiên thành một đường cong Bézier bậc 2; mảng cần sắp xếp thành N hình chữ nhật; đồ thị thành các hình tròn và đoạn thẳng; giao thoa sóng thành một hàm màu cho từng điểm ảnh.

### 1.3.2. Framework chung

Bài toán được chia thành 5 công đoạn (Bảng 1.2, Hình 1.1). Bảng chỉ nêu mỗi công đoạn phải trả lời câu hỏi gì (ẩn số), chưa gắn với phương pháp cụ thể; các công trình ở Chương 2 khác nhau chính ở cách chúng trả lời các ẩn số này.

**Bảng 1.2 – Framework 5 công đoạn và ẩn số**
| # | Công đoạn | Ẩn số cần tìm | HTML5 / WebGL tham gia | Ví dụ: quỹ đạo ném xiên | Ví dụ: sắp xếp |
|---|---|---|---|---|---|
| C1 | Biểu diễn dữ liệu / tham số bài học | Dữ liệu mô hình hóa thế nào; người học chỉnh được tham số nào | JavaScript; control HTML5 | Vận tốc v₀, góc θ, gia tốc g | Mảng N số |
| C2 | Mô hình hóa và tính toán | Công thức, thuật toán nào; tính ở CPU hay GPU; sai số, độ phức tạp | JavaScript, hoặc shader | Quỹ đạo → 3 điểm điều khiển P0, P1, P2 | Thuật toán sắp xếp, ghi lại từng bước |
| C3 | Ánh xạ sang hình học 2D | Mỗi đối tượng thành primitive nào; gửi bao nhiêu đỉnh; ma trận thế giới → clip space | Vertex buffer, VAO, thuộc tính bản sao; uniform `mat3` | Xấp xỉ bằng đoạn thẳng, hay tính trực tiếp tại điểm ảnh? | N hình chữ nhật: N lệnh vẽ hay 1 lệnh? |
| C4 | Render | Dùng API vẽ nào (SVG, Canvas 2D, WebGL, WebGPU); điểm ảnh nào thuộc hình, màu và độ phủ; số lệnh vẽ; khung W × H, `devicePixelRatio`; trộn các lớp, xuất ảnh | Vertex / fragment shader, blending, `<canvas>`, `toBlob` | Điểm ảnh cách đường cong không quá nửa bề rộng nét được tô | Cột tô màu theo trạng thái (so sánh, đổi chỗ) |
| C5 | Tương tác và điều khiển thời gian | Vẽ lại khi nào, Δt; phát lại bước; đối tượng nào bị chọn | `requestAnimationFrame`, sự kiện DOM, `readPixels` | Kéo thanh phóng to → vẽ lại | Play / pause / tua; kéo-thả đổi chỗ cột |

**Hình 1.1 – Sơ đồ 5 công đoạn.** *[Vẽ bằng draw.io: 5 hộp C1 → C2 → C3 → C4 → C5 nối bằng mũi tên; một mũi tên từ C5 quay về C1 thể hiện vòng lặp của cảnh động.]*

### 1.3.3. Bài toán con: vẽ đường cong

Trong các ẩn số ở Bảng 1.2, câu hỏi "xấp xỉ đường cong bằng đoạn thẳng hay tính trực tiếp tại điểm ảnh" (C3–C4) quyết định độ chính xác hình học khi phóng to. Đây là bài toán con mà phương pháp ở Mục 3.3 giải (Bảng 1.3).

**Bảng 1.3 – Bài toán con: vẽ đường cong Bézier bậc 2**
| | Nội dung |
|---|---|
| Input | 3 điểm điều khiển P0, P1, P2 (tọa độ thế giới); ma trận chiếu sang điểm ảnh; bề rộng nét w; màu |
| Output | Độ phủ α(X, Y) ∈ [0, 1] cho từng điểm ảnh (X, Y) của khung vẽ |
| Tiêu chí | α ≈ 1 khi khoảng cách từ tâm điểm ảnh tới đường cong không quá w/2, giảm về 0 trong 1 điểm ảnh tiếp theo; sai số không tăng khi phóng to; ít đỉnh gửi lên GPU |
| Ẩn số | Biểu diễn đường cong sao cho GPU kiểm tra được từng điểm ảnh; cách ước lượng khoảng cách tới đường cong; hình bao cần vẽ |

## 1.4. Đóng góp

Báo cáo không đề xuất thuật toán vẽ mới, mà đọc hiểu, cài đặt lại và kiểm chứng các giải pháp đã công bố. Các đóng góp cụ thể và nơi trình bày bằng chứng được nêu ở Bảng 1.4.

**Bảng 1.4 – Đóng góp và nơi chứng minh**
| # | Đóng góp | Bằng chứng |
|---|---|---|
| 1 | Khảo sát và so sánh 15 công trình liên quan (5 công nghệ vẽ 2D trên web, 4 ứng dụng giáo dục, 5 kỹ thuật vẽ 2D trên GPU, 1 nghiên cứu đo hiệu năng) theo cùng khung 5 công đoạn | Chương 2, Bảng 2.1–2.3 |
| 2 | Xây dựng ứng dụng minh họa EduViz2D cho hai môn Tin học và Vật lý, có chế độ tĩnh và động, trên **pipeline WebGL 2 kết hợp instancing** (giải pháp nền) | Mục 3.2, 4.2 |
| 3 | Trình bày và cài đặt lại **phương pháp vẽ đường cong độc lập độ phân giải của Loop và Blinn (2005)** trên WebGL cho đường cong Bézier bậc 2, áp dụng vẽ quỹ đạo ném xiên (phương pháp cải tiến) | Mục 3.3 |
| 4 | Kiểm chứng phương pháp bằng số đo sai số hình học, độ phủ và số đỉnh ở nhiều mức phóng to, so với cách chia đường cong thành đoạn thẳng | Mục 4.4, thử nghiệm (f) |
| 5 | Đo hiệu năng của Canvas 2D, PixiJS và WebGL thuần, của instancing và của tính toán theo từng điểm ảnh trên GPU, mở rộng phép đo của Horak và cộng sự (2018) [6] | Mục 4.4, thử nghiệm (a), (d), (e) |
| 6 | So sánh sai số của ba phương pháp tích phân số và số ô duyệt của hai thuật toán tìm đường, là dữ liệu đầu vào cho phần vẽ | Mục 3.4, 4.4, thử nghiệm (b), (c) |

Phạm vi của báo cáo: chỉ đồ họa 2D; phương pháp Loop và Blinn chỉ cài cho đường cong bậc 2; không đánh giá hiệu quả học tập với người học thật.

## 1.5. Bố cục báo cáo

Chương 2 khảo sát các công trình liên quan theo khung 5 công đoạn và xác định khoảng trống mà báo cáo nhắm tới. Chương 3 trình bày giải pháp nền (pipeline WebGL 2 với instancing) và phương pháp cải tiến của Loop và Blinn, theo trình tự nguyên lý, phương pháp, giải thuật, minh họa. Chương 4 mô tả cài đặt, bộ thử nghiệm, kết quả và bàn luận. Chương 5 tóm tắt kết quả và nêu hướng phát triển.
