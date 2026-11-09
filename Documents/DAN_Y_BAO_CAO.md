# Dàn ý báo cáo – Xây dựng ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục

Theo `FORMAT_PRESENTATION.md` (5 chương) và các lỗi cần tránh trong `MANUAL_FAULT.md`.

**Nguyên tắc chung:** báo cáo là sản phẩm chính; web app EduViz2D là chương trình minh họa cho Ch.3–4. Trọng tâm là **cách dùng HTML5 + WebGL cho các tác vụ 2D tĩnh và động**, áp dụng vào **trực quan hóa kiến thức Tin học và Vật lý**.

## Báo cáo này thuộc kiểu gì?
Thầy cần **báo cáo khảo sát và cài đặt lại**: giống một luận văn thu nhỏ, nhưng không cần phát minh gì mới (TUTORIAL: "đọc, hiểu, cài đặt lại; chưa đòi hỏi đề xuất giải pháp mới"). Mạch của cả báo cáo đi theo đúng các bước TUTORIAL 2.1–2.7:

> Bài toán là gì → người ta đã giải thế nào (khảo sát) → chọn một cách tiên tiến, giải thích nó hoạt động ra sao → cài lại, đo đạc, nhận xét.

Đây **không phải** báo cáo mô tả phần mềm (phân tích yêu cầu, use case, giới thiệu từng màn hình, hướng dẫn sử dụng).

| | Báo cáo khảo sát và cài đặt lại (**thầy cần**) | Báo cáo mô tả phần mềm (**không phải**) |
|---|---|---|
| Câu hỏi chính | Vẽ 2D tĩnh và động bằng HTML5 + WebGL thế nào để trực quan hóa kiến thức? Cách nào tốt hơn, vì sao? | App của nhóm có những chức năng gì? |
| Nội dung chính | Bài toán, các giải pháp đã có, nguyên lý, giải thuật, số liệu đo | Yêu cầu, sơ đồ use case, giao diện, hướng dẫn dùng |
| Tài liệu trích dẫn | Bài báo hội nghị/tạp chí, luận văn, tài liệu kỹ thuật | Hầu như không cần |
| Vai trò của app | Bằng chứng cho Ch.3 và nguồn số liệu cho Ch.4 | Là toàn bộ nội dung báo cáo |
| Ví dụ câu viết | "Fragment shader tính màu mỗi điểm ảnh theo biên độ tổng hợp của hai nguồn sóng, nên mọi điểm ảnh được xử lý song song trên GPU." | "Người dùng bấm nút Play để bắt đầu mô phỏng." |
| Kết quả | Bảng và biểu đồ FPS, sai số, kèm giải thích nguyên nhân | Ảnh chụp các màn hình |

Ảnh chụp app vẫn được dùng, nhưng chỉ để minh họa một kỹ thuật hay một kết quả đo, không để giới thiệu tính năng.

## Chương 1. Giới thiệu *(A)*
**1.1. Bối cảnh chung**
- Học sinh, sinh viên học nhiều khái niệm "động": thuật toán chạy từng bước, vật chuyển động, sóng lan truyền. Hình tĩnh trong sách khó diễn tả.
- Trình duyệt web có sẵn trên mọi máy và có 3 cách vẽ 2D: Canvas 2D, SVG, WebGL. Chỉ WebGL dùng được GPU.

**1.2. Động lực nghiên cứu**
- Ý nghĩa khoa học: vẽ 2D hiệu quả trên GPU (chia tam giác, gộp lệnh vẽ, khử răng cưa, tính theo điểm ảnh) là bài toán đồ họa có nhiều lời giải. Trên trình duyệt còn bị giới hạn bởi những gì WebGL cung cấp.
- Ý nghĩa thực tiễn: mô phỏng tương tác giúp người học hiểu khái niệm (Wieman 2008; Banda & Nzabahimana 2021; Wang et al. 2025). Hiệu quả phụ thuộc vào việc người học được thao tác chứ không chỉ xem (Hundhausen 2002). Muốn thao tác mượt với nhiều đối tượng thì cần cách vẽ hiệu quả.

**1.3. Phát biểu bài toán**
- **Input:** nội dung cần trực quan hóa: tham số mô hình (v₀, góc ném, độ cứng lò xo…) hoặc dữ liệu cho thuật toán (mảng, đồ thị, lưới); thời gian và thao tác của người học.
- **Output:** khung hình 2D trên trình duyệt: hình tĩnh (quỹ đạo, sơ đồ, đồ thị) và chuyển động mượt (animation, mô phỏng, phát lại từng bước); ảnh xuất ra khi cần.
- **Framework chung** (chỉ nêu công đoạn, chưa gắn phương pháp – MANUAL_FAULT mục 1):

| # | Công đoạn | Ẩn số cần tìm (MANUAL_FAULT mục 2) |
|---|---|---|
| 1 | Tính toán mô hình | Trạng thái tại thời điểm t (vị trí, vận tốc) hoặc bước tiếp theo của thuật toán |
| 2 | Ánh xạ sang cảnh 2D | Đối tượng hình học nào biểu diễn đại lượng nào; thứ tự vẽ |
| 3 | Xử lý hình học | Cách chia hình, đường cong thành tam giác (hoặc cách khác) |
| 4 | Biến đổi tọa độ | Ma trận đưa tọa độ thế giới (mét, ô lưới) về điểm ảnh |
| 5 | Tô màu điểm ảnh | Màu từng điểm ảnh; cách khử răng cưa |
| 6 | Cập nhật và tương tác | Bước thời gian mỗi khung hình; đối tượng nào bị chọn/kéo; số lần gọi vẽ mỗi khung hình |

**1.4. Đóng góp**
1. Khảo sát có hệ thống các ứng dụng trực quan hóa giáo dục và các kỹ thuật vẽ 2D trên web/GPU trong **một bảng so sánh chung** theo các công đoạn ở 1.3.
2. Trình bày lại pipeline vẽ 2D trên WebGL mà các thư viện web đang dùng, và cài đặt lại nó trong 6 bài minh họa Tin học, Vật lý.
3. Đo lại hiệu năng Canvas 2D / PixiJS / WebGL thuần trên máy hiện nay, có tách riêng ảnh hưởng của chữ, mở rộng phạm vi đo của Horak et al. 2018.
4. Kiểm chứng độ chính xác của mô phỏng so với nghiệm giải tích, và đo tốc độ tính theo điểm ảnh trên CPU so với GPU.

## Chương 2. Các công trình liên quan *(A viết khung + gộp; B, C điền phần mình)*
**2.1. Ứng dụng trực quan hóa giáo dục** – PhET, Falstad, VisuAlgo, algorithm-visualizer.org, GeoGebra. Mở từng trang, kiểm tra vẽ bằng Canvas, SVG hay WebGL (đếm thẻ `canvas`/`svg`), ghi ảnh chụp.

**2.2. Kỹ thuật vẽ 2D trên web và trên GPU** – Canvas 2D, SVG, WebGL thuần, PixiJS, CanvasKit/Skia; các bài báo ở bảng tài liệu bên dưới.

**2.3. Quá trình phát triển** (FORMAT_PRESENTATION yêu cầu "trình bày quá trình phát triển của các giải pháp"). Trình bày theo trục thời gian, mỗi mốc nói rõ nó giải quyết công đoạn nào ở 1.3:
- Công nghệ trên web: Flash/Java applet → HTML5 Canvas 2D và SVG → WebGL 1.0 (2011) → WebGL 2.0 (2017) → WebGPU. Mốc năm cần đối chiếu với trang của Khronos và W3C trước khi đưa vào báo cáo.
- Kỹ thuật vẽ 2D trên GPU: Loop & Blinn 2005 → Green 2007 → Kilgard & Bolz 2012 → Ganacim 2014 → Li 2016.
- Ứng dụng giáo dục: các applet Java (Falstad, bản PhET cũ) → chuyển sang HTML5 (PhET, VisuAlgo…).

**2.4. Bảng so sánh chung** – mọi giải pháp ở 2.1 và 2.2 điền vào **cùng một bảng**, cột theo các công đoạn ở 1.3 (MANUAL_FAULT mục 3), thêm cột **khuyết điểm** (mục 8):

| Giải pháp | Năm | Nền tảng | Tính toán mô hình | Xử lý hình học | Tô màu / khử răng cưa | Tĩnh / động / tương tác | Hiệu năng (số đối tượng) | Khuyết điểm |
|---|---|---|---|---|---|---|---|---|
| PhET | | | | | | | | |
| Falstad | | | | | | | | |
| VisuAlgo | | | | | | | | |
| algorithm-visualizer.org | | | | | | | | |
| GeoGebra | | | | | | | | |
| Canvas 2D | | | | | | | | |
| SVG | | | | | | | | |
| WebGL thuần | | | | | | | | |
| PixiJS (trên WebGL) | | | | | | | | |
| CanvasKit / Skia (WASM) | | | | | | | | |
| Loop & Blinn 2005 | | | | | | | | |
| Green 2007 | | | | | | | | |
| Kilgard & Bolz 2012 | | | | | | | | |
| Ganacim et al. 2014 | | | | | | | | |
| Li et al. 2016 | | | | | | | | |
| Horak et al. 2018 (so sánh) | | | | | | | | |

**2.5. So sánh báo cáo của nhóm với các công trình trên**
| Tiêu chí | Các bài báo kỹ thuật | Các nghiên cứu giáo dục | Báo cáo của nhóm |
|---|---|---|---|
| Loại đóng góp | Thuật toán vẽ mới (Loop & Blinn, Kilgard, Ganacim, Li) hoặc phép đo hẹp (Horak) | Đánh giá hiệu quả học tập, có người học tham gia | Khảo sát + cài lại + đo |
| Nền tảng | GPU máy tính, CUDA, phần mở rộng OpenGL riêng | Ứng dụng có sẵn (PhET…) | Trình duyệt: HTML5 + WebGL |
| Phạm vi | Thường chỉ vẽ tĩnh một loại đối tượng | Một ứng dụng cụ thể | Tĩnh và động: vector, chữ, nhiều đối tượng, shader, animation, tương tác |
| Đánh giá | Tốc độ, chất lượng ảnh trên phần cứng của họ | Điểm kiểm tra của người học | FPS, thời gian khung hình, số lần gọi vẽ, sai số so với nghiệm giải tích |

**Không được tự nhận:** nhanh hơn hay đẹp hơn các bài kỹ thuật (nhóm không cài lại thuật toán của họ), hay giúp học tốt hơn PhET (nhóm không đo hiệu quả học tập).

**Câu kết chương mẫu** (trả lời "người ta đã làm gì, nhóm làm gì"):
> "Các ứng dụng giáo dục như PhET, VisuAlgo cho thấy giá trị của mô phỏng tương tác. Về kỹ thuật, các giải pháp vẽ 2D tiên tiến như [Kilgard 2012], [Ganacim 2014], [Li 2016] đòi hỏi tính năng GPU chưa có trong WebGL (phần mở rộng riêng của NVIDIA, compute shader). Vì vậy đồ án trình bày và cài đặt lại pipeline chia tam giác kết hợp gộp lệnh vẽ mà các thư viện web đang dùng, áp dụng vào các bài trực quan hóa Tin học và Vật lý, rồi đo hiệu năng và độ chính xác trên trình duyệt hiện nay, mở rộng phạm vi đo của [Horak 2018]."

**Tài liệu** (DOI đã đối chiếu với Crossref; tóm tắt cần kiểm tra lại khi đọc bài gốc):
| Tài liệu | DOI | Nội dung chính | Dùng ở | Ai đọc |
|---|---|---|---|---|
| Loop & Blinn, *Resolution independent curve rendering using programmable graphics hardware*, ACM TOG 2005 | 10.1145/1073204.1073303 | Vẽ đường cong Bézier sắc nét ở mọi độ phóng bằng shader | 2.2, Ch.5 | A |
| Green, *Improved alpha-tested magnification for vector textures and special effects*, SIGGRAPH 2007 Courses | 10.1145/1281500.1281665 | Signed distance field cho chữ và hình | 2.2, Ch.3 (chữ) | B |
| Kilgard & Bolz, *GPU-accelerated path rendering*, ACM TOG 2012 | 10.1145/2366145.2366191 | Vẽ path vector hoàn toàn trên GPU (stencil, then cover) | 2.2 | A |
| Ganacim et al., *Massively-parallel vector graphics*, ACM TOG 2014 | 10.1145/2661229.2661274 | Vẽ đồ họa vector song song trên GPU | 2.2 | C |
| Li, Hou, Zhou, *Efficient GPU path rendering using scanline rasterization*, ACM TOG 2016 | 10.1145/2980179.2982434 | Tô path theo dòng quét trên GPU | 2.2 | C |
| Horak, Kister, Dachselt, *Comparing rendering performance of common web technologies for large graphs*, IEEE VIS 2018 poster | (poster, không có DOI) | FPS của SVG/Canvas/WebGL theo số node | 2.2, Ch.4 | A |
| Meisters, *Polygons have ears*, American Mathematical Monthly 1975 | 10.1080/00029890.1975.11993898 | Chứng minh mọi đa giác đơn đều có "tai", cơ sở của ear clipping | Ch.3 | A |
| Eder, Held, Palfrader, *Parallelized ear clipping for the triangulation and constrained Delaunay triangulation of polygons*, Computational Geometry 2018 | 10.1016/j.comgeo.2018.01.004 | Ear clipping song song, bản cải tiến gần đây | Ch.3 | A |
| Carucci, *Inside geometry instancing*, GPU Gems 2 (2005), chương 3 | (sách, không có DOI; chưa đối chiếu) | Kỹ thuật instancing để vẽ nhiều bản sao | Ch.3 | B |
| Wieman, Adams, Perkins, *PhET: Simulations that enhance learning*, Science 2008 | 10.1126/science.1161948 | Thiết kế mô phỏng PhET | 1.2, 2.1 | C |
| Banda & Nzabahimana, *Effect of integrating PhET simulations on students' conceptual understanding in physics*, Phys. Rev. PER 2021 | 10.1103/PhysRevPhysEducRes.17.023108 | Tổng quan 31 nghiên cứu về PhET | 1.2 | C |
| Wang, Zhang, Pang, *Virtual experiments in physics education: a systematic literature review*, Res. Sci. Technol. Educ. 2025 | 10.1080/02635143.2024.2327995 | Tổng quan thí nghiệm ảo trong dạy Vật lý | 1.2, 2.1 | C |
| Hundhausen, Douglas, Stasko, *A meta-study of algorithm visualization effectiveness*, JVLC 2002 | 10.1006/jvlc.2002.0237 | Mức tham gia của người học quyết định hiệu quả | 1.2, 2.1 | B |
| Shaffer et al., *Algorithm visualization: the state of the field*, ACM TOCE 2010 | 10.1145/1821996.1821997 | Khảo sát hơn 500 công cụ minh họa thuật toán | 2.1 | B |
| OpenStax, *University Physics* vol. 1, mục 4.3 | – | Nghiệm tham chiếu ném xiên | Ch.4 | C |

## Chương 3. Phương pháp *(A: pipeline + đồ thị; B: gộp lệnh vẽ + thuật toán; C: shader + mô phỏng)*
Giải pháp chọn: **pipeline vẽ 2D trên WebGL theo kiểu gộp lệnh vẽ / instancing (cách PixiJS làm) + shader tính theo điểm ảnh**, kết hợp mô hình tính toán của từng bài.

TUTORIAL 2.6 yêu cầu "chọn phương pháp tiên tiến **đã công bố**". Pipeline này không nằm trọn trong một bài báo, nên mỗi bước phải dẫn nguồn đã công bố: ear clipping (Meisters 1975; Eder et al. 2018), instancing (Carucci 2005), SDF cho chữ (Green 2007), đặc tả WebGL 2.0 của Khronos.

Trình bày theo thứ tự:
1. **Sơ đồ chung:** mô hình (thuật toán / mô phỏng) → HTML5 (canvas, `requestAnimationFrame`, sự kiện chuột) → WebGL (buffer → vertex shader → rasterization → fragment shader) → khung hình.
2. **Nguyên lý:** vì sao GPU nhanh hơn cho 2D: xử lý song song, giảm số lần gọi vẽ.
3. **Phương pháp và giải thuật:**
   - Đồ họa: chia đa giác thành tam giác; ma trận chiếu 2D; gộp lệnh vẽ và instancing; khử răng cưa, SDF cho chữ.
   - Tương tác (công đoạn 6, ẩn số "đối tượng nào bị chọn"): so sánh hai cách chọn đối tượng trên hình vẽ bằng WebGL:
     - **Tính toán** (hit-test): suy chỉ số cột/ô từ tọa độ chuột. Nhanh, O(1), nhưng chỉ dùng được khi phần tử xếp đều (bài sắp xếp, A*).
     - **GPU picking**: vẽ lại cảnh bằng "màu mã" vào framebuffer ẩn rồi `readPixels` tại vị trí chuột. Đúng với mọi hình dạng, kể cả hàng chục nghìn bản sao instancing, đổi lại phải vẽ thêm một lượt và chờ GPU trả dữ liệu (bài pipeline, đồ thị).
   - Vòng lặp tương tác: sự kiện chuột (HTML5) → cập nhật dữ liệu → nạp lại buffer (`bufferSubData`) → vẽ lại.
   - Mô hình: thuật toán viết dưới dạng chuỗi bước để phát lại (sắp xếp, BFS/DFS/Dijkstra, A*); tích phân số Euler / Verlet / RK4; công thức giao thoa sóng trong fragment shader.
4. **Minh họa:** đoạn code ngắn + hình chụp từ app.
5. **Tiến trình hoạt động** (MANUAL_FAULT mục 5): đi qua một khung hình cụ thể bằng bài **Pipeline WebGL từng bước**, chụp hình 5 bước: đỉnh → chia tam giác → ma trận → fragment shader → instancing. Sau đó lấy ví dụ bài ném xiên: tham số → vị trí tại t → tọa độ điểm ảnh → tam giác → điểm ảnh.

**Bảng kiến thức HTML5 / WebGL ↔ code nhóm tự viết** (dùng để trích code vào báo cáo; phần nào PixiJS làm thì ghi rõ):
| Kiến thức | File (trong `Source code/`) | Ai viết |
|---|---|---|
| Thẻ `<canvas>`, bố cục trang | `index.html`, `css/style.css` | Nhóm |
| Control HTML5 (`range`, `button`, `checkbox`, `select`) | `js/core/controls.js` | Nhóm |
| Vòng lặp `requestAnimationFrame` | `benchmark/benchmark.js` (gọi trực tiếp); app chính qua ticker của PixiJS | Nhóm / PixiJS |
| Sự kiện bàn phím (phím tắt) | `js/core/playback.js` | Nhóm |
| Sự kiện chuột/cảm ứng (kéo-thả) | `js/core/drag.js` | Nhóm, trên hệ sự kiện của PixiJS |
| Canvas 2D API | `benchmark/renderers.js` (canvas2d), `js/core/export.js` | Nhóm |
| Xuất file: `toBlob`, `URL.createObjectURL`, `<a download>` | `js/core/export.js`; xuất CSV ở `benchmark/benchmark.js` | Nhóm |
| Fullscreen API | `js/main.js` | Nhóm |
| `performance.now()` để đo thời gian | `benchmark/benchmark.js`, `js/tech/pipeline.js` | Nhóm |
| ES modules | Toàn bộ `js/` | Nhóm |
| Tạo context WebGL 2 | `js/webgl/gl-utils.js` (`getWebGL2`) | Nhóm |
| Biên dịch shader, liên kết program | `js/webgl/gl-utils.js` | Nhóm |
| Vertex buffer, index buffer, VAO | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js` | Nhóm |
| Attribute, uniform, `vertexAttribDivisor` | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js` | Nhóm |
| Vertex shader, fragment shader (GLSL ES 3.0) | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js`, `js/physics/waves.js` | Nhóm |
| Ma trận chiếu và biến đổi 2D | `js/webgl/matrix.js` | Nhóm |
| Chia đa giác thành tam giác (ear clipping) | `js/webgl/triangulate.js` | Nhóm |
| `drawArrays`, `drawElements`, `drawArraysInstanced`, `drawElementsInstanced` | `js/webgl/instanced-rects.js`, `js/tech/pipeline.js` | Nhóm |
| Đếm lệnh vẽ; độ phân giải theo `devicePixelRatio` | `js/webgl/gl-utils.js` | Nhóm |
| Framebuffer, texture, `readPixels` (GPU picking) | `js/webgl/picking.js`, dùng ở `js/tech/pipeline.js` | Nhóm |
| Chọn đối tượng bằng tính toán (hit-test) | `js/core/hit-test.js`, dùng ở `js/cs/sorting.js` | Nhóm |
| ResizeObserver (khung vẽ tự đổi kích thước) | `js/core/stage.js` | Nhóm |
| Gộp lệnh vẽ (batching), ParticleContainer, Text/BitmapText, Filter | Các bài dùng PixiJS | PixiJS (nhóm giải thích cơ chế) |

## Chương 4. Cài đặt và thử nghiệm *(cả nhóm; A tổng hợp)*
**4.1. Môi trường:** CPU, GPU, trình duyệt + phiên bản, độ phân giải; HTML5 + JavaScript + PixiJS 8.22.0.

**4.2. Các bài minh họa và tác vụ 2D tương ứng**
| Bài | Kiến thức | Tác vụ 2D minh họa | Tĩnh / động | Người làm |
|---|---|---|---|---|
| Ném xiên | Vật lý | Vẽ vector (trục, đường cong, chữ) + animation theo thời gian | Cả hai | C (bản đầu đã có) |
| Con lắc/lò xo | Vật lý | Cập nhật trạng thái theo thời gian | Động | C |
| Giao thoa sóng | Vật lý | Tính màu từng điểm ảnh bằng fragment shader | Động | C |
| Sắp xếp | Tin học | Vẽ rất nhiều đối tượng bằng **WebGL thuần** (instancing); kéo-thả đổi chỗ, vẽ dữ liệu bằng chuột (hit-test) | Động | B (phần vẽ + tương tác đã có) |
| BFS/DFS/Dijkstra | Tin học | Tương tác chọn, kéo-thả; vẽ chữ hiệu quả | Cả hai | A |
| A* | Tin học | Lưới nhiều ô, cập nhật từng ô | Động | B |
| Pipeline WebGL từng bước | Kỹ thuật | Toàn bộ pipeline WebGL thuần: đỉnh, chia tam giác, ma trận, shader, instancing | Cả hai | A (đã xong) |
| Xuất PNG | – | Xuất ảnh tĩnh từ canvas | Tĩnh | A (đã xong) |
| Benchmark | – | So sánh Canvas 2D / PixiJS / WebGL thuần | – | A (đã xong, chưa đo trên máy thật) |

**4.3. Bộ thử nghiệm** (thay cho "tập dữ liệu", MANUAL_FAULT mục 7; lưu vào thư mục Data)
Bài toán vẽ 2D trên trình duyệt không có tập dữ liệu chuẩn (standard dataset, TUTORIAL 2.4), nên nhóm tự xây bộ kịch bản và ghi rõ tiêu chí xây dựng. Cách tăng số đối tượng theo thang log mượn từ Horak 2018.

| Thử nghiệm | Mục đích | Bộ dữ liệu / kịch bản (số mẫu) | Tiêu chí xây dựng, thách thức |
|---|---|---|---|
| (a) Hiệu năng vẽ | Cách vẽ nào chịu được nhiều đối tượng nhất, và vì sao | 3 cách vẽ × 5 mức (1k, 5k, 10k, 50k, 100k) × có/không có chữ = 30 lần đo, mỗi lần 3 s; cảnh sinh từ hạt giống cố định | Tăng theo thang log để thấy điểm gãy; chữ là trường hợp khó (Horak 2018) |
| (b) Độ chính xác mô phỏng | Integrator nào sai ít nhất, năng lượng trôi bao nhiêu | Ném xiên, lò xo: 3 integrator × 4 bước thời gian (dt = 1/240, 1/60, 1/30, 1/15 s) | dt lớn là trường hợp khó; có nghiệm giải tích để so |
| (c) CPU so với GPU | GPU nhanh hơn CPU bao nhiêu khi tính theo từng điểm ảnh | Giao thoa sóng ở 4 độ phân giải (480×270 đến 1920×1080), bản JavaScript + Canvas 2D và bản fragment shader | Số điểm ảnh tăng theo bình phương kích thước |
| (d) Thuật toán | A* tiết kiệm bao nhiêu so với Dijkstra | Lưới 20×20, 50×50, 100×100 × mật độ tường 0 %, 20 %, 35 % | Tường dày, đường đi vòng là trường hợp khó cho A* |
| (e) Instancing | Một lệnh vẽ so với N lệnh vẽ | Bài pipeline: 1, 10, 100, 1.000, 10.000 bản sao, bật/tắt instancing | Nhiều bản sao làm lộ chi phí của mỗi lệnh vẽ |

**4.4. Độ đo** (MANUAL_FAULT mục 6)
| Loại | Độ đo |
|---|---|
| Hiệu năng | FPS, thời gian mỗi khung hình (trung bình, p95), thời gian CPU cho phần vẽ (ms), số lần gọi vẽ |
| Độ chính xác | Sai số vị trí so với nghiệm giải tích; độ trôi năng lượng; khác biệt điểm ảnh giữa bản CPU và GPU của bài sóng |
| Độ phức tạp | Độ phức tạp theo số đối tượng n hoặc số điểm ảnh; số ô/node phải duyệt (Dijkstra, A*) |

Đồ án nhắm tới **độ phức tạp tính toán** (thời gian vẽ khi số đối tượng tăng) và kiểm chứng **độ chính xác** (mô phỏng so với nghiệm giải tích), theo MANUAL_FAULT mục 6 và 8.

**4.5. Kết quả và bàn luận:** bảng + biểu đồ (thang log theo số đối tượng); giải thích vì sao kết quả như vậy dựa vào Ch.3. Số liệu lấy từ trang `benchmark/` (xuất CSV) và từ bài pipeline, đo trên máy thật có cửa sổ hiện, không đo trong tab ẩn.

**Không áp dụng:** MANUAL_FAULT mục 4 (giai đoạn huấn luyện, loss function, đánh nhãn) dành cho đề tài học máy. Báo cáo ghi rõ một câu: đồ án không có giai đoạn huấn luyện; "groundtruth" tương ứng là nghiệm giải tích và ảnh tham chiếu.

## Chương 5. Kết luận và hướng phát triển *(A)*
- Tóm tắt kết quả đo được.
- Hạn chế: chưa đo hiệu quả học tập với người học thật; mới có 2 môn.
- Hướng phát triển: đánh giá với người học (test trước/sau); thêm môn Toán; vẽ đường cong bằng shader (Loop & Blinn); chuyển sang WebGPU để dùng compute shader.

## Đối chiếu nhanh với MANUAL_FAULT
| Mục | Xử lý ở đâu |
|---|---|
| 1. Framework chung | 1.3, bảng công đoạn |
| 2. Ẩn số | 1.3, cột "Ẩn số cần tìm" |
| 3. Related works cùng tiêu chí | 2.4, một bảng chung |
| 4. Giai đoạn huấn luyện | Không áp dụng, ghi rõ trong Ch.4 |
| 5. Tiến trình hoạt động | Ch.3 mục 5 |
| 6. Độ đo | 4.4 |
| 7. Tập dữ liệu | 4.3 |
| 8. Khuyết điểm related works | 2.4 cột "Khuyết điểm", 2.5 |
