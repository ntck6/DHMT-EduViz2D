# **Chương 2\. Các công trình nghiên cứu liên quan**

## **2.1. Mục đích và cách tiếp cận khảo sát**

Để các giải pháp so sánh được với nhau, mọi công trình đều được trình bày **theo cùng một dàn bài**, bám sát 5 công đoạn của framework chung đã nêu ở mục 1.3 (chưa gắn với phương pháp cụ thể):

| Công đoạn | Tên | Ẩn số cần xác định ở công đoạn này |
| :---- | :---- | :---- |
| **C1** | Biểu diễn dữ liệu / tham số bài học (Input) | Dữ liệu được mô hình hóa thế nào (mảng, đồ thị, lưới, trạng thái vật lý)? Những tham số nào người học được chỉnh? |
| **C2** | Mô hình hóa & tính toán | Dùng thuật toán/công thức gì? Tính ở đâu (CPU hay GPU)? Sai số số học và độ phức tạp ra sao? |
| **C3** | Ánh xạ sang hình học 2D | Mỗi đối tượng (cột, node, vật, điểm sóng) được chuyển thành primitive nào (điểm, đoạn, tam giác, texture)? |
| **C4** | Render | Dùng API nào (DOM/SVG, Canvas 2D, WebGL, WebGPU)? Kỹ thuật tối ưu nào (batching, instancing, shader)? |
| **C5** | Tương tác & điều khiển thời gian | Chế độ tĩnh/động; play/pause/step/tua; kéo-thả; đồng bộ khung hình |

Hai độ đo dùng xuyên suốt để nhận xét ưu/nhược của từng giải pháp (đúng yêu cầu môn học):

•       **Độ chính xác:** sai số số học của mô phỏng (so với nghiệm giải tích), độ đúng của chuỗi bước thuật toán được vẽ.  
•       **Độ phức tạp tính toán:** độ phức tạp thuật toán ở C2 và chi phí render ở C4 (thời gian khung hình, FPS theo số đối tượng).

## **2.2. Tiến trình phát triển của HTML5 \+ WebGL cho đồ họa 2D giáo dục**

Sự phát triển được chia thành 5 giai đoạn. Điểm xuyên suốt là: **(i)** nơi tính toán dần dịch chuyển từ CPU sang GPU, và **(ii)** nền tảng chạy chuyển từ plugin sang chuẩn mở của trình duyệt.

### **Giai đoạn 0 – Trước 2010: ứng dụng giáo dục dựa trên plugin (Java applet, Flash)**

•       Các mô phỏng giáo dục nổi tiếng thời kỳ này (PhET, Falstad…) chạy bằng **Java applet hoặc Flash**; việc vẽ do runtime của plugin đảm nhiệm, nhà phát triển không điều khiển trực tiếp GPU.  
•       Nghiên cứu sư phạm cùng thời kỳ cho thấy hiệu quả của trực quan hóa thuật toán phụ thuộc chủ yếu vào mức độ **người học tương tác (engagement)** chứ không chỉ vào việc “xem animation” (Hundhausen và cs., 2002; Naps và cs., 2002). Đây là cơ sở để C5 (tương tác) trở thành một công đoạn riêng trong framework.  
•       **Hạn chế:** cần cài plugin, không chạy trên di động, khó chia sẻ; Flash chính thức ngừng hỗ trợ cuối năm 2020, các ứng dụng phải chuyển nền tảng.

### **Giai đoạn 1 – 2004–2011: HTML5 \<canvas\> và sự ra đời của WebGL 1.0**

•       Thẻ \<canvas\> (Apple đưa vào WebKit năm 2004 (\*), sau đó được chuẩn hóa trong HTML5) cho phép vẽ 2D bằng JavaScript ngay trong trang web, kết hợp requestAnimationFrame để tạo chế độ động và Pointer/Mouse Events để tương tác – **đáp ứng đủ C4 và C5 mà không cần plugin**.  
•       **WebGL 1.0** (Khronos, 2011), dựa trên OpenGL ES 2.0, đưa pipeline đồ họa lập trình được (vertex shader – rasterization – fragment shader) vào trình duyệt. Về nguyên tắc, mọi đối tượng 2D có thể vẽ bằng tam giác trên GPU.  
•       **Hạn chế:** Canvas 2D do CPU điều phối từng lệnh vẽ, chi phí tăng nhanh theo số đối tượng; WebGL thuần có API cấp thấp, rất dài dòng cho bài toán 2D thông thường.

### **Giai đoạn 2 – 2011–2016: di cư sang HTML5 và các thư viện trung gian**

•       Các nền tảng giáo dục lớn chuyển từ plugin sang HTML5/JavaScript: **PhET** (chuyển dần các mô phỏng sang HTML5), **GeoGebra** (bản HTML5), **Falstad** (bản JavaScript) (\*). Các công cụ trực quan hóa thuật toán thế hệ mới như **VisuAlgo** (từ 2011\) và **algorithm-visualizer.org** chạy hoàn toàn trên trình duyệt (\*).  
•       Xuất hiện các thư viện che bớt sự phức tạp của WebGL: **Three.js** (2010, thiên về 3D), **PixiJS** (2013, renderer 2D dùng WebGL, tự gom lệnh vẽ – *batching*), **regl** (functional WebGL), chế độ WEBGL của **p5.js**; **Matter.js** (2014) cho vật lý 2D thời gian thực trên Canvas.  
•       **Shadertoy** (2013) phổ biến hóa cách “tính toán trên mỗi pixel bằng fragment shader”, nhờ đó các hiện tượng như sóng, nhiễu xạ, trường vô hướng có thể vẽ ở tốc độ thời gian thực.  
•       **Hạn chế:** phần lớn ứng dụng giáo dục vẫn **tính toán trên CPU** và chỉ dùng GPU (nếu có) để vẽ; số đối tượng mượt bị giới hạn ở mức vài nghìn.

### **Giai đoạn 3 – 2017–2022: WebGL 2 và GPGPU bằng shader**

•       **WebGL 2.0** (dựa trên OpenGL ES 3.0) có mặt trên Chrome/Firefox từ 2017 và đến Safari muộn hơn (2021) (\*), nên đến khoảng 2022 có thể coi là **được hỗ trợ trên mọi trình duyệt chính**. Các tính năng quan trọng cho 2D: **instanced drawing** (drawArraysInstanced – vẽ hàng chục nghìn bản sao một hình bằng một lệnh), transform feedback, texture dạng số thực, GLSL ES 3.00.  
•       Xuất hiện các mô phỏng 2D thời gian thực chạy **toàn bộ trên GPU**: ví dụ mô phỏng chất lỏng WebGL (Pavel Dobryakov, 2017 (\*)), hệ hạt tính trong texture/transform feedback, trình vẽ đồ thị hàm số dùng shader (Desmos được cho là dùng WebGL để vẽ đồ thị (\*)).  
•       Với giáo dục: các sản phẩm thế hệ mới (PhET, GeoGebra, VisuAlgo…) hoàn tất việc chuyển sang web; bài toán chuyển từ “chạy được trên web” sang **“chạy mượt với dữ liệu lớn và tương tác trực tiếp”**.  
•       **Hạn chế:** GPGPU qua fragment shader là “mẹo” (phải mã hóa dữ liệu vào texture), khó viết và khó gỡ lỗi; ít ứng dụng giáo dục áp dụng.

### **Giai đoạn 4 – 2023 đến nay: WebGPU và hợp nhất hạ tầng**

•       **WebGPU** có mặt trên Chrome/Edge từ phiên bản 113 (2023); theo bài tổng kết của web.dev (25/11/2025), API này đã được hỗ trợ trên Chrome, Edge, Firefox (Windows từ Firefox 141\) và Safari 26\. Điểm mới quan trọng là **compute shader**, cho phép tính vật lý/hạt trực tiếp trên GPU mà không cần “mẹo” texture.  
•       **PixiJS v8** (2024) bổ sung renderer WebGPU bên cạnh WebGL; ghi chú phát hành của PixiJS cũng cho thấy nhóm tác giả từng thận trọng vì hành vi WebGPU chưa đồng nhất giữa các trình duyệt, nên **WebGL vẫn là lựa chọn ổn định nhất cho ứng dụng giáo dục cần chạy trên nhiều máy** (cần kiểm tra lại renderer mặc định của phiên bản đang dùng (\*)).  
•       **Hạn chế:** phụ thuộc phiên bản hệ điều hành/driver/GPU, tài liệu và ví dụ giáo dục còn ít so với WebGL.

### **Tóm tắt tiến trình (theo hai trục)**

| Giai đoạn | Nền tảng chạy (C4) | Nơi tính toán chính (C2) | Điểm đổi mới | Thách thức còn lại |
| :---- | :---- | :---- | :---- | :---- |
| 0 (≤2010) | Plugin Java/Flash | CPU | Mô phỏng tương tác đầu tiên | Cần plugin, không di động |
| 1 (2004–2011) | Canvas 2D / WebGL 1 | CPU | Chuẩn mở trong trình duyệt | Số đối tượng bị giới hạn; WebGL quá cấp thấp |
| 2 (2011–2016) | Canvas \+ thư viện WebGL 2D | CPU | Thư viện (PixiJS…), shader trên pixel | Tính toán vẫn ở CPU |
| 3 (2017–2022) | WebGL 2 (instancing, shader) | CPU \+ GPU (qua texture) | Vẽ 10⁴–10⁵ đối tượng; mô phỏng trên GPU | GPGPU khó viết |
| 4 (2023–nay) | WebGPU \+ WebGL | GPU (compute shader) | Compute pipeline | Tương thích, ít tài liệu |

## **2.3. Các giải pháp liên quan, trình bày theo cùng dàn bài C1–C5**

Các giải pháp được chia thành hai nhóm: **(A) nhóm kỹ thuật render** (đối chứng của đồ án ở Ch.4a) và **(B) nhóm ứng dụng giáo dục** (đối thủ trực tiếp của EduViz2D).

### **2.3.1. Nhóm A – Các hướng kỹ thuật render 2D trên web**

|   | A1. DOM/SVG | A2. Canvas 2D | A3. Thư viện WebGL 2D (PixiJS, regl…) | A4. WebGL thuần \+ GLSL | A5. WebGPU (compute) |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **C1 Dữ liệu** | Mỗi đối tượng là một phần tử DOM | Mảng đối tượng JS, tự quản lý | Scene graph (Container/Sprite/Graphics) | Buffer/texture do lập trình viên quản lý | Storage buffer / texture |
| **C2 Tính toán** | CPU | CPU | CPU (có thể tách worker) | CPU hoặc GPU (fragment shader, transform feedback) | GPU compute shader |
| **C3 Ánh xạ hình học** | Thuộc tính thuộc phần tử | Lệnh vẽ path/rect | Sprite/mesh → tam giác, gom batch tự động | Tự thiết kế vertex data, instance attribute | Tự thiết kế |
| **C4 Render** | Trình duyệt tự layout/paint | Rasterize bằng CPU/GPU theo trình duyệt, từng lệnh | Gom batch, texture atlas, ParticleContainer | drawArraysInstanced, shader tùy ý | Render bundle, pipeline mới |
| **C5 Tương tác** | Sự kiện DOM có sẵn, dễ nhất | Tự hit-test | Hệ thống event có sẵn trên scene graph | Tự hit-test (picking) | Tự hit-test |
| **Độ phức tạp cài đặt** | Thấp | Thấp | Trung bình | Cao | Cao |
| **Quy mô đối tượng** | Thấp (nghìn) | Trung bình | Cao | Rất cao | Rất cao (kèm compute) |
| **Khuyết điểm chính** | Chậm khi nhiều đối tượng | Chi phí tăng tuyến tính theo số lệnh vẽ | Che giấu pipeline; tối ưu phụ thuộc thư viện | Dài dòng, dễ lỗi | Tương thích trình duyệt chưa đồng đều |

*Nhận xét:* với dữ liệu nhỏ, mọi hướng đều đủ dùng; khác biệt chỉ lộ ra khi số đối tượng và tần suất cập nhật tăng. Việc **định lượng khác biệt này cho đúng bài toán giáo dục** (cột sắp xếp, node đồ thị, hạt) là khoảng trống mà Ch.4a của đồ án nhắm đến.

### **2.3.2. Nhóm B – Các ứng dụng giáo dục tiêu biểu**

|   | PhET | Falstad | GeoGebra | Desmos | VisuAlgo | algorithm-visualizer.org |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Môn học** | Vật lý, Hóa, Toán… | Vật lý (điện, sóng, cơ) | Toán | Toán | Tin học (CTDL & GT) | Tin học (thuật toán) |
| **C1 Dữ liệu** | Tham số mô hình cố định theo từng sim, chỉnh bằng slider | Tham số mạch/trường, chỉnh bằng slider | Đối tượng hình học/công thức | Biểu thức người dùng nhập | Dữ liệu người dùng nhập hoặc ngẫu nhiên | Code người dùng viết \+ dữ liệu mẫu |
| **C2 Tính toán** | Mô hình vật lý viết sẵn, CPU | Giải số (tích phân/ lưới) trên CPU | Engine đại số/hình học CPU | Đánh giá biểu thức (\*) | Thuật toán chạy sẵn, ghi lại các bước | Thuật toán chạy, ghi lại “vết” (tracer) |
| **C3 Ánh xạ 2D** | Sprite/đồ họa tùy sim | Đồ họa 2D tự vẽ | Đối tượng hình học | Đường cong từ mẫu điểm | Cột/node/cạnh | Cột/node/biểu đồ |
| **C4 Render** | HTML5 (Canvas/WebGL tùy sim) (\*) | Canvas (\*) | HTML5 Canvas/SVG (\*) | WebGL (\*) | HTML5, ưu tiên rõ ràng hơn hiệu năng (\*) | HTML5 (\*) |
| **C5 Tương tác** | Kéo-thả, slider, play/pause/step | Slider, chuột, play/pause | Kéo-thả, dựng hình | Slider, kéo điểm | Play/pause/step/tua từng bước | Chạy/dừng/bước theo code |
| **Tĩnh/Động** | Cả hai | Cả hai | Cả hai | Cả hai | Chủ yếu động theo bước | Chủ yếu động theo bước |
| **Mã nguồn mở** | Có (\*) | Có (\*) | Một phần (\*) | Không (\*) | Không hoàn toàn (\*) | Có |
| **Khuyết điểm** | Mỗi sim độc lập, không thống nhất engine; không nhắm đến benchmark GPU | Giao diện cũ, không đa môn | Không tập trung thuật toán/mô phỏng vật lý | Chỉ Toán | Quy mô dữ liệu nhỏ; không so sánh được Tin học với Vật lý | Chưa có phần Vật lý; hiệu năng với dữ liệu lớn chưa là trọng tâm |

*Nhận xét:* các ứng dụng này đã giải tốt bài toán **“trực quan hóa đúng và dễ hiểu”**, nhưng thường (i) tách rời từng môn, mỗi mô phỏng một cách cài đặt riêng, (ii) ít công bố số liệu về **hiệu năng theo số đối tượng** và (iii) ít so sánh **sai số của các phương pháp tích phân số** ngay trong giao diện.

### **2.3.3. Các nghiên cứu nền tảng về hiệu quả giáo dục**

| Công trình | Nội dung chính | Dùng cho |
| :---- | :---- | :---- |
| Hundhausen, Douglas, Stasko (2002), *A Meta-Study of Algorithm Visualization Effectiveness* | Tổng hợp nhiều thực nghiệm; hiệu quả phụ thuộc cách người học tham gia, không chỉ do hình ảnh | Động lực cho C5 (tương tác), Ch.1 |
| Naps và cs. (2002), *Exploring the Role of Visualization and Engagement in CS Education* | Đề xuất phân bậc mức độ tham gia của người học | Thiết kế tính năng tương tác |
| Shaffer và cs. (2010), *Algorithm Visualization: The State of the Field* (ACM TOCE) | Khảo sát hiện trạng, chỉ ra nhiều công cụ chất lượng thấp, thiếu đánh giá | Khuyết điểm của nhóm B Tin học |
| Wieman, Adams, Perkins (2008), *PhET: Simulations That Enhance Learning* (Science) | Mô phỏng tương tác giúp học Vật lý hiệu quả | Cơ sở cho module Vật lý |

*(Cả nhóm kiểm tra lại thông tin thư mục trước khi đưa vào danh mục tham khảo.)*

## **2.4. Phân tích theo từng công đoạn: đã làm được gì và còn thiếu gì**

### **C1 – Biểu diễn dữ liệu**

•       **Đã có:** mô hình dữ liệu riêng cho từng bài (mảng, đồ thị, lưới, trạng thái vật lý).  
•       **Còn thiếu:** chưa có mô hình dữ liệu **thống nhất** để cùng một engine vẽ cả thuật toán lẫn mô phỏng vật lý.

### **C2 – Tính toán**

•       **Độ chính xác:** các mô phỏng vật lý trong web thường dùng Euler đơn giản vì dễ cài; sai số tích lũy (năng lượng trôi) ít được người học nhìn thấy. Verlet và RK4 được biết đến trong giáo trình/game physics nhưng hiếm khi **so sánh trực quan** với nghiệm giải tích trong ứng dụng giáo dục.  
•       **Độ phức tạp:** thuật toán sắp xếp/đồ thị được minh họa với n nhỏ; ít công cụ cho thấy ảnh hưởng của độ phức tạp (O(n²) so với O(n log n), Dijkstra so với A\*) khi n lên đến hàng chục nghìn.  
•       **Còn thiếu:** các hiện tượng cần tính trên từng điểm của vùng 2D (giao thoa sóng, trường điện) thường lấy mẫu thưa trên CPU thay vì tính **từng pixel trên GPU**.

### **C3 – Ánh xạ hình học 2D**

•       **Đã có:** mỗi ứng dụng tự định nghĩa cách vẽ cột/node/vector.  
•       **Còn thiếu:** hiếm có mô tả rõ cách chuyển đối tượng giáo dục thành primitive GPU (quad, instance) để vẽ hàng loạt.

### **C4 – Render**

•       **Đã có:** Canvas 2D phổ biến nhất; PixiJS và WebGL cho hiệu năng cao hơn; WebGPU đang bắt đầu.  
•       **Còn thiếu:** thiếu số liệu so sánh **Canvas 2D – thư viện WebGL – WebGL thuần** trên **cùng một kịch bản giáo dục**, với độ đo rõ (frame time, FPS theo số đối tượng), kèm mô tả môi trường đo.

### **C5 – Tương tác & điều khiển thời gian**

•       **Đã có:** slider, kéo-thả, play/pause/step (VisuAlgo, PhET).  
•       **Còn thiếu:** cơ chế **ghi lại chuỗi bước rồi phát lại** (tua, chậm/nhanh) dùng chung cho nhiều thuật toán, đồng thời tách biệt phần tính toán khỏi phần hiển thị.

## **2.5. Tổng hợp khuyết điểm còn tồn đọng**

| STT | Khuyết điểm | Công đoạn | Cần cải thiện |
| :---- | :---- | :---- | :---- |
| 1 | Mỗi mô phỏng/thuật toán một cách cài đặt riêng, không có engine chung | C1, C3 | Khả năng tái sử dụng |
| 2 | Ít số liệu hiệu năng theo số đối tượng trên bài toán giáo dục | C4 | **Độ phức tạp tính toán** |
| 3 | Sai số số học của Euler/Verlet/RK4 ít được trực quan hóa | C2 | **Độ chính xác** |
| 4 | Hiện tượng liên tục (sóng, trường) tính thưa trên CPU | C2, C4 | Độ chính xác và tốc độ (GPU) |
| 5 | Thiếu so sánh trực quan giữa các thuật toán cùng bài toán (Dijkstra vs A\*) với số bước/node duyệt | C2, C5 | Độ phức tạp thuật toán |
| 6 | Các ứng dụng tách riêng từng môn | Toàn bộ | Tính tổng hợp Tin học \+ Vật lý |

## **2.6. Mục tiêu của đồ án**

Như yêu cầu của môn học, đồ án **đọc hiểu và cài đặt lại** các giải pháp đã công bố, chưa đòi hỏi đề xuất phương pháp mới. Từ các khuyết điểm ở mục 2.5, đồ án đặt mục tiêu:

1\.      **Xây một engine chung** (framework 5 công đoạn) phục vụ cả module Tin học và Vật lý, mỗi demo có chế độ tĩnh và động → giải quyết khuyết điểm 1, 6\.  
2\.      **Cài đặt lại hai hướng render tiêu biểu** của giai đoạn 3: thư viện WebGL 2D (PixiJS) và WebGL 2 thuần (instancing \+ fragment shader), kèm Canvas 2D làm đối chứng → giải quyết khuyết điểm 2, 4\.  
3\.      **Cài đặt và so sánh** ba phương pháp tích phân số (Euler, Verlet, RK4) và hai thuật toán tìm đường (Dijkstra, A\*) với độ đo rõ ràng: sai số so với nghiệm giải tích, năng lượng theo thời gian, số node duyệt, thời gian chạy → giải quyết khuyết điểm 3, 5\.  
4\.      **Giải pháp trình bày ở Chương 3:** chọn **pipeline WebGL 2 (vertex buffer → vertex shader → rasterization → fragment shader) cùng kỹ thuật instancing**, vì đây là giải pháp phổ biến, đã ổn định trên mọi trình duyệt, và là nền tảng bên dưới PixiJS. WebGPU được xem là **hướng phát triển** (Ch.5) do mức hỗ trợ phụ thuộc nền tảng.

| Khuyết điểm (2.5) | Đồ án giải quyết bằng | Thử nghiệm kiểm chứng |
| :---- | :---- | :---- |
| 1, 6 | Engine chung \+ 2 module | Demo tích hợp (Ch.4) |
| 2, 4 | PixiJS / WebGL 2 thuần / Canvas 2D | Ch.4(a): FPS, frame time theo 1k → 100k đối tượng |
| 3 | Euler – Verlet – RK4 | Ch.4(b): sai số, năng lượng theo thời gian |
| 5 | Dijkstra vs A\* | Ch.4(c): số node duyệt, thời gian chạy |

