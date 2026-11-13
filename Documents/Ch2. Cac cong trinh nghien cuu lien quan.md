# Chương 2. Các công trình nghiên cứu liên quan

> Bản viết dạng văn của Chương 2. Nguồn của từng ô bảng: danh mục chung `Tai lieu tham khao.md`; bảng làm việc cũ (6 công đoạn, ghi nguồn từng ô) vẫn xem được trong lịch sử Git (commit 96dd593).
> Khung C1–C5, ẩn số (Bảng 1.2) và nhãn thử nghiệm (a)–(g) dùng chung với Chương 1, 3, 4.

## 2.1. Mục đích và cách tiếp cận khảo sát

Để các giải pháp so sánh được với nhau, mọi công trình đều được trình bày **theo cùng một dàn bài**, bám sát 5 công đoạn của framework chung đã nêu ở mục 1.3, Bảng 1.2 (chưa gắn với phương pháp cụ thể). Bảng dưới chép lại tên và ẩn số của từng công đoạn:

| Công đoạn | Tên | Ẩn số cần xác định ở công đoạn này |
| :---- | :---- | :---- |
| **C1** | Biểu diễn dữ liệu / tham số bài học | Dữ liệu mô hình hóa thế nào (mảng, đồ thị, lưới, trạng thái vật lý); người học chỉnh được tham số nào |
| **C2** | Mô hình hóa và tính toán | Công thức, thuật toán nào; tính ở CPU hay GPU; sai số, độ phức tạp |
| **C3** | Ánh xạ sang hình học 2D | Mỗi đối tượng (cột, node, vật, đường cong, điểm sóng) thành primitive nào (điểm, đoạn, tam giác, bản sao, texture); gửi bao nhiêu đỉnh; ma trận thế giới → clip space |
| **C4** | Render | Dùng API vẽ nào (SVG, Canvas 2D, WebGL, WebGPU); điểm ảnh nào thuộc hình, màu và độ phủ; số lệnh vẽ; khung W × H, `devicePixelRatio`; trộn các lớp, xuất ảnh |
| **C5** | Tương tác và điều khiển thời gian | Vẽ lại khi nào, Δt; phát lại bước (play/pause/tua); đối tượng nào bị chọn |

Hai độ đo dùng xuyên suốt để nhận xét ưu/nhược của từng giải pháp (đúng yêu cầu môn học):
- **Độ chính xác:** sai số số học của mô phỏng (so với nghiệm giải tích), sai số hình học của hình vẽ (điểm ảnh), độ đúng của chuỗi bước thuật toán được vẽ.
- **Độ phức tạp tính toán:** độ phức tạp thuật toán ở C2 và chi phí render ở C4 (thời gian khung hình, FPS, số lệnh vẽ, số đỉnh theo số đối tượng).

## 2.2. Tiến trình phát triển của HTML5 + WebGL cho đồ họa 2D giáo dục

Sự phát triển được chia thành 5 giai đoạn. Điểm xuyên suốt là: **(i)** nơi tính toán dần dịch chuyển từ CPU sang GPU, và **(ii)** nền tảng chạy chuyển từ plugin sang chuẩn mở của trình duyệt.

### Giai đoạn 0 – Trước 2010: ứng dụng giáo dục dựa trên plugin (Java applet, Flash)
- Các mô phỏng giáo dục nổi tiếng thời kỳ này (PhET, Falstad…) chạy bằng **Java applet hoặc Flash**; việc vẽ do runtime của plugin đảm nhiệm, nhà phát triển không điều khiển trực tiếp GPU.
- Nghiên cứu sư phạm cùng thời kỳ cho thấy hiệu quả của trực quan hóa thuật toán phụ thuộc chủ yếu vào mức độ **người học tương tác** chứ không chỉ vào việc "xem animation" [17], [18]. Đây là cơ sở để C5 (tương tác) trở thành một công đoạn riêng trong framework.
- **Hạn chế:** cần cài plugin, không chạy trên di động, khó chia sẻ; Flash chính thức ngừng hỗ trợ cuối năm 2020, các ứng dụng phải chuyển nền tảng.

### Giai đoạn 1 – 2004–2011: thẻ `<canvas>` của HTML5 và WebGL 1.0
- Thẻ `<canvas>` (Apple đưa vào WebKit năm 2004, sau đó được chuẩn hóa trong HTML5 [11]) cho phép vẽ 2D bằng JavaScript ngay trong trang web, kết hợp `requestAnimationFrame` để tạo chế độ động và sự kiện chuột/cảm ứng để tương tác – **đáp ứng đủ C4 và C5 mà không cần plugin**.
- Song song, SVG [12] cho phép mỗi hình là một phần tử trang, gắn sự kiện trực tiếp.
- **WebGL 1.0** (Khronos, đặc tả hoàn chỉnh 03/2011), dựa trên OpenGL ES 2.0, đưa pipeline đồ họa lập trình được (vertex shader → raster hóa → fragment shader) vào trình duyệt. GPU vẽ được điểm, đoạn thẳng và tam giác; mọi vùng tô phải chia thành tam giác.
- Cùng thời gian, các bài báo đồ họa bắt đầu dùng shader để vẽ hình 2D chất lượng cao: **Loop & Blinn (2005)** [1] vẽ đường cong Bézier bằng phương trình ẩn tính tại từng điểm ảnh; **Green (2007)** [2] vẽ chữ sắc nét bằng trường khoảng cách.
- **Hạn chế:** Canvas 2D phải gọi từng lệnh vẽ từ JavaScript, chi phí tăng theo số đối tượng; WebGL thuần có API cấp thấp, rất dài dòng cho bài toán 2D thông thường.

### Giai đoạn 2 – 2011–2016: di cư sang HTML5 và các thư viện trung gian
- Các nền tảng giáo dục lớn chuyển từ plugin sang HTML5/JavaScript: **PhET** chuyển dần các mô phỏng sang HTML5 trên thư viện Scenery [16]; **Falstad** có bản JavaScript/WebGL [8]; GeoGebra cũng có bản HTML5. Các công cụ trực quan hóa thuật toán thế hệ mới chạy hoàn toàn trên trình duyệt: **VisuAlgo** (khởi đầu năm 2011 tại Đại học Quốc gia Singapore [9]) và **algorithm-visualizer** [10].
- Xuất hiện các thư viện che bớt sự phức tạp của WebGL: **Three.js** (2010, thiên về 3D), **PixiJS** (2013, renderer 2D dùng WebGL, tự gộp lệnh vẽ) [14], **regl**, chế độ WEBGL của **p5.js**; **Matter.js** (2014) cho vật lý 2D thời gian thực trên Canvas.
- **Shadertoy** (2013) phổ biến cách "tính toán trên mỗi điểm ảnh bằng fragment shader", nhờ đó các hiện tượng như sóng, nhiễu xạ, trường vô hướng có thể vẽ ở tốc độ thời gian thực.
- Ở phía bài báo, vẽ path vector chuyển hẳn lên GPU: **Kilgard & Bolz (2012)** [3] với "stencil, then cover", **Ganacim và cs. (2014)** [4] lấy mẫu song song, **Li, Hou, Zhou (2016)** [5] quét dòng trên GPU. Cả ba cần tính năng mà WebGL không có (phần mở rộng riêng của NVIDIA, CUDA, tính toán đa dụng).
- **Hạn chế:** phần lớn ứng dụng giáo dục vẫn **tính toán trên CPU** và vẽ bằng SVG hoặc Canvas 2D. Horak và cs. (2018) [6] đo một cây node–cạnh trên trình duyệt: FPS của cả SVG, Canvas và WebGL đều bắt đầu giảm khi vượt khoảng 400 node (khoảng 8.000 phần tử đồ họa).

### Giai đoạn 3 – 2017–2022: WebGL 2 và tính toán bằng shader
- **WebGL 2.0** [13] (dựa trên OpenGL ES 3.0) có mặt trên Chrome và Firefox từ 2017; Safari bật mặc định từ **Safari 15 (2021)** [21], nên đến khoảng 2022 có thể coi là **được hỗ trợ trên mọi trình duyệt chính**. Các tính năng quan trọng cho 2D: **instancing** (`drawArraysInstanced` – vẽ nhiều bản sao một hình bằng một lệnh), VAO có sẵn, transform feedback, texture dạng số thực, GLSL ES 3.00.
- Xuất hiện các mô phỏng 2D thời gian thực chạy **toàn bộ trên GPU**: Falstad Ripple Tank tính và vẽ sóng bằng shader WebGL [8]; mô phỏng chất lỏng WebGL-Fluid-Simulation của P. Dobryakov (mã nguồn trên GitHub); hệ hạt tính trong texture hoặc transform feedback.
- Với giáo dục: bài toán chuyển từ "chạy được trên web" sang **"chạy mượt với dữ liệu lớn và tương tác trực tiếp"**.
- **Hạn chế:** tính toán đa dụng qua fragment shader là "mẹo" (phải mã hóa dữ liệu vào texture), khó viết và khó gỡ lỗi; ít ứng dụng giáo dục áp dụng.

### Giai đoạn 4 – 2023 đến nay: WebGPU và hợp nhất hạ tầng
- **WebGPU** [15] có mặt trên Chrome/Edge từ phiên bản 113 (2023); theo bài tổng kết của web.dev ngày 25/11/2025 [15], API này đã được hỗ trợ trên Chrome, Edge, Firefox (Windows từ Firefox 141) và Safari 26. Điểm mới quan trọng là **compute shader**, cho phép tính vật lý/hạt trực tiếp trên GPU mà không cần "mẹo" texture.
- **PixiJS v8** (2024) bổ sung renderer WebGPU bên cạnh WebGL. Từ bản 8.1.0, renderer mặc định là **WebGL**; muốn dùng WebGPU phải chọn rõ (`preference: 'webgpu'`) [14], do hành vi WebGPU chưa đồng nhất giữa các trình duyệt. Vì vậy **WebGL vẫn là lựa chọn ổn định nhất cho ứng dụng giáo dục cần chạy trên nhiều máy**.
- **Hạn chế:** phụ thuộc phiên bản hệ điều hành/driver/GPU, tài liệu và ví dụ giáo dục còn ít so với WebGL.

### Tóm tắt tiến trình (theo hai trục)

| Giai đoạn | Nền tảng chạy (C4) | Nơi tính toán chính (C2) | Điểm đổi mới | Thách thức còn lại |
| :---- | :---- | :---- | :---- | :---- |
| 0 (≤2010) | Plugin Java/Flash | CPU | Mô phỏng tương tác đầu tiên | Cần plugin, không di động |
| 1 (2004–2011) | Canvas 2D, SVG / WebGL 1 | CPU | Chuẩn mở trong trình duyệt; vẽ đường cong bằng shader (bài báo) | Chi phí tăng theo số đối tượng; WebGL quá cấp thấp |
| 2 (2011–2016) | Canvas, SVG + thư viện WebGL 2D | CPU | Thư viện (PixiJS…), shader trên từng điểm ảnh; path rendering trên GPU (bài báo) | Tính toán vẫn ở CPU; kỹ thuật GPU tiên tiến không có trong WebGL |
| 3 (2017–2022) | WebGL 2 (instancing, shader) | CPU + GPU (qua texture) | Nhiều bản sao trong 1 lệnh vẽ; mô phỏng trên GPU | Tính toán đa dụng khó viết |
| 4 (2023–nay) | WebGPU + WebGL | GPU (compute shader) | Compute pipeline | Tương thích, ít tài liệu |

## 2.3. Các giải pháp liên quan, trình bày theo cùng dàn bài C1–C5

Các giải pháp chia thành ba nhóm:
- **(A) Công nghệ render 2D trên web** – đối chứng của đồ án ở thử nghiệm (a), (d);
- **(B) Ứng dụng giáo dục** – đối thủ trực tiếp của EduViz2D;
- **(C) Kỹ thuật vẽ 2D trên GPU (bài báo)** – nguồn của phương pháp cải tiến ở Ch.3.

Cả ba bảng dùng **mẫu bảng của thầy**: Tên công trình | Nguyên lý | Phương pháp (Pipeline C1–C5) | Hiệu suất (Data, Độ đo, Kết quả) | Đóng góp | Giới hạn / Hướng phát triển. Quy tắc điền:
1. Không để trống ô công đoạn nào; công đoạn không cải tiến thì ghi ngắn cách thông thường.
2. **In đậm công đoạn mà công trình có đóng góp.**
3. Hiệu suất lấy từ chính công trình hoặc từ nghiên cứu đã đo nó; không có thì ghi "Không công bố số đo". Số đo của nhóm chỉ ở Ch.4.

Trong Word: trang nằm ngang, cỡ chữ 9–10, gộp ô tiêu đề "Phương pháp (Pipeline)" và "Hiệu suất".

### 2.3.1. Nhóm A – Các công nghệ render 2D trên web

**Nghiên cứu đo hiệu năng dùng cho nhóm này.** Horak, Kister và Dachselt (2018) [6] so sánh SVG (thư viện D3.js), Canvas (không dùng thư viện) và WebGL (PixiJS) khi vẽ một cây node–cạnh từ 100 đến 3.200 node, mỗi node gồm 15 phần tử đồ họa, đo FPS lúc người dùng thao tác. Kết quả: FPS của cả ba bắt đầu giảm khi vượt khoảng 400 node (khoảng 8.000 phần tử); SVG gần bằng Canvas, trái với nhận định thường gặp rằng Canvas nhanh hơn; WebGL nhanh nhất. Chữ vẽ dạng bitmap là nguyên nhân chính làm WebGL chậm: bỏ chữ thì FPS gần như không đổi, còn khoảng 50 FPS ở cấu hình cực lớn 400.000 node. Đây là poster một trang, đo trên phần cứng năm 2018 và chỉ với đồ thị, nên đồ án đo lại trên máy hiện nay với nhiều loại cảnh (thử nghiệm a). Công trình này là phép đo, không phải một cách vẽ, nên không có dòng riêng trong bảng mà được dùng làm cột Hiệu suất.

**Bảng 2.1 – Công nghệ render 2D trên web**
| Tên công trình | Nguyên lý | C1 Dữ liệu | C2 Tính toán | C3 Ánh xạ hình học | C4 Render | C5 Tương tác | Data | Độ đo | Kết quả | Đóng góp | Giới hạn / Hướng phát triển |
|---|---|---|---|---|---|---|---|---|---|---|---|
| SVG [12] | Vẽ giữ lại: mỗi hình là một phần tử trang | Mỗi đối tượng là một phần tử SVG | CPU (JavaScript) | Thuộc tính của phần tử, `transform` | Trình duyệt tự tô, có khử răng cưa | **Sự kiện gắn trực tiếp vào từng hình** | Cây 100 → 3.200 node, 15 phần tử mỗi node; bản SVG dùng D3.js [6] | FPS khi thao tác | FPS giảm khi vượt khoảng 400 node [6] | **Hình vector, tương tác dễ nhất** | Nặng khi có hàng nghìn phần tử |
| Canvas 2D [11] | Vẽ tức thời, không giữ đối tượng | Mảng đối tượng JavaScript, tự quản lý | CPU | Lệnh vẽ path, hình chữ nhật; ma trận `setTransform` | Trình duyệt tô từng lệnh vẽ, có khử răng cưa | Tự vẽ lại mỗi khung hình; tự xác định đối tượng bị chọn | Như trên; bản Canvas không dùng thư viện [6] | FPS khi thao tác | Giảm khi vượt khoảng 400 node; gần bằng SVG [6] | **API vẽ đơn giản, có trên mọi trình duyệt** | Không lập trình được GPU; chi phí tăng theo số lệnh vẽ |
| PixiJS (thư viện WebGL 2D) [14] | Đồ thị cảnh trên WebGL | Đối tượng Graphics, Sprite, Text trong đồ thị cảnh | CPU | **Chia tam giác tự động; đường cong chia thành đoạn thẳng** | **Tự gộp lệnh vẽ (batching), texture atlas; shader viết sẵn** | **Hệ sự kiện kèm hit-test trên đồ thị cảnh** | Như trên; bản WebGL dùng PixiJS [6] | FPS khi thao tác | Nhanh nhất trong 3 công nghệ; không vẽ chữ thì FPS gần như không đổi [6] | Dùng WebGL dễ dàng | Che giấu pipeline; tối ưu phụ thuộc thư viện |
| WebGL 2 thuần [13] | Lập trình GPU bằng shader | Vertex buffer, texture do người lập trình quản lý | CPU, hoặc GPU qua fragment shader / transform feedback | **Người lập trình tự chia hình thành tam giác, tự thiết kế dữ liệu đỉnh và thuộc tính bản sao** | **Shader tự viết; instancing: nhiều bản sao trong 1 lệnh vẽ** | Tự xác định đối tượng bị chọn (tính toán hoặc GPU picking) | Không có nghiên cứu đo riêng WebGL thuần trong các nguồn đã dùng | Không công bố | Không công bố số đo (đồ án đo ở thử nghiệm a, d) | **Truy cập GPU trên trình duyệt, không cần plugin** | Viết nhiều code, dễ lỗi; chưa có compute shader |
| WebGPU [15] | API GPU thế hệ mới, có compute shader | Storage buffer, texture | **GPU compute shader** | Tự thiết kế | Pipeline đặt trước, render bundle | Tự xác định đối tượng bị chọn | Không có nghiên cứu đo trong các nguồn đã dùng | Không công bố | Không công bố số đo | **Tính toán đa dụng trên GPU ngay trong trình duyệt** | Hỗ trợ chưa đồng đều (Firefox 141 mới có trên Windows) [15] |

*Nhận xét:* với dữ liệu nhỏ, mọi hướng đều đủ dùng; khác biệt chỉ lộ ra khi số đối tượng và tần suất cập nhật tăng. Số liệu công bố duy nhất [6] đã cũ và chỉ cho đồ thị. Việc **định lượng khác biệt này cho đúng bài toán giáo dục** (cột sắp xếp, node đồ thị, hạt) là khoảng trống mà thử nghiệm (a), (d) của đồ án nhắm đến.

### 2.3.2. Nhóm B – Các ứng dụng giáo dục tiêu biểu

Chỉ chọn ứng dụng thuộc hai môn của đồ án (Vật lý, Tin học) và đã kiểm chứng được cách vẽ. GeoGebra và Desmos thuộc môn Toán và chưa kiểm chứng được cách vẽ nên không đưa vào bảng.

**Bảng 2.2 – Ứng dụng giáo dục**
| Tên công trình | Nguyên lý | C1 Dữ liệu | C2 Tính toán | C3 Ánh xạ hình học | C4 Render | C5 Tương tác | Data | Độ đo | Kết quả | Đóng góp | Giới hạn / Hướng phát triển |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PhET (Vật lý, Hóa, Toán) [7], [16] | Đồ thị cảnh giữ đối tượng; trình duyệt vẽ lại khi đối tượng đổi | Tham số mô hình cố định theo từng bài, chỉnh bằng thanh trượt | Mô hình vật lý viết sẵn cho từng bài, tính bằng JavaScript | **Đồ thị cảnh Scenery: mỗi đối tượng là một nút** | Scenery chọn SVG, Canvas, DOM hoặc một phần WebGL cho từng phần; bài Projectile Motion vẽ bằng SVG (khoảng 236 hình, không có canvas) | **Kéo-thả, thanh trượt, play/pause/step; Scenery gom thay đổi, chỉ vẽ lại vùng đổi khi gọi `updateDisplay` mỗi khung hình** | 31 nghiên cứu về PhET [20] | Mức hiểu khái niệm của người học | Hỗ trợ người học hiểu khái niệm [20]; không công bố số đo hiệu năng vẽ | Mô phỏng tương tác dùng rộng rãi trong dạy học | Mỗi bài cài đặt riêng; SVG chậm dần khi nhiều phần tử |
| Falstad Ripple Tank (Vật lý – sóng) [8] | Giải phương trình sóng trên lưới; tính và vẽ hoàn toàn bằng WebGL | Trạng thái mặt sóng lưu trong 2 texture số thực; nguồn, tường, môi trường do người dùng đặt | **Mỗi bước mô phỏng là một lượt vẽ vào texture, đổi qua lại giữa 2 texture (render-to-texture)** | Tường, nguồn, môi trường vẽ thành đoạn thẳng, tam giác ngay trong texture trạng thái | **Shader tô màu theo biên độ; có chế độ xem 3D dạng mặt cao độ** | Kéo-thả vật; đầu đo đọc giá trị bằng `readPixels`; lưu bố cục thành đường link | Không công bố | Không công bố | Không công bố số đo | Mô phỏng sóng thời gian thực trên trình duyệt | Mỗi bài một chương trình riêng, không có khung chung; giao diện cũ |
| VisuAlgo (Tin học – CTDL & GT) [9] | Mỗi phần tử dữ liệu là một hình SVG do thư viện D3 cập nhật | Dữ liệu người dùng nhập hoặc ngẫu nhiên, số phần tử nhỏ | **Thuật toán chạy sẵn, ghi lại từng bước** | Cột, node, cạnh → phần tử SVG | SVG qua D3; trình duyệt tô | **Phát lại từng bước, tua, đổi tốc độ** | Không công bố | Không công bố | Không công bố số đo | Minh họa thuật toán có phát lại từng bước | Hợp với số phần tử nhỏ; chỉ môn Tin học |
| algorithm-visualizer (Tin học – thuật toán) [10] | React dựng lại phần tử trang theo lệnh ghi từ code của người học | **Code người học viết + dữ liệu mẫu** | **Chạy code, ghi "vết" (tracer) thành lệnh minh họa** | Bảng HTML (mảng 2 chiều), SVG (đồ thị) | Trình duyệt vẽ phần tử trang | Chạy, dừng, bước theo code | Không công bố | Không công bố | Không công bố số đo | Người học tự viết code rồi xem minh họa | Mỗi phần tử là một nút trang, nặng khi dữ liệu lớn; chưa có Vật lý |

*Nhận xét:* các ứng dụng này đã giải tốt bài toán **"trực quan hóa đúng và dễ hiểu"**; đóng góp nằm chủ yếu ở C2 (ghi bước) và C5 (tương tác), còn C4 giao cho SVG hoặc phần tử trang (chỉ Falstad Ripple Tank dùng WebGL). Chúng thường (i) tách rời từng môn, mỗi mô phỏng một cách cài đặt riêng, (ii) không công bố số liệu về **hiệu năng theo số đối tượng** và (iii) không hiển thị **sai số của phương pháp tích phân số** trong giao diện.

### 2.3.3. Nhóm C – Kỹ thuật vẽ 2D trên GPU (bài báo)

Nhóm này cải tiến trực tiếp C3 và C4: thay vì chia hình thành nhiều đoạn thẳng và tam giác trên CPU, GPU tính hình dạng tại từng điểm ảnh. Hiệu suất lấy từ phần thực nghiệm của từng bài.

**Bảng 2.3 – Kỹ thuật vẽ 2D trên GPU và đồ án của nhóm**
| Tên công trình | Nguyên lý | C1 Dữ liệu | C2 Tính toán | C3 Ánh xạ hình học | C4 Render | C5 Tương tác | Data | Độ đo | Kết quả | Đóng góp | Giới hạn / Hướng phát triển |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Loop & Blinn 2005 [1] | Đường cong Bézier dạng phương trình ẩn, kiểm tra tại từng điểm ảnh | Phông chữ, hình vector (Bézier bậc 2, 3) | Tiền xử lý trên CPU: chia vùng thành tam giác, gán tọa độ (u, v) | **Tam giác điều khiển mang (u, v); không chia nhỏ đường cong** | **Pixel shader tính u² − v; khử răng cưa theo khoảng cách gần đúng** | Hình cố định; đổi hình dạng phải tiền xử lý lại | Phông chữ TrueType, hình vector, ảnh dán lên vật 3D | Chất lượng ảnh (định tính) | Đường cong mịn ở mọi độ phóng; không công bố số đo | Vẽ đường cong độc lập độ phân giải chỉ bằng shader | Bậc 3 phức tạp; tiền xử lý trên CPU |
| Green 2007 [2] | Trường khoảng cách lưu trong texture, so ngưỡng khi vẽ | Chữ, biển hiệu, hình dạng từ ảnh đen trắng | **Tiền xử lý: ảnh nhị phân 4096 × 4096 → trường khoảng cách 64 × 64, lưu trong kênh 8 bit** | Hình chữ nhật dán texture như texture thường | **So ngưỡng 0,5 (alpha test); khử răng cưa bằng `smoothstep` và đạo hàm màn hình; viền, phát sáng, đổ bóng bằng shader** | Hình tĩnh; tham số hiệu ứng đổi được mỗi khung hình | Decal, chữ, giao diện trong engine Source (Team Fortress 2) | Chất lượng mép khi phóng to (định tính); chi phí so với texture thường | Mép sắc với texture 64 × 64; không giảm hiệu năng đáng kể so với texture thường | Chữ và hình vector sắc nét, chi phí thấp, chạy cả trên GPU đời cũ | Một kênh khoảng cách làm bo tròn góc nhọn (bài đề xuất dùng 2 kênh và phép AND để giữ góc); chỉ hợp hình đơn sắc |
| Kilgard & Bolz 2012 [3] | Vẽ path trên GPU qua 2 bước "stencil, then cover" | Path chuẩn SVG, PostScript, Flash | Path lưu sẵn trên GPU | **Bước stencil: đánh dấu vùng trong path, không chia tam giác trên CPU** | **Bước cover: tô vùng đã đánh dấu; khử răng cưa bằng nhiều mẫu mỗi điểm ảnh** | Vẽ lại không cần CPU xử lý path; ghép được với cảnh 3D | Cảnh SVG đa dạng, cửa sổ 100² → 1100²; trang web, game Flash | Tỉ lệ tốc độ so với Cairo, Skia, Direct2D, Qt; thời gian vẽ (ms) | Nhiều lần nhanh hơn; cảnh cắt phức tạp 8,69 ms so với Cairo 909 ms (1000 × 1000) | Path rendering đầy đủ trên GPU | Cần phần mở rộng riêng của NVIDIA, không có trong WebGL |
| Ganacim et al. 2014 [4] | Cấu trúc tăng tốc "shortcut tree", lấy mẫu song song toàn bộ ảnh | Nội dung SVG, PDF: path tô, nét, gradient, texture | **Xây shortcut tree song song trên GPU** | Không tạo tam giác; lấy mẫu trực tiếp trên cây | **Lấy mẫu song song, chia sẻ mẫu giữa các điểm ảnh (tới 512 mẫu mỗi điểm ảnh); mọi lớp trong 1 lượt** | Xây cây nhanh nên hợp nội dung động | 13 ảnh vector (Tiger, trang bài báo, bản đồ…), rộng 1024 px, GPU GTX Titan | Thời gian vẽ, tiền xử lý (ms), bộ nhớ, chất lượng khử răng cưa | Nhanh hơn Kilgard & Bolz khi nội dung đủ phức tạp | Vẽ vector song song chất lượng cao | Viết bằng CUDA, không chạy trong WebGL |
| Li, Hou, Zhou 2016 [5] | Đưa phương pháp quét dòng (scanline) lên GPU | Path vector | Biến đổi path mỗi khung hình | **Chỉ điểm ảnh ở biên xử lý riêng; phần trong xử lý theo đoạn ngang** | **Giảm số lần tính winding number; khử răng cưa chất lượng cao** | Hợp dữ liệu động | Nội dung tĩnh và động, độ phân giải Ultra HD | Tốc độ vẽ so với các phương pháp tốt nhất lúc đó | Nhanh hơn ổn định 2,5 lần (tới hơn 30 lần ở trường hợp cực đoan); nhanh hơn 10 lần với nội dung động (theo tóm tắt bài) | Path rendering hiệu quả trên GPU | Cần tính toán đa dụng trên GPU, không có trong WebGL |
| **Đồ án EduViz2D** | Pipeline WebGL 2 + instancing (nền); Loop & Blinn cho đường cong (cải tiến) | Cảnh giáo dục: mảng, đồ thị, lưới, trạng thái vật lý, quỹ đạo | Euler / Verlet / RK4; Dijkstra / A*; ghi bước để phát lại | **Mỗi cột/node là 1 bản sao; quỹ đạo là 1 tứ giác 4 đỉnh mang (u, v)** | **`drawArraysInstanced`; fragment shader Loop & Blinn; shader sóng tính từng điểm ảnh** | `requestAnimationFrame`; phát lại, tua; chọn đối tượng bằng hit-test, GPU picking | Bộ kịch bản mục 4.3 | Thời gian khung hình, số lệnh vẽ, sai số hình học, sai số tích phân, số ô duyệt | Trình bày ở Ch.4 (Bảng 4.5–4.11) | Cài lại và đo kiểm chứng trên cùng kịch bản giáo dục | Loop & Blinn mới làm bậc 2; chưa dùng WebGPU |

*Nhận xét:* các kỹ thuật GPU đều đóng góp ở C3 và C4, nhưng Kilgard & Bolz, Ganacim, Li cần tính năng không có trong WebGL. Loop & Blinn chỉ cần fragment shader nên cài được trên WebGL; bài báo chỉ đánh giá bằng hình, không công bố số đo, nên đồ án bổ sung phép đo sai số hình học (thử nghiệm f).

### 2.3.4. Các nghiên cứu nền tảng về hiệu quả giáo dục

| Công trình | Nội dung chính | Dùng cho |
| :---- | :---- | :---- |
| Hundhausen, Douglas, Stasko (2002), *A Meta-Study of Algorithm Visualization Effectiveness* [17] | Tổng hợp nhiều thực nghiệm; hiệu quả phụ thuộc cách người học tham gia, không chỉ do hình ảnh | Động lực cho C5 (tương tác), Ch.1 |
| Naps và cs. (2002), *Exploring the Role of Visualization and Engagement in CS Education* [18] | Đề xuất phân bậc mức độ tham gia của người học | Thiết kế tính năng tương tác |
| Shaffer và cs. (2010), *Algorithm Visualization: The State of the Field* [19] | Khảo sát hơn 500 công cụ minh họa thuật toán, chỉ ra nhiều công cụ chất lượng thấp, thiếu đánh giá | Khuyết điểm của nhóm B Tin học |
| Wieman, Adams, Perkins (2008), *PhET: Simulations That Enhance Learning* [7] | Mô phỏng tương tác giúp học Vật lý hiệu quả | Cơ sở cho module Vật lý |
| Banda & Nzabahimana (2021) [20] | Tổng quan 31 nghiên cứu về tác động của PhET | Ch.1, cột Hiệu suất của PhET |

## 2.4. Phân tích theo từng công đoạn: đã làm được gì và còn thiếu gì

### C1 – Biểu diễn dữ liệu
- **Đã có:** mô hình dữ liệu riêng cho từng bài (mảng, đồ thị, lưới, trạng thái vật lý).
- **Còn thiếu:** chưa có mô hình dữ liệu **thống nhất** để cùng một engine vẽ cả thuật toán lẫn mô phỏng vật lý.

### C2 – Tính toán
- **Độ chính xác:** Euler hiện là cách tích phân đơn giản nhất nhưng làm năng lượng của hệ dao động tăng dần; Verlet và RK4 cho sai số nhỏ hơn (Ch.3 mục 3.4). Các ứng dụng nhóm B không hiển thị sai số tích phân cho người học (Bảng 2.2, cột C2).
- **Độ phức tạp:** VisuAlgo và algorithm-visualizer minh họa với số phần tử nhỏ, mỗi phần tử là một phần tử trang; chưa thấy công cụ nào cho người học so sánh số bước/số ô duyệt giữa các thuật toán cùng bài toán (Dijkstra so với A\*).
- **Còn thiếu:** các hiện tượng cần tính trên từng điểm của vùng 2D (giao thoa sóng, trường điện) thường tính trên CPU; tính **từng điểm ảnh trên GPU** mới có ở Falstad Ripple Tank.

### C3 – Ánh xạ hình học 2D
- **Đã có:** mỗi ứng dụng tự định nghĩa cách vẽ cột/node/vector; thư viện (PixiJS) tự chia hình thành tam giác.
- **Còn thiếu:** hiếm có mô tả rõ cách chuyển đối tượng giáo dục thành primitive GPU (tứ giác, bản sao) để vẽ hàng loạt. **Đường cong bị chia thành đoạn thẳng** trước khi lên GPU, nên lộ cạnh khi phóng to; các bài báo nhóm C khắc phục được nhưng phần lớn không chạy trên WebGL.

### C4 – Render
- **Đã có:** SVG và Canvas 2D phổ biến nhất trong ứng dụng giáo dục; PixiJS và WebGL cho hiệu năng cao hơn [6]; WebGPU đang bắt đầu.
- **Còn thiếu:** thiếu số liệu so sánh **Canvas 2D – thư viện WebGL – WebGL thuần** trên **cùng một kịch bản giáo dục**, với độ đo rõ (thời gian khung hình, FPS theo số đối tượng), kèm mô tả môi trường đo.

### C5 – Tương tác và điều khiển thời gian
- **Đã có:** thanh trượt, kéo-thả, play/pause/step (VisuAlgo, PhET).
- **Còn thiếu:** cơ chế **ghi lại chuỗi bước rồi phát lại** (tua, chậm/nhanh) dùng chung cho nhiều thuật toán, tách biệt phần tính toán khỏi phần hiển thị; chọn đúng đối tượng khi có hàng nghìn phần tử vẽ bằng WebGL.

## 2.5. Tổng hợp khuyết điểm còn tồn đọng

| STT | Khuyết điểm | Công đoạn | Cần cải thiện |
| :---- | :---- | :---- | :---- |
| 1 | Mỗi mô phỏng/thuật toán một cách cài đặt riêng, không có engine chung | C1, C3 | Khả năng tái sử dụng |
| 2 | Ít số liệu hiệu năng theo số đối tượng trên bài toán giáo dục | C4 | **Độ phức tạp tính toán** |
| 3 | Sai số số học của Euler/Verlet/RK4 ít được trực quan hóa | C2 | **Độ chính xác** |
| 4 | Hiện tượng liên tục (sóng, trường) tính trên CPU | C2, C4 | Độ chính xác và tốc độ (GPU) |
| 5 | Thiếu so sánh trực quan giữa các thuật toán cùng bài toán (Dijkstra vs A\*) với số bước/số ô duyệt | C2, C5 | Độ phức tạp thuật toán |
| 6 | Các ứng dụng tách riêng từng môn | Toàn bộ | Tính tổng hợp Tin học + Vật lý |
| 7 | Đường cong bị chia thành đoạn thẳng nên lộ cạnh khi phóng to; kỹ thuật GPU tiên tiến (nhóm C) phần lớn cần tính năng ngoài WebGL | C3, C4 | **Độ chính xác** hình học |

## 2.6. Mục tiêu của đồ án

Như yêu cầu của môn học, đồ án **đọc hiểu và cài đặt lại** các giải pháp đã công bố, chưa đòi hỏi đề xuất phương pháp mới. Từ các khuyết điểm ở mục 2.5, đồ án đặt mục tiêu:

1. **Xây một engine chung** (framework 5 công đoạn) phục vụ cả module Tin học và Vật lý, mỗi demo có chế độ tĩnh và động → khuyết điểm 1, 6.
2. **Cài đặt lại hai hướng render tiêu biểu** của giai đoạn 3: thư viện WebGL 2D (PixiJS) và WebGL 2 thuần (instancing + fragment shader), kèm Canvas 2D làm đối chứng → khuyết điểm 2, 4.
3. **Cài đặt và so sánh** ba phương pháp tích phân số (Euler, Verlet, RK4) và hai thuật toán tìm đường (Dijkstra, A\*) với độ đo rõ ràng: sai số so với nghiệm giải tích, năng lượng theo thời gian, số ô duyệt, thời gian chạy → khuyết điểm 3, 5.
4. **Giải pháp nền trình bày ở Chương 3:** **pipeline WebGL 2 (vertex buffer → vertex shader → raster hóa → fragment shader) cùng kỹ thuật instancing**, vì đây là giải pháp phổ biến, ổn định trên mọi trình duyệt, và là nền tảng bên dưới PixiJS. Đây là kỹ thuật nền dựa trên đặc tả [13], không phải một bài báo riêng.
5. **Phương pháp cải tiến đã công bố trình bày ở Chương 3:** **Loop & Blinn (2005)** [1] thay bước "chia đường cong thành đoạn thẳng" (C3–C4) bằng "tính phương trình ẩn u² − v tại từng điểm ảnh", nên đường cong đúng hình ở mọi mức phóng to mà chỉ cần 4 đỉnh. Đồ án cài lại phần Bézier bậc 2, áp dụng vẽ quỹ đạo ném xiên (một parabol, đúng một Bézier bậc 2), rồi đo kiểm chứng → khuyết điểm 7. Đây là cải tiến của bài báo, không phải của nhóm.

**Bảng 2.4 – Lý do chọn Loop & Blinn làm phương pháp cải tiến**
| Tiêu chí | Kilgard & Bolz / Ganacim / Li | Green 2007 | **Loop & Blinn 2005 (chọn)** |
|---|---|---|---|
| Đã công bố, uy tín | ACM TOG | SIGGRAPH 2007 Courses | ACM TOG (SIGGRAPH 2005) |
| Chạy được trên WebGL | Không (phần mở rộng NVIDIA, CUDA, tính toán đa dụng) | Có | Có, chỉ cần fragment shader |
| Khớp với cảnh cần vẽ trong ứng dụng | Vẽ path tổng quát, rộng hơn nhu cầu | Chỉ cho chữ, hình đơn sắc | Quỹ đạo ném xiên là một parabol, tức đúng một Bézier bậc 2 |
| Cài lại vừa sức, đo được | Không cài được trên trình duyệt | Có | Có: phần bậc 2; bậc 3 để làm hướng phát triển |

Báo cáo **không tự nhận** nhanh hơn hay đẹp hơn các bài kỹ thuật (nhóm không cài lại thuật toán của họ), cũng không tự nhận giúp học tốt hơn PhET (nhóm không đo hiệu quả học tập).

WebGPU được xem là **hướng phát triển** (Ch.5) do mức hỗ trợ còn phụ thuộc nền tảng.

| Khuyết điểm (2.5) | Đồ án giải quyết bằng | Thử nghiệm kiểm chứng (Ch.4) |
| :---- | :---- | :---- |
| 1, 6 | Engine chung + 2 module | Các bài minh họa (mục 4.2) |
| 2 | PixiJS / WebGL 2 thuần / Canvas 2D | (a) Hiệu năng render: thời gian khung hình, FPS theo 1k → 100k đối tượng |
| 2 | Instancing | (d) 1 lệnh vẽ so với N lệnh vẽ |
| 3 | Euler – Verlet – RK4 | (b) Sai số, năng lượng theo thời gian |
| 4 | Fragment shader tính từng điểm ảnh | (e) GPU so với CPU (giao thoa sóng) |
| 5 | Dijkstra vs A\* | (c) Số ô duyệt, thời gian chạy |
| 7 | **Loop & Blinn (phương pháp cải tiến)** | **(f) Loop & Blinn so với chia đoạn thẳng: sai số hình học, độ phủ, số đỉnh** |
| C5 (chọn đối tượng) | Hit-test, GPU picking | (g) Thời gian chọn, tỉ lệ chọn đúng *(tùy chọn)* |

**Kết chương.** Tóm lại, các ứng dụng giáo dục như PhET [7] hay VisuAlgo [9] đã giải tốt bài toán trực quan hóa đúng và dễ hiểu, nhưng phần lớn vẽ bằng SVG hoặc phần tử trang và không công bố số liệu hiệu năng. Các kỹ thuật vẽ 2D tiên tiến trên GPU (Kilgard và Bolz, 2012 [3]; Ganacim và cộng sự, 2014 [4]; Li và cộng sự, 2016 [5]) cần những tính năng chưa có trong WebGL. Đồ án vì vậy chọn pipeline WebGL 2 kết hợp instancing làm giải pháp nền, và phương pháp của Loop và Blinn (2005) [1], chỉ cần fragment shader, làm phương pháp cải tiến cho bước vẽ đường cong; Chương 3 trình bày hai giải pháp này, Chương 4 kiểm chứng chúng bằng bảy thử nghiệm.

## Tài liệu tham khảo

Danh mục đầy đủ [1]–[25] của cả báo cáo ở `Tai lieu tham khao.md`.

---

## Việc còn lại trước khi nộp (không đưa vào báo cáo)
- **Li et al. 2016:** số liệu hiện lấy từ tóm tắt chính thức trên ACM; nếu tải được toàn văn thì ghi thêm GPU và bộ dữ liệu thử nghiệm.
- **PhET:** số 236 hình SVG là nhóm đếm ngày 09/11/2026 trên bài Projectile Motion; chụp màn hình lưu vào `Data/screenshots/` làm bằng chứng.
- **VisuAlgo (D3, SVG) và algorithm-visualizer (bảng HTML, SVG):** là nhóm quan sát trang và mã nguồn; chụp màn hình công cụ kiểm tra phần tử (DevTools) lưu vào `Data/screenshots/`.

**Đã kiểm chứng ngày 14/11/2026:** 10 DOI qua Crossref (tên bài, tập, số, trang); poster Horak 2018 (đọc toàn văn); Green 2007 (đọc toàn văn mục 2.4–2.7); mã nguồn Falstad Ripple Tank; tóm tắt Li 2016; WebGPU (web.dev 25/11/2025); VisuAlgo khởi đầu 2011 (NUS); PixiJS v8.1.0; Safari 15.
