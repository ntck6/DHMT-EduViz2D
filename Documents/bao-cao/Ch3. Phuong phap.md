# Chương 3. Phương pháp

> Bản viết dạng văn của Chương 3. Trích dẫn [n] theo `Tai lieu tham khao.md`. Đường dẫn code tính từ thư mục `Source code/`.
> Người viết: A (3.1–3.3, 3.7), C (3.4 phần vật lý, 3.5), B (3.4 phần thuật toán, 3.6). Ô ghi *[Hình …]* là chỗ chèn ảnh chụp.

Theo kết luận của Chương 2 (mục 2.6), chương này trình bày hai lớp giải pháp. **Giải pháp nền** (Mục 3.2) là pipeline WebGL 2 kết hợp kỹ thuật instancing, dùng để vẽ mọi cảnh trong ứng dụng. **Phương pháp cải tiến** (Mục 3.3) là phương pháp vẽ đường cong độc lập độ phân giải của Loop và Blinn (2005) [1], một phương pháp tiên tiến đã công bố, thay cho bước vẽ đường cong của giải pháp nền. Các mục sau đó đi theo các công đoạn còn lại: tính toán (3.4), tính theo từng điểm ảnh trên GPU (3.5), cập nhật động và tương tác (3.6), và tiến trình xử lý một khung hình (3.7).

## 3.1. Sơ đồ chung của hệ thống

*[Hình 3.1 – Sơ đồ chung: Dữ liệu bài học (JavaScript) → Tính toán → Vertex buffer (GPU) → Vertex shader → Raster hóa → Fragment shader → Framebuffer của `<canvas>`; vòng `requestAnimationFrame` và sự kiện DOM quay lại khối đầu. Ghi C1–C5 lên từng khối; tô màu khác cho khối dùng Loop & Blinn (C3, C4 khi vẽ đường cong) và khối dùng instancing (C3, C4 khi vẽ nhiều đối tượng).]*

Hình 3.1 trình bày sơ đồ chung của hệ thống theo 5 công đoạn ở Bảng 1.2. Dữ liệu bài học (C1) được JavaScript tính toán (C2) rồi đổi thành dữ liệu đỉnh trong bộ đệm của GPU (C3). Vertex shader đưa các đỉnh về hệ tọa độ cắt (clip space), bộ raster hóa xác định các điểm ảnh bị hình phủ, fragment shader tính màu của từng điểm ảnh và ghi vào khung vẽ `<canvas>` (C4). Vòng `requestAnimationFrame` và các sự kiện chuột, bàn phím đưa trạng thái mới trở lại C1 (C5). Giải pháp nền đi qua toàn bộ pipeline này; phương pháp Loop và Blinn chỉ thay cách làm ở C3 và C4 khi vẽ đường cong.

## 3.2. Giải pháp nền: pipeline WebGL 2 kết hợp instancing

Giải pháp nền dựa trên đặc tả WebGL 2.0 [13], không phải một bài báo riêng. Mỗi bước có nguồn riêng: chia đa giác thành tam giác dựa trên định lý của Meisters (1975) [23], instancing theo Carucci (2005) [24].

### 3.2.1. Nguyên lý

GPU chỉ vẽ được ba loại hình cơ bản (primitive): điểm, đoạn thẳng và tam giác. Mọi vùng cần tô vì vậy phải được chia thành tam giác trước khi gửi lên GPU. GPU xử lý song song hàng nghìn đỉnh và điểm ảnh, nhưng mỗi lệnh vẽ mà JavaScript gửi xuống đều tốn một chi phí cố định ở phía CPU: kiểm tra trạng thái, chuẩn bị dữ liệu, chuyển lệnh qua trình duyệt xuống trình điều khiển đồ họa. Khi cảnh có nhiều đối tượng, điểm nghẽn thường nằm ở số lệnh vẽ chứ không ở GPU. Nguyên lý của giải pháp nền là **gửi ít lệnh vẽ, mỗi lệnh mang nhiều dữ liệu**.

### 3.2.2. Phương pháp

Mỗi hình đi qua pipeline WebGL 2 theo bốn bước:
1. **Dữ liệu đỉnh:** tọa độ các đỉnh (và thuộc tính kèm theo) được nạp vào vertex buffer; một vertex array object (VAO) ghi lại cách đọc bộ đệm.
2. **Vertex shader:** nhân tọa độ mỗi đỉnh với ma trận biến đổi để đưa về clip space.
3. **Raster hóa:** GPU xác định các điểm ảnh nằm trong mỗi tam giác và nội suy các giá trị đi kèm đỉnh cho từng điểm ảnh.
4. **Fragment shader:** tính màu của từng điểm ảnh rồi ghi vào framebuffer của `<canvas>`.

Khi cần vẽ N đối tượng giống nhau về hình dạng (N cột của bài sắp xếp, N hạt), giải pháp nền dùng **instancing**: chỉ một hình mẫu nằm trên GPU, kèm một bộ đệm chứa thuộc tính riêng của từng bản sao (vị trí, kích thước, màu), và cả N bản sao được vẽ bằng **một** lệnh `drawArraysInstanced`.

### 3.2.3. Giải thuật

**Bảng 3.1 – Bốn thành phần của giải pháp nền**
| Thành phần | Nội dung | Code | Hình |
|---|---|---|---|
| Chia đa giác thành tam giác | Cắt tai (ear clipping), O(n²) | `js/webgl/triangulate.js` | 3.2 |
| Ma trận biến đổi 2D | Tọa độ thuần nhất 3 × 3, ma trận chiếu sang clip space | `js/webgl/matrix.js` | 3.3 |
| Shader | Vertex shader nhân ma trận; fragment shader tô màu | `js/tech/pipeline.js` | 3.4 |
| Instancing | `vertexAttribDivisor`, `drawArraysInstanced` | `js/webgl/instanced-rects.js` | 3.5 |

**a) Chia đa giác thành tam giác.** Meisters (1975) chứng minh mọi đa giác đơn có ít nhất 4 đỉnh đều có ít nhất hai "tai" không chồng nhau, trong đó tai là một đỉnh mà tam giác tạo bởi nó và hai đỉnh kề nằm trọn trong đa giác [23]. Cắt bỏ một tai được một đa giác ít hơn một đỉnh, vẫn là đa giác đơn, nên lặp lại sẽ chia xong đa giác thành n − 2 tam giác.

```
Giải thuật CắtTai(đa giác P có n đỉnh):
  kết_quả ← rỗng
  trong khi P còn hơn 3 đỉnh:
    với mỗi đỉnh i của P:
      nếu tam giác (i−1, i, i+1) cùng chiều với P và không chứa đỉnh nào khác của P:
        thêm tam giác (i−1, i, i+1) vào kết_quả; xóa đỉnh i khỏi P; thoát vòng
  thêm 3 đỉnh cuối vào kết_quả
```
Mỗi lượt tìm tai duyệt tối đa n đỉnh và kiểm tra n đỉnh khác, nên độ phức tạp là O(n²), đủ nhanh cho các hình vài trăm đỉnh trong ứng dụng.

**b) Ma trận biến đổi 2D.** Mỗi điểm (x, y) được viết dưới dạng tọa độ thuần nhất (x, y, 1), để phép dời, xoay, co giãn đều là phép nhân ma trận 3 × 3 và ghép được với nhau bằng tích ma trận. Ma trận chiếu đổi tọa độ điểm ảnh (gốc ở góc trên trái, trục y hướng xuống) sang clip space (gốc ở giữa, mỗi trục từ −1 đến 1, trục y hướng lên):

```
          | 2/W    0    −1 |
ortho2D = |  0   −2/H    1 |      tức  x_clip = 2x/W − 1,  y_clip = 1 − 2y/H
          |  0     0     1 |
```
Phép phóng to quanh một điểm chỉ làm đổi ma trận khung nhìn; dữ liệu đỉnh trên GPU giữ nguyên.

**c) Shader.** Vertex shader nhận tọa độ đỉnh và ma trận (qua uniform `mat3`), trả về vị trí trong clip space. Fragment shader nhận các giá trị đã được nội suy và trả về màu RGBA của điểm ảnh. Cả hai viết bằng GLSL ES 3.00 và được biên dịch, liên kết lúc chạy (`js/webgl/gl-utils.js`).

**d) Instancing.** Hình mẫu là một hình vuông đơn vị gồm 2 tam giác (6 đỉnh). Bộ đệm thứ hai chứa 8 số thực cho mỗi bản sao: x, y, rộng, cao và màu RGBA. Lệnh `vertexAttribDivisor(thuộc_tính, 1)` báo cho GPU rằng thuộc tính này đổi theo từng bản sao chứ không theo từng đỉnh. Vertex shader co giãn hình vuông theo kích thước, dời tới vị trí của bản sao rồi nhân ma trận chiếu.

```
Giải thuật VẽNHìnhChữNhật(dữ liệu của N hình):
  nạp N × 8 số thực vào bộ đệm bản sao (bufferSubData)
  drawArraysInstanced(TRIANGLES, 0, 6, N)        // 1 lệnh vẽ cho N hình
So với cách thông thường:
  với i = 1..N: đặt uniform vị trí, màu của hình i; drawArrays(TRIANGLES, 0, 6)   // N lệnh vẽ
```
Hai cách cho cùng số tam giác GPU phải vẽ (2N); khác nhau ở số lệnh vẽ CPU phải gửi: 1 so với N.

### 3.2.4. Minh họa

Bài *Pipeline WebGL từng bước* trong ứng dụng cho người học đi qua lần lượt các bước trên với một ngôi sao lõm 14 đỉnh: xem các đỉnh, xem 12 tam giác do giải thuật cắt tai tạo ra, xoay và phóng to bằng ma trận, tô màu bằng fragment shader, và vẽ 1 đến 10.000 bản sao bằng instancing kèm số lệnh vẽ và thời gian CPU.

*[Hình 3.2 – Ngôi sao lõm 14 đỉnh được chia thành 12 tam giác.]*
*[Hình 3.3 – Đa giác trước và sau khi xoay 45° bằng ma trận.]*
*[Hình 3.4 – Đa giác tô chuyển màu bằng fragment shader.]*
*[Hình 3.5 – 100 bản sao vẽ bằng 1 lệnh `drawElementsInstanced`.]*

## 3.3. Phương pháp cải tiến: vẽ đường cong độc lập độ phân giải (Loop và Blinn, 2005)

Phương pháp của Loop và Blinn [1] thay **một bước** của giải pháp nền: bước "chia đường cong thành N đoạn thẳng" ở C3–C4 được thay bằng "tính phương trình ẩn của đường cong tại từng điểm ảnh". Cải tiến này là của bài báo; nhóm đọc hiểu, cài đặt lại phần đường cong Bézier bậc 2 trên WebGL và kiểm chứng bằng số đo (thử nghiệm f, Chương 4).

### 3.3.1. Nguyên lý

Cách thông thường chia đường cong thành N đoạn thẳng, mỗi đoạn là một hình chữ nhật mảnh gồm 2 tam giác. Đường cong bị xấp xỉ **trước** khi gửi lên GPU, nên khi phóng to các đoạn thẳng hiện ra thành cạnh gãy; muốn mịn hơn phải tăng N, tức tăng số đỉnh. Loop và Blinn nêu đúng nhược điểm này ở phần mở đầu bài báo: khi phóng to sẽ thấy các mặt phẳng của phép xấp xỉ tuyến tính từng đoạn [1, §1].

Loop và Blinn **không xấp xỉ**. Đường cong được biểu diễn bằng một phương trình ẩn f(u, v) = 0, và GPU kiểm tra **từng điểm ảnh** xem điểm ảnh nằm phía nào của đường cong và cách đường cong bao xa. Vì phép kiểm tra được làm lại ở độ phân giải thực của màn hình sau mỗi lần phóng to, đường cong luôn mịn: đây là tính chất "độc lập độ phân giải".

### 3.3.2. Phương pháp

**Đường cong Bézier bậc 2** với ba điểm điều khiển P0, P1, P2:

B(t) = (1 − t)² P0 + 2t(1 − t) P1 + t² P2,   0 ≤ t ≤ 1.

**Gán tọa độ (u, v).** Loop và Blinn gán cho ba điểm điều khiển các tọa độ P0 → (0, 0), P1 → (½, 0), P2 → (1, 1) [1, §3]. Vì (u, v) là một hàm affine của (x, y), thay B(t) vào cho thấy trên đường cong u = t và v = t², tức mọi điểm trên đường cong thỏa

**f(u, v) = u² − v = 0.**

Phía lồi của đường cong có f < 0, phía còn lại có f > 0. GPU nội suy (u, v) tuyến tính cho từng điểm ảnh, nên fragment shader chỉ cần tính một biểu thức u² − v.

**Áp dụng cho quỹ đạo ném xiên.** Bỏ qua lực cản, quỹ đạo là một parabol nên trùng khít một đường cong Bézier bậc 2. Với P0 là điểm ném và P2 là điểm rơi sau thời gian bay T, đạo hàm của B tại đầu mút cho B′(0) = 2(P1 − P0) = T · v(0), suy ra P1 = P0 + v(0) · T/2. Với quỹ đạo xuất phát từ gốc tọa độ có tầm xa R và độ cao cực đại H, ba điểm là P0 = (0, 0), P1 = (R/2, 2H), P2 = (R, 0). Nhóm có kiểm thử tự động xác nhận đường cong này trùng với quỹ đạo tính từ công thức chuyển động (`tests/curve-math.test.mjs`).

**Khoảng cách và khử răng cưa.** Để vẽ một nét có bề rộng w với mép mịn, cần biết khoảng cách d từ tâm điểm ảnh tới đường cong. Loop và Blinn dùng xấp xỉ bậc nhất [1, §5]:

d ≈ f / ‖∇f‖,

trong đó gradient ∇f lấy theo tọa độ điểm ảnh. Theo quy tắc dây chuyền, ∇f = 2u∇u − ∇v, và ∇u, ∇v được GPU tính sẵn bằng các lệnh đạo hàm màn hình `dFdx`, `dFdy` (bài báo gọi là "gradient instructions"). Độ phủ của điểm ảnh lấy theo một hàm trộn đơn giản, được bài báo cho phép thay cho bảng tra:

α = clamp(w/2 + 0,5 − |d|, 0, 1),

tức điểm ảnh được tô đầy khi nằm trong nét, và mờ dần trong 1 điểm ảnh ở mép.

**Vẽ nét thay vì tô vùng.** Bài báo nêu rằng chỉ cần sửa nhẹ shader là vẽ được biên của đường cong với độ dày tùy ý [1, §7]; quỹ đạo trong ứng dụng là một nét vẽ nên dùng đúng cách này.

*[Hình 3.6 – Tam giác P0 P1 P2 của một quỹ đạo, ghi (u, v) ở ba đỉnh; vùng f < 0 và f > 0 tô hai màu khác nhau.]*

### 3.3.3. Giải thuật

**Bảng 3.2 – Các bước vẽ một đường cong theo Loop và Blinn**
| Bước | CPU (JavaScript) | GPU |
|---|---|---|
| 1 | Tính P0, P1, P2 từ tham số ném (`parabolaToBezier`) | Chưa tham gia |
| 2 | Tính phép biến đổi affine (x, y) → (u, v) (`uvTransform`); nếu 3 điểm thẳng hàng thì vẽ đoạn thẳng | Chưa tham gia |
| 3 | Lấy hộp bao 3 điểm, nới thêm một lề bằng nửa bề rộng nét cộng 2 điểm ảnh (đủ chứa nét và phần mép mờ) → 4 góc tứ giác, mỗi góc kèm (u, v) | Chưa tham gia |
| 4 | Nạp 4 đỉnh vào bộ đệm, gọi 1 lệnh `drawArrays(TRIANGLE_STRIP)` | Vertex shader đổi vị trí sang clip space, chuyển (u, v) xuống |
| 5 | Không tham gia | Raster hóa nội suy (u, v) cho từng điểm ảnh trong tứ giác |
| 6 | Không tham gia | Fragment shader tính f, d, độ phủ; giữ phần 0 ≤ u ≤ 1 |

Fragment shader (rút gọn từ `js/webgl/loop-blinn.js`):
```glsl
float f = u*u - v;
vec2  g = 2.0*u*vec2(dFdx(u), dFdy(u)) - vec2(dFdx(v), dFdy(v));  // ∇f
float d = f / max(length(g), 1e-6);                              // khoảng cách gần đúng (điểm ảnh)
float a = clamp(uHalfWidth + 0.5 - abs(d), 0.0, 1.0);             // độ phủ của nét
float du = length(vec2(dFdx(u), dFdy(u)));
a *= clamp(u / du + 0.5, 0.0, 1.0) * clamp((1.0 - u) / du + 0.5, 0.0, 1.0);  // cắt 2 đầu mút
if (a <= 0.0) discard;
outColor = vec4(uColor.rgb * uColor.a * a, uColor.a * a);      // màu đã nhân alpha
```

**Độ phức tạp.** Loop và Blinn: phía CPU O(1) và luôn gửi 4 đỉnh; phía GPU O(số điểm ảnh trong tứ giác). Cách chia N đoạn thẳng: phía CPU O(N) và gửi 6N đỉnh (720 đỉnh với N = 120), phía GPU O(số điểm ảnh của nét).

### 3.3.4. Minh họa

Bài Ném xiên vẽ quỹ đạo bằng Loop và Blinn trên một lớp WebGL riêng, có ô chọn để đổi sang cách chia 120 đoạn thẳng và thanh phóng to từ 1× đến 64× quanh đỉnh quỹ đạo. Trang thử nghiệm `benchmark/curve.html` vẽ cùng một quỹ đạo bằng Loop và Blinn, 120 đoạn và 30 đoạn ở 4 mức phóng to để đo ở Chương 4.

*[Hình 3.7 – Bài Ném xiên ở mức phóng to 16× quanh đỉnh: trái là Loop và Blinn, phải là 120 đoạn thẳng.]*
*[Hình 3.8 – Ba ảnh cắt từ trang thử nghiệm ở 16×: Loop và Blinn, 120 đoạn, 30 đoạn.]*

### 3.3.5. Đối chiếu với bài báo

Nhóm đã đọc toàn văn bài báo và đối chiếu từng điểm của bản cài đặt (Bảng 3.3).

**Bảng 3.3 – Đối chiếu bản cài đặt với bài báo**
| Nội dung | Bài báo [1] | Bản cài đặt | Kết luận |
|---|---|---|---|
| Gán (u, v) | (0, 0), (½, 0), (1, 1) – §3, Hình 1 | Như bài báo, có kiểm thử | Giống |
| Phương trình ẩn | f = u² − v, f < 0 là phía trong – §3 | Như bài báo | Giống |
| Khoảng cách | d = f/‖∇f‖, ∇f bằng lệnh gradient hoặc quy tắc dây chuyền – §5 | ∇f = 2u∇u − ∇v bằng `dFdx`, `dFdy` | Giống |
| Khử răng cưa | Bảng tra 1 chiều hoặc hàm trộn đơn giản – §5 | Dốc tuyến tính rộng 1 điểm ảnh | Giống (một lựa chọn bài báo cho phép) |
| Vẽ nét | Có nêu – §7 | Nét rộng w | Giống |
| Hình bao | Tam giác điều khiển P0 P1 P2 | Hộp chữ nhật bao 3 điểm cộng lề | **Khác:** nét vẽ tràn ra ngoài tam giác ở phía lồi nên tam giác không đủ chứa; đổi lại GPU xử lý thêm một số điểm ảnh bị loại |
| Cắt hai đầu mút | Không có (bài báo ghép nhiều tam giác thành hình kín) | Giữ phần 0 ≤ u ≤ 1 | **Nhóm thêm**, vì u² − v = 0 mô tả cả parabol vô hạn |
| Đường cong hữu tỉ, bậc 3, phối cảnh, tam giác hóa phông chữ | §3.1, §4, §5.1, §6 | Không làm | Ngoài phạm vi; bậc 3 là hướng phát triển |
| Số đo hiệu năng | Không có bảng số | Thử nghiệm (f) | Chỉ kiểm chứng được tính chất, không so sánh con số |

## 3.4. Mô hình tính toán (công đoạn C2)

Công đoạn C2 cung cấp dữ liệu cho phần vẽ. Mục này chỉ nêu những công thức và giải thuật sinh ra dữ liệu đó, cùng sai số và độ phức tạp của chúng.

**Ném xiên.** Bỏ qua lực cản, với vận tốc ban đầu v₀ và góc ném θ [25]:
x(t) = v₀cosθ · t,  y(t) = v₀sinθ · t − ½gt²;  thời gian bay T = 2v₀sinθ/g, tầm xa R = v₀²sin2θ/g, độ cao cực đại H = (v₀sinθ)²/(2g).
Ví dụ v₀ = 20 m/s, θ = 45°, g = 9,8 m/s² cho T ≈ 2,886 s, R ≈ 40,816 m, H ≈ 10,204 m. Quỹ đạo có nghiệm giải tích nên được đổi thẳng thành ba điểm điều khiển P0 = (0, 0), P1 = (R/2, 2H), P2 = (R, 0) (Mục 3.3.2).

**Lò xo và con lắc.** Lò xo không ma sát tuân theo x″ = −(k/m)x, có nghiệm x(t) = A cos(ωt) với ω = √(k/m) khi x(0) = A, v(0) = 0, và năng lượng E = ½mv² + ½kx² không đổi. Con lắc đơn tuân theo θ″ = −(g/L) sin θ; với góc nhỏ, chu kỳ T₀ = 2π√(L/g). Ứng dụng tính trạng thái sau mỗi bước Δt bằng một trong ba phương pháp tích phân số:
- **Euler hiện:** xₙ₊₁ = xₙ + vₙΔt, vₙ₊₁ = vₙ + a(xₙ)Δt; sai số toàn cục O(Δt); với lò xo, năng lượng tăng dần.
- **Velocity Verlet:** xₙ₊₁ = xₙ + vₙΔt + ½aₙΔt², vₙ₊₁ = vₙ + ½(aₙ + aₙ₊₁)Δt; sai số toàn cục O(Δt²); năng lượng dao động quanh giá trị đúng, không trôi.
- **Runge–Kutta bậc 4 (RK4):** 4 lần tính đạo hàm k₁…k₄ mỗi bước; sai số toàn cục O(Δt⁴), chi phí mỗi bước gấp khoảng 4 lần Euler.

Sai số của phương pháp tích phân quyết định vật được vẽ ở đúng vị trí hay không; nghiệm giải tích của lò xo là đáp án của thử nghiệm (b).

**Giao thoa hai nguồn cùng pha.** Mỗi nguồn tạo dao động yᵢ = A sin(ωt − k rᵢ) với k = 2π/λ, rᵢ là khoảng cách tới nguồn i. Biên độ tổng hợp tại một điểm là 2A|cos(k(r₁ − r₂)/2)|, cực đại khi r₁ − r₂ = nλ và cực tiểu khi r₁ − r₂ = (n + ½)λ. Cách tính công thức này cho từng điểm ảnh được trình bày ở Mục 3.5.

**Thuật toán Tin học.** Các thuật toán sắp xếp (Bubble, Quick, Merge, Heap Sort), duyệt đồ thị (BFS, DFS), Dijkstra và A* được viết dưới dạng *generator* của JavaScript: mỗi khi so sánh, đổi chỗ hay thăm một đỉnh, thuật toán trả ra một bước. Công đoạn C5 ghi lại các bước này để phát lại, tua và đổi tốc độ, nên phần tính toán tách hẳn khỏi phần vẽ. Với mảng lớn hơn khoảng 2.000 phần tử, ứng dụng không ghi từng bước mà chỉ chạy thuật toán trực tiếp. Dijkstra dùng hàng đợi ưu tiên có độ phức tạp O((V + E) log V); A* dùng thêm heuristic khoảng cách Manhattan trên lưới 4 hướng. Heuristic này không bao giờ ước lượng quá khoảng cách thật, nên A* vẫn cho đường đi ngắn nhất nhưng thường duyệt ít ô hơn Dijkstra; thử nghiệm (c) đo mức chênh lệch này.

## 3.5. Tính toán theo từng điểm ảnh trên GPU

Fragment shader được gọi một lần cho mỗi điểm ảnh, và GPU chạy các lần gọi này song song. Bài Giao thoa sóng tận dụng điều đó để tính một hiện tượng liên tục trên toàn bộ khung vẽ.

Ứng dụng vẽ một hình chữ nhật phủ toàn khung vẽ. Với mỗi điểm ảnh, fragment shader:
1. lấy tọa độ điểm ảnh từ `gl_FragCoord`;
2. tính khoảng cách r₁, r₂ tới hai nguồn;
3. tính biên độ tổng hợp tại thời điểm t theo công thức ở Mục 3.4;
4. đổi biên độ thành màu.

Vị trí hai nguồn, bước sóng và thời gian được JavaScript gửi xuống qua uniform mỗi khung hình. Cần lưu ý `gl_FragCoord` có gốc ở góc **dưới** trái và tính theo điểm ảnh thật của màn hình, nên vị trí nguồn phải được lật trục y và nhân với `devicePixelRatio` trước khi gửi.

Để đo lợi ích của cách làm này, nhóm viết một bản đối chứng trên CPU: một vòng lặp JavaScript đi qua W × H điểm ảnh, tính đúng công thức trên và ghi vào `ImageData` của Canvas 2D. Hai bản có cùng số phép tính và phải cho cùng một ảnh; khác nhau ở chỗ chạy tuần tự trên một luồng JavaScript hay song song trên GPU. Thử nghiệm (e) so sánh thời gian của hai bản.

*[Hình 3.9 – Ảnh giao thoa hai nguồn và đoạn GLSL tương ứng.]*

## 3.6. Cập nhật động và tương tác (công đoạn C5)

**Vòng cập nhật.** Chế độ động được dựng trên `requestAnimationFrame`: trình duyệt gọi hàm vẽ trước mỗi lần làm tươi màn hình và cho biết thời gian đã trôi qua Δt. Mỗi khung hình chỉ dữ liệu thay đổi được gửi lại lên GPU bằng `bufferSubData` thay vì tạo bộ đệm mới, và lớp tĩnh như hệ trục được giữ nguyên.

**Phát lại các bước.** Với các bài thuật toán, toàn bộ các bước được ghi trước (Mục 3.4); vòng cập nhật chỉ chọn bước cần hiển thị theo nút Play/Pause, thanh tua và thanh tốc độ. Bàn phím cũng điều khiển được: phím cách để chạy/dừng, mũi tên phải để đi một bước, R để đặt lại.

**Nhận thao tác và chọn đối tượng.** Sự kiện chuột, cảm ứng của DOM cho biết tọa độ con trỏ; ứng dụng phải trả lời ẩn số "đối tượng nào đang bị chọn". Nhóm dùng hai cách (Bảng 3.4).

**Bảng 3.4 – Hai cách chọn đối tượng**
| | Tính toán (hit-test) | GPU picking |
|---|---|---|
| Ý tưởng | Suy chỉ số trực tiếp từ tọa độ chuột, ví dụ cột i = ⌊(x − lề) / độ rộng cột⌋ | Vẽ lại cảnh vào một framebuffer ẩn, mỗi đối tượng tô bằng một "màu mã" là số thứ tự của nó; đọc màu tại vị trí chuột bằng `readPixels` rồi giải mã |
| Độ phức tạp | O(1) | Một lượt vẽ thêm và chờ GPU trả về 1 điểm ảnh |
| Dùng được khi | Phần tử xếp đều (cột, lưới) | Mọi hình dạng, kể cả hình lõm, hình xoay, hàng nghìn bản sao instancing; mã màu 24 bit phân biệt được hơn 16 triệu đối tượng |
| Code | `js/core/hit-test.js` (bài Sắp xếp) | `js/webgl/picking.js` (bài Pipeline, Đồ thị) |

*[Hình 3.10 – Bài Sắp xếp khi người học kéo-thả một cột.]*
*[Hình 3.11 – Bài Pipeline khi chọn bản sao #53 bằng GPU picking.]*

## 3.7. Tiến trình hoạt động

Mục này theo dõi một khung hình cụ thể của bài Ném xiên qua 5 công đoạn. Người học ném với v₀ = 20 m/s, θ = 45°; khung vẽ rộng 746 × 574 điểm ảnh, `devicePixelRatio` = 1 *[thay bằng kích thước khi chụp hình]*.

- **C1 – Dữ liệu:** người học chọn v₀ và θ bằng thanh trượt; nét vẽ rộng 2,5 điểm ảnh, màu xanh.
- **C2 – Tính toán:** từ nghiệm giải tích, T ≈ 2,886 s, R ≈ 40,82 m, H ≈ 10,20 m, suy ra P0 = (0; 0), P1 = (20,41; 20,41), P2 = (40,82; 0) m.
- **C3 – Ánh xạ hình học:** không chia đường cong. Ma trận khung nhìn đổi mét sang điểm ảnh; CPU tính (u, v) cho 4 góc của hộp bao và nạp 4 đỉnh, mỗi đỉnh 4 số thực, vào vertex buffer. Khi phóng to 16× quanh đỉnh, chỉ ma trận khung nhìn đổi và 4 đỉnh được tính lại.
- **C4 – Render:** ma trận chiếu đưa 4 đỉnh về clip space; GPU nội suy (u, v) cho mọi điểm ảnh trong tứ giác; fragment shader tính u² − v và tô các điểm ảnh cách đường cong dưới 1,25 điểm ảnh, mép mờ thêm 1 điểm ảnh. Lớp WebGL nằm dưới, thư viện PixiJS vẽ hệ trục và chữ đè lên; nút "Xuất PNG" ghép hai lớp thành một ảnh.
- **C5 – Tương tác:** khi người học kéo thanh phóng to, sự kiện `input` gọi vẽ lại; quỹ đạo chỉ tốn 1 lệnh vẽ mỗi khung hình.

## 3.8. Kiến thức HTML5 và WebGL trong mã nguồn

Bảng 3.5 liệt kê các kiến thức HTML5 và WebGL được trình bày trong chương và vị trí cài đặt tương ứng, để người đọc đối chiếu.

**Bảng 3.5 – Kiến thức HTML5 / WebGL và mã nguồn**
| Kiến thức | File (trong `Source code/`) | Người viết |
|---|---|---|
| Thẻ `<canvas>`, bố cục trang | `index.html`, `css/style.css` | Nhóm |
| Control HTML5 (`range`, `button`, `checkbox`, `select`) | `js/core/controls.js` | Nhóm |
| Vòng lặp `requestAnimationFrame` | `benchmark/benchmark.js`; ứng dụng chính qua bộ đếm khung hình của PixiJS | Nhóm / PixiJS |
| Sự kiện bàn phím, chuột, cảm ứng | `js/core/playback.js`, `js/core/drag.js`, `js/cs/sorting.js` | Nhóm, trên hệ sự kiện của PixiJS |
| Canvas 2D API | `benchmark/renderers.js`, `js/core/export.js` | Nhóm |
| Xuất tệp: `toBlob`, `URL.createObjectURL` | `js/core/export.js`, `benchmark/` | Nhóm |
| Fullscreen API, `ResizeObserver`, `performance.now()` | `js/main.js`, `js/core/stage.js`, `benchmark/` | Nhóm |
| Context WebGL 2, biên dịch shader, liên kết chương trình, đếm lệnh vẽ | `js/webgl/gl-utils.js` | Nhóm |
| Vertex buffer, index buffer, VAO, attribute, uniform, `vertexAttribDivisor` | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js` | Nhóm |
| Vertex / fragment shader GLSL ES 3.00 | `js/webgl/*.js`, `js/tech/pipeline.js`, `js/physics/waves.js` | Nhóm |
| Loop và Blinn: phương trình ẩn, `dFdx`/`dFdy`, khử răng cưa | `js/webgl/loop-blinn.js`, `js/webgl/curve-math.js` | Nhóm |
| Mốc so sánh: nét vẽ từ N đoạn thẳng | `js/webgl/polyline.js` | Nhóm |
| Ma trận chiếu, biến đổi 2D | `js/webgl/matrix.js` | Nhóm |
| Chia đa giác thành tam giác | `js/webgl/triangulate.js` | Nhóm |
| `drawArrays`, `drawElements`, `drawArraysInstanced`, `drawElementsInstanced` | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js` | Nhóm |
| Framebuffer, texture, `readPixels` (GPU picking, đo sai số) | `js/webgl/picking.js`, `benchmark/curve.js` | Nhóm |
| Scissor test | `js/physics/projectile.js` | Nhóm |
| Chọn đối tượng bằng tính toán | `js/core/hit-test.js` | Nhóm |
| Gộp lệnh vẽ, ParticleContainer, BitmapText, Filter | Các bài dùng PixiJS | PixiJS (nhóm giải thích cơ chế) |
