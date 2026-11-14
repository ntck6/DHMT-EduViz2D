# Chương 4. Cài đặt và thử nghiệm

> Bản viết dạng văn của Chương 4. Trích dẫn [n] theo `Tai lieu tham khao.md`.
> **Quy ước:** số liệu ghi **[số chạy thử]** lấy từ lần chạy thử trước khi đo chính thức, phải thay bằng số đo trên máy thật trước khi nộp; ô **[cần số đo]** chưa có công cụ hoặc chưa đo. Nhãn thử nghiệm (a)–(g) trùng với bảng cuối mục 2.6.
> Người viết: A tổng hợp; (f), (a), (d) – A; (b), (e) – C; (c), (g) – B.

## 4.1. Môi trường và cài đặt

### 4.1.1. Mã nguồn có sẵn và tự viết

Ứng dụng EduViz2D được viết bằng HTML5, CSS và JavaScript thuần (ES modules), không qua bước biên dịch, chạy được ngoại tuyến bằng một máy chủ tĩnh như Live Server. Phần vẽ gồm hai lớp chồng lên nhau: thư viện PixiJS 8.22.0 [14] vẽ hệ trục, chữ và các đối tượng thông thường; lớp WebGL 2 do nhóm tự viết thực hiện các kỹ thuật được trình bày ở Chương 3. Bảng 4.1 tách rõ phần tận dụng mã có sẵn và phần nhóm tự viết.

**Bảng 4.1 – Mã nguồn có sẵn và tự viết**
| Phần | Có sẵn (dùng lại) | Nhóm tự viết | Dùng cho |
|---|---|---|---|
| Vẽ đối tượng, chữ, sự kiện | PixiJS 8.22.0: đồ thị cảnh, gộp lệnh vẽ, BitmapText, hệ sự kiện | Khung ứng dụng `js/core/`: bảng điều khiển, phát lại, khung nhìn, xuất ảnh | Các bài minh họa; đối chứng ở (a) |
| Pipeline WebGL 2 | API WebGL 2 của trình duyệt [13] | `js/webgl/`: context, shader, bộ đệm, ma trận, chia tam giác, instancing, GPU picking | Giải pháp nền (3.2); (a), (d), (g) |
| Loop và Blinn | Thuật toán trong bài báo [1] (không có mã mẫu) | `loop-blinn.js`, `curve-math.js`; mốc so sánh `polyline.js` | Phương pháp cải tiến (3.3); (f) |
| Trang đo | Không có, nhóm tự viết toàn bộ | `benchmark/`: Canvas 2D, PixiJS, WebGL thuần; đo sai số đường cong | (a), (f) |
| Mô phỏng, thuật toán | Công thức trong giáo trình [25], giả mã chuẩn | Ba phương pháp tích phân, Dijkstra, A*, sắp xếp bằng generator | (b), (c) |
| Kiểm thử | Node.js, lệnh `node --test` | 35 kiểm thử: công thức đường cong, ma trận, chia tam giác, đo sai số, mô hình ném xiên | Bảo đảm đúng trước khi đo |

### 4.1.2. Môi trường đo

Các trang thử nghiệm tự ghi tên GPU, trình duyệt, kích thước khung vẽ và `devicePixelRatio` vào mỗi tệp kết quả CSV. Máy có hai GPU (tích hợp và rời) có thể được trình duyệt chọn khác nhau giữa các lần chạy, nên mọi số liệu đều đi kèm tên GPU của lần đo đó. Khi đo, cửa sổ trình duyệt phải hiện trên màn hình và các thẻ khác được đóng.

**Bảng 4.2 – Môi trường đo**
| | Máy 1 | Máy 2 |
|---|---|---|
| CPU | [cần số đo] | [cần số đo] |
| RAM | [cần số đo] | [cần số đo] |
| GPU | [cần số đo] | [cần số đo] |
| Hệ điều hành | [cần số đo] | [cần số đo] |
| Trình duyệt, phiên bản | [cần số đo] | [cần số đo] |
| Độ phân giải màn hình, `devicePixelRatio` | [cần số đo] | [cần số đo] |
| Phần mềm | HTML5, JavaScript ES2020, WebGL 2, PixiJS 8.22.0 | Như máy 1 |

## 4.2. Các bài minh họa

Bảng 4.3 liệt kê các bài trong ứng dụng và tác vụ đồ họa mà mỗi bài minh họa.

**Bảng 4.3 – Các bài minh họa và tác vụ đồ họa**
| Bài | Tác vụ HTML5 / WebGL minh họa | Tĩnh / động | Tương tác trực tiếp |
|---|---|---|---|
| Ném xiên | **Phương pháp cải tiến:** đường cong bằng Loop và Blinn; phóng to 1×–64×; scissor test; chuyển động theo thời gian | Cả hai | Đổi cách vẽ, phóng to; kéo mũi tên vận tốc, bắn trúng bia |
| Sắp xếp | Nhiều hình bằng instancing (giải pháp nền); chọn cột bằng hit-test | Động | Kéo-thả đổi chỗ, vẽ dữ liệu bằng chuột |
| BFS / DFS / Dijkstra | Chọn đỉnh bằng GPU picking; chữ bằng BitmapText | Cả hai | Kéo đỉnh, thêm đỉnh và cạnh |
| A* | Lưới nhiều ô cập nhật theo bước; chạy cạnh Dijkstra để so số ô duyệt (c) | Động | Vẽ tường, kéo điểm đầu và đích |
| Con lắc / lò xo | Vòng cập nhật theo Δt; ba phương pháp tích phân chạy cạnh nhau (b) | Động | Kéo quả nặng rồi thả |
| Giao thoa sóng | Tính màu từng điểm ảnh bằng fragment shader; bản CPU để so sánh (e) | Động | Kéo hai nguồn |
| Pipeline WebGL từng bước | Giải pháp nền: toàn bộ pipeline WebGL thuần; đo instancing (d) | Cả hai | Kéo đỉnh, GPU picking |

**Ném xiên.** Quỹ đạo được vẽ bằng Loop và Blinn trên lớp WebGL; người học có thể đổi sang cách chia 120 đoạn thẳng và phóng to quanh đỉnh quỹ đạo để thấy đường gấp khúc lộ cạnh còn đường Loop và Blinn vẫn mịn. Scissor test giới hạn vùng vẽ trong khung đồ thị khi phóng to. *[Hình 4.1]*

**Sắp xếp.** Mỗi phần tử của mảng là một hình chữ nhật; toàn bộ N hình được vẽ bằng một lệnh `drawArraysInstanced` (Mục 3.2.3). Khi người học kéo một cột, chỉ số cột được tính trực tiếp từ tọa độ chuột (Bảng 3.4) và chỉ dữ liệu của hai cột đổi chỗ được gửi lại lên GPU. Trong lúc thuật toán chạy, thao tác kéo-thả bị khóa để dữ liệu không bị đổi giữa chừng. *[Hình 4.2]*

**BFS / DFS / Dijkstra.** Các đỉnh của đồ thị được chọn bằng GPU picking, nên chọn đúng cả khi đỉnh nhỏ hay nằm sát nhau; nhãn đỉnh vẽ bằng BitmapText để tránh chi phí vẽ chữ mà Horak và cộng sự ghi nhận [6]. *[Hình 4.3]*

**A\*.** Lưới ô vuông cập nhật màu theo từng bước duyệt; A* và Dijkstra chạy trên cùng bản đồ để người học so sánh số ô đã duyệt. *[Hình 4.4]*

**Con lắc / lò xo.** Ba vật được tính bằng Euler, Verlet và RK4 chạy cạnh nhau với cùng Δt, kèm đồ thị năng lượng theo thời gian. *[Hình 4.5]*

**Giao thoa sóng.** Màu của từng điểm ảnh được fragment shader tính theo biên độ tổng hợp (Mục 3.5). *[Hình 4.6]*

**Pipeline WebGL từng bước.** Người học đi qua lần lượt các bước của giải pháp nền với một ngôi sao lõm 14 đỉnh và 1 đến 10.000 bản sao instancing; ứng dụng hiện số lệnh vẽ và thời gian CPU của mỗi khung hình. *[Hình 4.7]*

## 4.3. Bộ thử nghiệm

Bài toán vẽ 2D trên web không có tập dữ liệu chuẩn như các bài toán nhận dạng, nên nhóm tự xây bộ kịch bản cho từng thử nghiệm và ghi rõ số mẫu, tiêu chí, đáp án đúng (Bảng 4.4). Đồ án không có giai đoạn huấn luyện, nên không có hàm mất mát hay dữ liệu gán nhãn; vai trò "đáp án đúng" được thay bằng đường cong thật tính từ phương trình (f), nghiệm giải tích (b), đường ngắn nhất do Dijkstra tìm được (c), ảnh tính trên CPU (e) và vị trí đối tượng đã biết (g). Dữ liệu kết quả lưu ở thư mục Data.

**Bảng 4.4 – Bộ thử nghiệm**
| Thử nghiệm | Vai trò | Mục đích | Bộ kịch bản (số mẫu) | Tiêu chí, thách thức | Đáp án / mốc so sánh |
|---|---|---|---|---|---|
| **(f) Loop và Blinn** | **Chính** – kiểm chứng phương pháp cải tiến | Đường cong có giữ đúng và mịn khi phóng to như bài báo khẳng định không; tốn bao nhiêu | 1 quỹ đạo (20 m/s, 45°) × 3 cách vẽ (Loop và Blinn, 120 đoạn, 30 đoạn) × 4 mức phóng to (1×, 4×, 16×, 64×) = 12 cấu hình, mỗi cấu hình vẽ 200 lần; nét 2 điểm ảnh; khung 960 × 540, pixel ratio 1 | Phóng to lớn là trường hợp khó cho cách chia đoạn thẳng | Đường cong thật (phương trình); chia đoạn thẳng là mốc |
| (a) Hiệu năng render | Giải pháp nền | Pipeline WebGL chịu được bao nhiêu đối tượng | N hình vuông 4 × 4 điểm ảnh chuyển động, cùng một cảnh có hạt giống ngẫu nhiên cố định; 3 cách vẽ × 5 mức N (1.000; 5.000; 10.000; 50.000; 100.000) × có/không nhãn chữ = 30 cấu hình; khởi động 1 s, đo 3 s | Trục N theo thang log để thấy điểm gãy (như Horak và cộng sự [6]); chữ là trường hợp khó | Canvas 2D, PixiJS |
| (d) Instancing | Giải pháp nền | 1 lệnh vẽ so với N lệnh vẽ | Ngôi sao 14 đỉnh, 1; 10; 100; 1.000; 10.000 bản sao | Nhiều bản sao làm lộ chi phí mỗi lệnh vẽ | Vòng lặp `drawElements` |
| (e) Tính theo điểm ảnh | Giải pháp nền | GPU nhanh hơn CPU bao nhiêu khi tính màu từng điểm ảnh | Giao thoa sóng ở 4 độ phân giải (480 × 270 đến 1920 × 1080) | Số điểm ảnh tăng theo bình phương kích thước | Bản CPU (Canvas 2D `ImageData`); hai bản phải cho cùng ảnh |
| (b) Tích phân số | C2 – dữ liệu cho phần vẽ | Euler, Verlet, RK4 sai bao nhiêu so với nghiệm đúng | Lò xo không ma sát, 3 phương pháp × 3 bước Δt (1/30, 1/60, 1/120 s) × 10 chu kỳ | Bước lớn, thời gian dài làm sai số tích lũy | Nghiệm x(t) = A cos(ωt); năng lượng E không đổi |
| (c) Dijkstra / A* | C2 – dữ liệu cho phần vẽ | A* duyệt ít ô hơn Dijkstra bao nhiêu; đường đi có cùng độ dài không | Lưới 20², 50², 100² × mật độ tường 0 %, 20 %, 30 % × 10 cặp điểm ngẫu nhiên (hạt giống cố định) = 90 lần chạy | Tường dày, đích bị che làm heuristic kém hiệu quả | Độ dài đường của Dijkstra |
| (g) Chọn đối tượng *(tùy chọn)* | C5 | Hit-test và GPU picking mất bao lâu, có chọn đúng không | 100; 1.000; 10.000 đối tượng × 1.000 vị trí chuột ngẫu nhiên | Đối tượng nhỏ, chồng nhau, hình lõm | Vị trí đối tượng đã biết |

## 4.4. Kết quả

Các độ đo được lấy từ tiêu chí ở Bảng 1.1:
- **Độ chính xác:** sai số hình học (điểm ảnh), độ phủ đường cong (%), sai số vị trí và độ trôi năng lượng của tích phân số (%), tỉ lệ chọn đúng đối tượng (%).
- **Độ phức tạp, hiệu năng:** số đỉnh gửi lên GPU, số lệnh vẽ, thời gian khung hình (trung bình và phân vị 95), FPS, thời gian CPU cho phần vẽ, số ô duyệt.

Với thử nghiệm (f), ảnh được đọc lại bằng `readPixels`. **Sai số lớn nhất** là khoảng cách lớn nhất từ tâm một điểm ảnh được tô (alpha > 127) tới đường cong thật, trừ đi nửa bề rộng nét: nếu mọi điểm ảnh được tô đều nằm trong nét thật thì sai số bằng 0. **Độ phủ** là tỉ lệ các điểm lấy mẫu trên đường cong thật mà điểm ảnh chứa nó được tô (`benchmark/curve-measure.js`).

### 4.4.1. Thử nghiệm (f): Loop và Blinn so với chia đoạn thẳng

**Bảng 4.5 – Kết quả thử nghiệm (f)** *[số chạy thử: Edge không giao diện, GPU NVIDIA RTX 3050 Laptop; thay bằng số đo trên máy thật, có cửa sổ hiện, đủ 12 cấu hình]*
| Cách vẽ | Phóng to | Số đỉnh | Sai số lớn nhất (điểm ảnh) | Độ phủ (%) |
|---|---|---|---|---|
| Loop và Blinn | 1× | 4 | 0,000 | 99,9 |
| Loop và Blinn | 64× | 4 | 0,003 | 100,0 |
| 120 đoạn thẳng | 1× | 720 | 0,000 | 100,0 |
| 120 đoạn thẳng | 64× | 720 | 0,647 | 83,3 |
| 30 đoạn thẳng | 16× | 180 | 3,070 | 18,6 |
| 30 đoạn thẳng | 64× | 180 | 11,290 | 7,1 |

Thời gian vẽ có trong tệp CSV nhưng ở lần chạy thử dao động mạnh (khoảng 0,01–0,24 ms mỗi lần vẽ), nên chưa đưa vào bảng; cần đo lại nhiều lần trên máy thật.

*[Hình 4.8 – Sai số lớn nhất theo mức phóng to (trục hoành thang log), 3 đường cho 3 cách vẽ.]*
*[Hình 4.9 – Ba ảnh cắt ở 16× từ trang thử nghiệm.]*

### 4.4.2. Thử nghiệm (a): hiệu năng render

**Bảng 4.6 – Kết quả thử nghiệm (a)** *[số chạy thử: GPU Intel Iris Xe, 20.000 hình, không chữ; thay bằng đủ 30 cấu hình đo trên máy thật]*
| Cách vẽ | Số hình | Chữ | FPS | Khung hình TB (ms) | CPU vẽ TB (ms) | Lệnh vẽ |
|---|---|---|---|---|---|---|
| Canvas 2D | 20.000 | không | 27 | 37,8 | 11,36 | Không đếm được (trình duyệt tự xử lý) |
| PixiJS | 20.000 | không | 60 | 16,7 | 1,24 | 1 |
| WebGL thuần | 20.000 | không | 61 | 16,7 | 0,39 | 1 |

*[Hình 4.10 – FPS theo số hình (thang log), 3 cách vẽ, có và không có chữ.]*

### 4.4.3. Thử nghiệm (d): instancing

**Bảng 4.7 – Kết quả thử nghiệm (d)** *[số chạy thử cho 10.000 bản sao; thay bằng đủ 5 mức]*
| Số bản sao | Instancing: lệnh vẽ | Instancing: CPU (ms) | Vòng lặp: lệnh vẽ | Vòng lặp: CPU (ms) |
|---|---|---|---|---|
| 1 | 1 | [cần số đo] | 1 | [cần số đo] |
| 10 | 1 | [cần số đo] | 10 | [cần số đo] |
| 100 | 1 | [cần số đo] | 100 | [cần số đo] |
| 1.000 | 1 | [cần số đo] | 1.000 | [cần số đo] |
| 10.000 | 1 | 0,10 | 10.000 | 1,83 |

### 4.4.4. Thử nghiệm (e): tính theo điểm ảnh

**Bảng 4.8 – Kết quả thử nghiệm (e)**
| Độ phân giải | Số điểm ảnh | CPU (ms/khung) | GPU (ms/khung) | Nhanh gấp | Hai ảnh giống nhau? |
|---|---|---|---|---|---|
| 480 × 270 | 129.600 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 960 × 540 | 518.400 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 1280 × 720 | 921.600 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 1920 × 1080 | 2.073.600 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |

### 4.4.5. Thử nghiệm (b): tích phân số

**Bảng 4.9 – Kết quả thử nghiệm (b)** (mỗi ô ghi 3 giá trị ứng với Δt = 1/30, 1/60, 1/120 s)
| Phương pháp | Sai số vị trí lớn nhất sau 10 chu kỳ (m) | Độ trôi năng lượng (%) | Thời gian mỗi bước (µs) |
|---|---|---|---|
| Euler hiện | [cần số đo] | [cần số đo] | [cần số đo] |
| Velocity Verlet | [cần số đo] | [cần số đo] | [cần số đo] |
| RK4 | [cần số đo] | [cần số đo] | [cần số đo] |

*[Hình 4.11 – Năng lượng theo thời gian của 3 phương pháp với Δt = 1/30 s.]*

### 4.4.6. Thử nghiệm (c): Dijkstra và A*

**Bảng 4.10 – Kết quả thử nghiệm (c)** (mỗi ô ghi 3 giá trị ứng với tường 0 %, 20 %, 30 %; trung bình 10 cặp điểm)
| Lưới | Ô duyệt – Dijkstra | Ô duyệt – A* | Tỉ lệ A* / Dijkstra | Thời gian Dijkstra / A* (ms) | Độ dài đường bằng nhau? |
|---|---|---|---|---|---|
| 20 × 20 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 50 × 50 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 100 × 100 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |

### 4.4.7. Thử nghiệm (g): chọn đối tượng *(tùy chọn)*

**Bảng 4.11 – Kết quả thử nghiệm (g)**
| Số đối tượng | Hit-test: thời gian (ms) | Hit-test: chọn đúng (%) | GPU picking: thời gian (ms) | GPU picking: chọn đúng (%) |
|---|---|---|---|---|
| 100 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 1.000 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |
| 10.000 | [cần số đo] | [cần số đo] | [cần số đo] | [cần số đo] |

## 4.5. Bàn luận

> Các đoạn dưới đây viết theo số chạy thử hoặc để chỗ trống [x]; phải viết lại theo số đo thật.

**Thử nghiệm (f).** Ở mức phóng to 1×, cả ba cách vẽ đều gần như không có sai số, vì mỗi đoạn thẳng ngắn hơn một điểm ảnh. Khi phóng to 64× quanh đỉnh, đường gấp khúc 120 đoạn lệch tới 0,65 điểm ảnh và chỉ phủ 83 % đường cong thật; đường 30 đoạn đã lệch 3 điểm ảnh từ mức 16× và tới 11 điểm ảnh ở 64×. Loop và Blinn giữ sai số dưới 0,01 điểm ảnh ở mọi mức phóng to mà chỉ dùng 4 đỉnh, so với 720 đỉnh của cách 120 đoạn. Nguyên nhân nằm ở thời điểm xấp xỉ: đường gấp khúc được tạo trên CPU **trước** khi phóng to, còn Loop và Blinn tính lại u² − v tại **từng điểm ảnh** sau khi phóng to (Mục 3.3.1). Kết quả khớp với tính chất "độc lập độ phân giải" mà Loop và Blinn khẳng định [1]. Vì bài báo không công bố bảng số đo, báo cáo chỉ kiểm chứng được tính chất đó, không so sánh con số với bài báo.

**Thử nghiệm (a).** Ở 20.000 hình, Canvas 2D cần khoảng 11 ms thời gian CPU mỗi khung hình vì JavaScript phải gọi `fillRect` 20.000 lần, nên chỉ đạt 27 FPS. WebGL thuần chỉ cần 0,39 ms vì toàn bộ vị trí được nạp vào một bộ đệm và vẽ bằng một lệnh `drawArraysInstanced`; PixiJS cũng gộp về một lệnh vẽ nhưng tốn 1,24 ms, nhiều hơn WebGL thuần; phần chênh lệch nhiều khả năng là chi phí của lớp thư viện khi cập nhật vị trí từng hạt trong `ParticleContainer` [cần kiểm chứng bằng công cụ profiler của trình duyệt]. Hướng kết quả giống Horak và cộng sự [6], nơi WebGL nhanh hơn Canvas và SVG; hai thử nghiệm khác phần cứng và loại cảnh nên không so sánh trực tiếp con số. [Bổ sung khi có đủ 30 cấu hình: điểm gãy của từng cách vẽ, và ảnh hưởng của nhãn chữ.]

**Thử nghiệm (d).** Với 10.000 bản sao, vòng lặp gọi 10.000 lệnh vẽ tốn khoảng 1,83 ms thời gian CPU, trong khi instancing chỉ gọi một lệnh và tốn 0,10 ms. Số tam giác GPU phải vẽ ở hai cách là như nhau, nên chênh lệch đến từ chi phí cố định của mỗi lệnh vẽ ở phía CPU (Mục 3.2.1). [Bổ sung khi có đủ 5 mức: thời gian của vòng lặp tăng gần tuyến tính theo số bản sao, còn instancing gần như không đổi.]

**Thử nghiệm (e).** Ở độ phân giải 1920 × 1080, bản CPU cần [x] ms để tính màu cho khoảng 2,07 triệu điểm ảnh, trong khi fragment shader cần [y] ms, nhanh hơn khoảng [x/y] lần. Hai bản dùng cùng công thức và cho cùng ảnh, nên khác biệt chỉ đến từ cách chạy: tuần tự trên một luồng JavaScript so với song song trên GPU (Mục 3.5). Chi phí bản CPU tỉ lệ với W × H nên khoảng cách tăng theo độ phân giải.

**Thử nghiệm (b).** Sau 10 chu kỳ với Δt = 1/60 s, năng lượng lò xo tính bằng Euler hiện tăng [x] %, Velocity Verlet dao động quanh giá trị đúng trong khoảng [y] %, RK4 lệch dưới [z] %. Khi Δt giảm một nửa, sai số giảm lần lượt khoảng 2, 4 và 16 lần, đúng bậc O(Δt), O(Δt²), O(Δt⁴) (Mục 3.4). Với phần vẽ, điều này nghĩa là vật dùng Euler sẽ bị vẽ lệch dần khỏi vị trí đúng nếu mô phỏng chạy lâu.

**Thử nghiệm (c).** Trên lưới 100 × 100 không có tường, A* duyệt trung bình [x] ô so với [y] ô của Dijkstra, và hai thuật toán luôn cho đường đi cùng độ dài. Khi mật độ tường tăng lên 30 %, tỉ lệ ô duyệt của A* so với Dijkstra tăng lên [z] %, vì heuristic Manhattan ước lượng kém khi đường phải vòng qua vật cản. Số ô duyệt cũng là số bước mà C5 phải phát lại, nên A* cho phần minh họa ngắn hơn.

**Thử nghiệm (g)** *(nếu làm)*. Với 10.000 đối tượng, hit-test mất [x] ms mỗi lần chọn nhưng chỉ dùng được khi đối tượng xếp đều; GPU picking mất [y] ms vì phải vẽ thêm một lượt và chờ GPU trả về một điểm ảnh, đổi lại chọn đúng [z] % với cả hình lõm và hình chồng nhau.

**Hạn chế của phép đo.** Số liệu đo trên [số máy] máy và một số trình duyệt; thời gian khung hình bị giới hạn bởi tần số làm tươi màn hình (60 Hz), nên với cảnh nhẹ, thời gian CPU cho phần vẽ phản ánh khác biệt rõ hơn FPS. Thời gian vẽ của từng đường cong ở thử nghiệm (f) rất nhỏ và dao động, cần lấy trung bình nhiều lần.
