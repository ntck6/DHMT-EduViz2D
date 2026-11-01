# Kế hoạch đồ án: HTML5 + WebGL – Ứng dụng 2D hỗ trợ giáo dục (Tin học & Vật lý)

## Context
- Đề tài (Documents/PROJECT_NAME.md): xây dựng ứng dụng web 2D **tĩnh và động** bằng HTML5 + WebGL, trực quan hóa kiến thức giáo dục, khai thác GPU.
- Thầy yêu cầu (TUTORIAL.md, FORMAT_PRESENTATION.md, MANUAL_FAULT.md): đọc hiểu – cài đặt lại; báo cáo 5 chương; phải có framework chung (không gắn phương pháp cụ thể), bảng so sánh related works theo **cùng tiêu chí**, **độ đo đánh giá** (độ chính xác + độ phức tạp tính toán), bộ dữ liệu/kịch bản thử nghiệm có thách thức, bảng phân công có deadline.
- Nộp theo cấu trúc thư mục REGULATION.md (Doc, BTLopNha, Slide, Reference, Data, Source code, Video clip, Personal Information), gửi link Drive **đúng ngày thi lý thuyết** (không trước/không sau).
- Nhóm 3 người, tập trung **Tin học + Vật lý**, được dùng thư viện. Lập kế hoạch tuần 4 (21/10), chốt tuần 11 (13/12).

## Đề xuất đề tài: "EduViz2D – Phòng thí nghiệm ảo 2D trên WebGL"
Một web app, 1 engine render chung, 2 module, mỗi demo có **chế độ tĩnh** (sơ đồ, đồ thị, trường) và **chế độ động** (animation, mô phỏng, tương tác chuột/slider, play/pause/step).

**Module Tin học – Algorithm Visualizer**
1. Sắp xếp (Bubble/Quick/Merge/Heap): cột bars vẽ bằng GPU (batching/instancing) → chạy được 10k–100k phần tử mượt (điểm khác biệt so với Canvas2D).
2. Đồ thị: BFS/DFS/Dijkstra trên đồ thị kéo-thả node.
3. Tìm đường A* trên lưới (người dùng vẽ tường), so sánh với Dijkstra.
   - Kỹ thuật: thuật toán ghi lại chuỗi "step" → renderer phát lại (tua, chậm/nhanh).

**Module Vật lý – Physics Lab**
1. Ném xiên / chuyển động có lực cản: quỹ đạo tĩnh + animation, vector vận tốc.
2. Con lắc đơn / lò xo: so sánh tích phân số **Euler – Verlet – RK4** (năng lượng trôi bao nhiêu).
3. Giao thoa sóng 2 nguồn: tính hoàn toàn trên **fragment shader** (showcase GPU, mỗi pixel 1 phép tính).
4. (Tùy thời gian) Đường sức điện trường của các điện tích kéo-thả / hệ hạt (particle system).

## Công nghệ
Nguyên tắc: **đúng tên đề tài (HTML5 + WebGL), ít công cụ phải học, nộp bài chạy được offline.** Không dùng TypeScript, Vite hay bất kỳ bước build nào.

| Lớp | Lựa chọn | Dùng ở đâu / vì sao |
|---|---|---|
| Trang web (HTML5) | HTML5 + CSS: thẻ `<canvas>`, các control có sẵn `<input type="range">`, `<button>`, `<select>` | Bảng điều khiển (tốc độ, số phần tử, tham số vật lý) – không cần thư viện UI |
| Ngôn ngữ | **JavaScript thuần (ES6 modules)** – `import/export` chạy thẳng trên trình duyệt | Chia code theo file/module, không cần build |
| Vòng lặp & tương tác (HTML5 API) | `requestAnimationFrame`, Pointer Events (kéo-thả), `performance.now()` (đo FPS) | Chế độ động, kéo node/điện tích, benchmark |
| Render chính | **PixiJS v8** (thư viện 2D chạy trên WebGL) – bản 8.22.0, tải sẵn vào `lib/pixi.min.js` (đặt đuôi `.js` vì `.mjs` bị Python trên Windows trả sai kiểu file) | Engine chung, sắp xếp, đồ thị, A*, ném xiên, con lắc: vẽ nhanh, nhiều đối tượng, dễ học |
| Shader tự viết | **GLSL fragment shader** chạy qua **PixiJS Filter** | Giao thoa sóng (theo tài liệu C đã chuẩn bị): logic sóng vẫn do nhóm tự viết, không cần tự tạo context WebGL riêng |
| Render WebGL thuần | **WebGL 2 API** (không qua thư viện) | Bản vẽ bars bằng `drawArraysInstanced` cho thử nghiệm Ch.4(a). Đây là phần thể hiện rõ kiến thức đồ họa cho môn học |
| Đối chứng | **Canvas 2D API** | Chỉ dùng trong benchmark để so sánh với WebGL |
| Thuật toán & vật lý | Tự viết (không dùng engine vật lý, không dùng thư viện thuật toán) | Có nội dung trình bày ở Ch.3 |
| Đồ thị kết quả Ch.4 | Xuất số liệu ra CSV → vẽ bằng Excel/Google Sheets | Không cần thêm thư viện vẽ biểu đồ trong app |
| Công cụ | VS Code + tiện ích **Live Server**; Git + GitHub; GitHub Pages để chia sẻ link demo | Live Server cần thiết vì ES modules không chạy khi mở file trực tiếp (`file://`) |

**Cấu trúc thư mục source code (đề xuất)**
```
Source code/
├── index.html            # trang chủ + menu chọn bài (A)
├── css/style.css
├── lib/pixi.min.js       # thư viện tải sẵn → chạy offline
├── js/
│   ├── core/             # (A) khởi tạo PixiJS, camera pan/zoom, UI chung, đo FPS
│   ├── webgl/            # shader GLSL (C: sóng) · helper WebGL thuần (A: benchmark instancing)
│   ├── cs/               # sorting, A*, step-recorder (B) · graph BFS/DFS/Dijkstra (A)
│   └── physics/          # ném xiên, con lắc/lò xo, integrator, sóng, điện trường (C)
├── tests/                # kiểm tra công thức bằng `node --test`
├── benchmark/            # trang benchmark Canvas2D vs PixiJS vs WebGL thuần (A)
└── README.md             # cách chạy: mở bằng Live Server hoặc `python -m http.server`
```

## Gắn với báo cáo
- Ch.1 Framework chung: *Input (tham số bài học/dữ liệu) → Mô hình hóa/Tính toán (thuật toán hoặc mô phỏng) → Ánh xạ sang hình học 2D → Render GPU → Tương tác*.
- Ch.2 Related works (cùng bảng tiêu chí): PhET, Falstad, GeoGebra, VisuAlgo, algorithm-visualizer.org, p5.js/Processing… tiêu chí: công nghệ render, tĩnh/động, tương tác, hiệu năng số đối tượng, mã nguồn mở, môn học.
- Ch.3 Phương pháp:
  - **HTML5**: thẻ canvas, vòng lặp `requestAnimationFrame`, xử lý sự kiện chuột/cảm ứng.
  - **WebGL**: pipeline (vertex buffer → vertex shader → rasterization → fragment shader), ma trận chiếu 2D, batching/instancing; PixiJS dùng các kỹ thuật này bên dưới như thế nào.
  - Mô hình step-recording cho thuật toán; các integrator Euler/Verlet/RK4; công thức giao thoa sóng trong shader.
- Ch.4 Thử nghiệm ("dataset" = bộ kịch bản):
  - (a) **FPS/frame time** của Canvas2D vs PixiJS vs WebGL thuần (instancing) theo số đối tượng 1k → 100k.
  - (b) **Sai số** Euler/Verlet/RK4 so với nghiệm giải tích + năng lượng theo thời gian.
  - (c) Số bước/node đã duyệt và thời gian chạy Dijkstra vs A* trên các lưới khác kích thước/mật độ tường.
  - (d) Khảo sát nhỏ 10–15 bạn (dễ hiểu, hữu ích).
  - Ghi rõ môi trường thử nghiệm: CPU, GPU, trình duyệt + phiên bản, độ phân giải màn hình.
- Ch.5 Kết luận & hướng phát triển (3D, thêm môn Toán, WebGPU).

## Phân công (3 người)
| Thành viên | Code | Báo cáo / khác |
|---|---|---|
| **A – Leader (bạn)** | Khung dự án (`index.html`, cấu trúc thư mục), engine chung trên PixiJS (camera 2D, đo FPS, UI chung), trang benchmark (Canvas2D / PixiJS / WebGL instancing), tích hợp & deploy GitHub Pages; **Graph BFS/DFS/Dijkstra** (đồ thị kéo-thả node) | Ch.1, Ch.3 phần HTML5 + WebGL pipeline + thuật toán đồ thị, Ch.4(a), tổng hợp Doc, Personal Information, quản lý Drive |
| **B – Tin học** | Sorting, A* lưới, cơ chế step-recording/playback (A dùng lại cho BFS/DFS/Dijkstra) | Ch.2 phần algorithm visualization, Ch.3 phần sắp xếp + A*, Ch.4(c), Slide (chính) |
| **C – Vật lý** | Ném xiên, con lắc/lò xo + 3 integrator, shader giao thoa sóng (GLSL qua PixiJS Filter), (điện trường/hạt) | Ch.2 phần physics simulation, Ch.3 integrator/shader, Ch.4(b), Video demo |
| Cả nhóm | Review chéo code mỗi tuần | Ch.5, khảo sát người dùng, BTLopNha, Reference |

> Lưu ý: B xong cơ chế step-recording trước (tuần 5) để A dùng chung khi làm BFS/DFS/Dijkstra; Ch.4(c) so sánh Dijkstra (A) với A* (B) – hai người thống nhất định dạng lưới/đồ thị đầu vào.

## Tìm tài liệu – cụ thể là tìm gì
Mỗi tài liệu tìm được ghi 1 **phiếu tóm tắt** (sheet chung của nhóm): *Tên – Tác giả – Năm – Nguồn/link – Nội dung chính (3–5 dòng) – Dùng cho chương nào – Điền được tiêu chí nào của bảng so sánh*. File PDF/link lưu vào thư mục `Reference`.

**1. Tài liệu học kỹ thuật (để code và viết Ch.3)** – chủ yếu để học, trích dẫn vài nguồn chính
| Tài liệu | Ai đọc | Đọc phần nào |
|---|---|---|
| MDN Web Docs – *HTML canvas*, *JavaScript modules*, *requestAnimationFrame*, *Pointer events* | Cả 3 (A đọc trước – làm khung dự án) | Nền tảng HTML5 + JS dùng trong app |
| MDN Web Docs – *WebGL tutorial* | Cả 3 | WebGL là gì, khác Canvas2D thế nào, pipeline cơ bản |
| webgl2fundamentals.org | A, C | Fundamentals, 2D Translation/Matrices, Instanced drawing (A – benchmark), Shaders & GLSL (C) |
| *The Book of Shaders* (thebookofshaders.com) | C | Fragment shader → giao thoa sóng |
| PixiJS v8 docs + examples (pixijs.com) | Cả 3 | Application, Container, Graphics, events (kéo-thả), ParticleContainer |
| LearnOpenGL – *Getting started* (khái niệm pipeline) | A | Hình vẽ pipeline đồ họa để đưa vào Ch.3 |

**2. Công trình/ứng dụng liên quan (cho Ch.2 – bảng so sánh)** – mở dùng thử, chụp ảnh, điền bảng
- Tin học (B tìm): VisuAlgo, algorithm-visualizer.org, USFCA Data Structure Visualizations (Galles), PathFinding.js visual.
- Vật lý (C tìm): PhET (Univ. Colorado), Falstad simulations, myPhysicsLab, Matter.js demos.
- Đa môn (A tìm): GeoGebra, p5.js/Processing, Desmos.
- **Tiêu chí điền cho mọi công trình (giống nhau, theo MANUAL_FAULT)**: công nghệ render (Canvas2D/WebGL/Flash/Java), hỗ trợ tĩnh/động, mức tương tác, số đối tượng vẽ mượt, chạy trên web/mobile, mã nguồn mở, môn học, điểm yếu.

**3. Bài báo khoa học (cho Ch.1 động lực + Ch.2)** – tìm trên Google Scholar, IEEE Xplore, ACM DL; ưu tiên survey/overview
| Từ khóa tìm | Ai | Ví dụ bài nên có (kiểm tra lại trước khi trích) |
|---|---|---|
| `algorithm visualization effectiveness survey`, `algorithm visualization state of the field` | A + B | Hundhausen et al. 2002 – *A Meta-Study of Algorithm Visualization Effectiveness*; Shaffer et al. 2010 – *Algorithm Visualization: The State of the Field* (ACM TOCE); Naps et al. 2002 – *Exploring the Role of Visualization and Engagement in CS Education* |
| `interactive simulations physics education`, `PhET` | C | Wieman, Adams, Perkins 2008 – *PhET: Simulations That Enhance Learning* (Science) |
| `WebGL performance comparison Canvas`, `web-based visualization GPU` | A | Bài so sánh hiệu năng Canvas2D/SVG/WebGL → làm cơ sở cho thử nghiệm Ch.4(a) |
| `numerical integration real-time physics simulation`, `Verlet integration energy` | C | Tài liệu so sánh Euler/Verlet/RK4 (vd. *Game Physics* – Eberly, hoặc bài giảng numerical methods) |
| `educational visualization WebGL`, `virtual laboratory web` | A | Các ứng dụng giáo dục dùng WebGL gần đây (2018–2025) |

**Chỉ tiêu tuần 4–5**: mỗi người ≥ 5 tài liệu; chốt bảng so sánh nháp ở họp tuần 5.

## Tài liệu đã chốt (cập nhật 01/11)
DOI các bài báo đã đối chiếu với Crossref; poster của Horak đã đối chiếu với trang TU Dresden.

| Tài liệu | Dùng cho | Ghi chú |
|---|---|---|
| **Horak, Kister, Dachselt 2018** – *Comparing Rendering Performance of Common Web Technologies for Large Graphs* (poster IEEE VIS) | Ch.3 (lý do chọn công nghệ), **Ch.4(a)** (mượn phương pháp đo FPS theo số đối tượng) | Tài liệu sát đồ án nhất: bản WebGL của họ dùng PixiJS. Là poster 1 trang, số liệu phần cứng 2018 → nhóm phải tự đo |
| Hundhausen et al. 2002; Shaffer et al. 2010 | Ch.1, Ch.2, Ch.4(d) | Cơ sở cho nhánh Tin học |
| Wieman et al. 2008; Banda & Nzabahimana 2021; Wang et al. 2025 | Ch.1, Ch.2 | Cơ sở cho nhánh Vật lý |
| OpenStax *University Physics* vol. 1, mục 4.3 | Ch.3, Ch.4 | Nghiệm tham chiếu ném xiên. Còn thiếu trong danh mục tham khảo, cần bổ sung |
| PixiJS Filters; The Book of Shaders; webgl2fundamentals | Ch.3 | Tài liệu kỹ thuật |
| algorithm-visualizer.org | Ch.2, Ch.3 | Dẫn chứng cho mô hình step-recording |
| ~~Chen & Nishita 2002/2003~~ (jGL, VRML, Java) | Bỏ | Đồ họa 3D bằng Java, lệch đề tài; nếu giữ thì chỉ nhắc 1 câu về lịch sử trước WebGL |

## Timeline (tuần 4 → 11)
| Tuần | Thời gian | Mục tiêu (milestone cuối tuần) |
|---|---|---|
| 4 | 21–27/10 | Chốt đề tài & phân công; tìm tài liệu; cả nhóm cài VS Code + Live Server + Git |
| 5 | 28/10–3/11 | A: khung dự án (`index.html`, PixiJS trong `lib/`, menu, đo FPS) đẩy lên GitHub + GitHub Pages *(code đã xong 01/11, còn đẩy lên GitHub)*; B: sorting + step-recording chạy; C: ném xiên chạy *(bản đầu đã có, C nhận lại để hoàn thiện)*; nháp Ch.1–2 |
| 6 | 4–10/11 | A: đồ thị BFS/DFS/Dijkstra + camera pan/zoom; B: bắt đầu A*; C: con lắc/lò xo + Euler/Verlet/RK4 |
| 7 | 11–17/11 | **Demo giữa kỳ nội bộ**: tích hợp 2 module, chế độ tĩnh/động; Ch.2 xong bảng so sánh |
| 8 | 18–24/11 | A: trang benchmark (Canvas2D / PixiJS / WebGL instancing); B: hoàn thiện A*; C: shader giao thoa sóng (+ điện trường nếu kịp); chạy thử nghiệm Ch.4 lần 1 |
| 9 | 25/11–1/12 | **Feature freeze**; sửa lỗi, polish UI; chạy đủ thử nghiệm, khảo sát; viết Ch.3–4 |
| 10 | 2–8/12 | Hoàn thiện Doc (.doc+.pdf), Slide (.ppt+.pdf), video demo, BTLopNha; kiểm tra source chạy offline trên máy khác |
| 11 | 9–13/12 | Rà soát, đóng gói đúng 8 thư mục REGULATION, tập thuyết trình; chờ đúng ngày thi để gửi mail `[K2024-CLC-DHMT-TEN NHOM]` |

Họp nhóm 1 lần/tuần (15–30 phút): báo cáo đã làm / sẽ làm / vướng mắc; Git + GitHub, mỗi người 1 nhánh, merge qua PR do A review.

## Rủi ro & dự phòng
- Trễ tiến độ → cắt demo "điện trường/hạt" và giữ 3+3 demo cốt lõi.
- Báo cáo dồn cuối → mỗi tuần viết song song phần chương tương ứng với code vừa làm.
- A gánh nhiều code nhất (khung + đồ thị + benchmark) → nếu A quá tải, B nhận lại Dijkstra (B đã có A*, code gần giống), hoặc C viết phần WebGL thuần của benchmark (C đã quen WebGL qua shader sóng).
- WebGL thuần khó hơn PixiJS → chỉ dùng cho benchmark; mọi demo khác dùng PixiJS.

## Kiểm chứng
- Mỗi milestone kiểm bằng demo chạy trên GitHub Pages; benchmark FPS xuất CSV và vẽ bảng/biểu đồ; thử nghiệm integrator có đồ thị năng lượng/sai số.
- Trước khi nộp: copy thư mục `Source code` sang máy khác, chạy bằng Live Server không có mạng → mọi demo phải hoạt động.
