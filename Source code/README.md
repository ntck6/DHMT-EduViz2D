# EduViz2D – mã nguồn

Ứng dụng web minh họa các tác vụ 2D tĩnh và động bằng HTML5 + WebGL (thư viện PixiJS). Viết bằng HTML, CSS và JavaScript thuần: không cần cài thư viện, không cần build.

## Chạy thử
Không mở `index.html` bằng cách nhấp đúp, vì lệnh `import` không chạy trên `file://`. Dùng một trong hai cách:

- **VS Code:** cài tiện ích **Live Server**, nhấp phải `index.html` → *Open with Live Server*.
- **Python:** chạy lệnh sau trong thư mục này rồi mở http://localhost:5173

```bash
python -m http.server 5173
```

Thêm `?dev` vào địa chỉ (ví dụ `http://localhost:5173/?dev#template`) để thấy **Bài mẫu** trong menu.

Kiểm tra công thức (cần Node.js):

```bash
node --test
```

## Cấu trúc thư mục
```
index.html              Trang chính: menu, khung vẽ, bảng điều khiển
css/style.css
lib/pixi.min.js         PixiJS 8.22.0, tải sẵn để chạy offline
js/
  main.js               Khung ứng dụng: nạp bài, vòng lặp vẽ (không cần sửa)
  lessons.js            Danh sách bài học → menu
  pixi.js               Mọi file import PixiJS từ đây
  core/                 Phần dùng chung cho mọi bài
    controls.js           Bảng điều khiển: slider, button, checkbox, select, readout, note
    playback.js           Nhóm nút Play / Pause / Reset / Step + thanh tốc độ
    view.js               Đổi tọa độ thế giới ↔ điểm ảnh (fitView)
    draw.js               Vẽ hệ trục, mũi tên, nhãn chữ
    drag.js               Kéo-thả đối tượng
    theme.js              Màu và kiểu chữ dùng chung
    placeholder.js        Màn hình tạm cho bài chưa làm
    gl-layer.js           Lớp WebGL thuần nằm dưới canvas PixiJS
    hit-test.js           Chọn cột / ô lưới từ vị trí chuột (tính toán)
    export.js             Xuất PNG / tải file
    stage.js, fps.js      Khởi tạo PixiJS, đếm FPS
  webgl/                WebGL 2 thuần do nhóm tự viết (không qua thư viện)
    gl-utils.js           Context, biên dịch shader, program, buffer, đếm lệnh vẽ
    matrix.js             Ma trận 3×3: chiếu, dời, xoay, co giãn, nghịch đảo
    triangulate.js        Chia đa giác thành tam giác (ear clipping)
    instanced-rects.js    Vẽ N hình chữ nhật bằng 1 lệnh drawArraysInstanced
    picking.js            Chọn đối tượng bằng GPU (framebuffer + readPixels)
  cs/                   Bài Tin học: sorting.js, astar.js (B), graph.js (A)
  physics/              Bài Vật lý: projectile.js, oscillator.js, waves.js (C)
  tech/                 Bài kỹ thuật: pipeline.js (Pipeline WebGL từng bước)
  _template/            Bài mẫu để sao chép
benchmark/              Trang đo hiệu năng Canvas 2D / PixiJS / WebGL thuần cho Ch.4
tests/                  Kiểm tra bằng node --test
```

## Viết một bài học
Mỗi bài là một file xuất hàm `mount`. File khung của từng bài **đã có sẵn** trong `js/cs/` và `js/physics/`, phần đầu file ghi việc cần làm và gợi ý cách chia file.

```js
export function mount({ root, app, controls, width, height, createGLLayer }) {
  // root:     Container của bài; vẽ gì thì root.addChild(...). Khung tự xóa khi chuyển bài.
  // controls: bảng điều khiển bên phải.
  // width, height: kích thước khung vẽ (điểm ảnh).
  // createGLLayer(): tạo lớp WebGL thuần { gl, clear, width, height } nằm dưới PixiJS.
  //                  Khung tự đổi kích thước và tự xóa lớp khi chuyển bài.
  return {
    update(dt) {},            // mỗi khung hình, dt tính bằng giây
    resize(width, height) {}, // khi khung vẽ đổi kích thước
    destroy() {},             // tùy chọn: chỉ cần khi có timer hay listener ngoài PixiJS
  };
}
```

**Các bước:**
1. Mở file bài của mình, xóa lời gọi `showPlaceholder(...)`.
2. Xem `js/_template/lesson-template.js` (mở trang với `?dev#template`) để biết cách dùng từng helper.
3. Tách phần tính toán (thuật toán, công thức vật lý) sang file riêng **không import PixiJS**, ví dụ `physics/projectile-model.js`, rồi viết test trong `tests/` như `tests/projectile-model.test.mjs`.
4. Khi bài chạy được, đổi `status: 'todo'` thành `status: 'done'` trong `js/lessons.js`.

**Quy ước:**
- Import PixiJS qua `../pixi.js`, không import thẳng từ `lib/`.
- Màu lấy từ `core/theme.js`.
- Comment viết tiếng Việt, ngắn, giải thích *vì sao*.
- Tách lớp vẽ tĩnh (hệ trục, lưới) và lớp động (vật chuyển động): mỗi khung hình chỉ vẽ lại lớp động.
- Nhiều nhãn chữ thì dùng `BitmapText` thay cho `Text`.

## Helper dùng chung (tóm tắt)
| Helper | Dùng khi | Ví dụ |
|---|---|---|
| `controls.slider({ label, min, max, step, value, unit, onInput })` | Tham số số | Vận tốc, số phần tử |
| `controls.select(label, options, value, onChange)` | Chọn một trong nhiều | Thuật toán, integrator |
| `controls.checkbox(label, checked, onChange)` | Bật/tắt | Hiện vector |
| `controls.readout(label)` → hàm `set(text)` | Hiện kết quả | `T = 2.89 s` |
| `createPlayback(controls, { onPlay, onReset, onStep, speed })` | Bài có chuyển động | `if (playback.playing) ...` |
| `fitView({ width, height, needX, needY })` | Vẽ theo đơn vị thật, tỉ lệ x:y bằng nhau | `view.toScreen({ x, y })`, `view.toWorld(pos)` |
| `drawAxes(graphics, labelLayer, view, { xLabel, yLabel })` | Hệ trục có lưới | Ném xiên |
| `drawArrow(graphics, from, dx, dy, color)` | Vector | Vận tốc |
| `makeDraggable(target, { onDrag })` | Kéo-thả | Node đồ thị, nguồn sóng |

Shader GLSL qua PixiJS Filter: xem `js/physics/waves.js`, đã nối sẵn và truyền thời gian `uTime` mỗi khung hình.

## WebGL thuần
Bài muốn vẽ bằng WebGL tự viết thì gọi `createGLLayer()` trong `mount`, rồi dùng các hàm ở `js/webgl/`. PixiJS vẫn vẽ chữ và tay nắm kéo-thả đè lên trên.

- Mẫu đơn giản: `js/cs/sorting.js` (vẽ cột bằng `instanced-rects.js`; kéo-thả cột bằng `core/hit-test.js`).
- Mẫu đầy đủ: `js/tech/pipeline.js` (VBO, index buffer, VAO, uniform, ma trận, ear clipping, instancing, GPU picking).

**Tương tác với phần tử vẽ bằng WebGL thuần:** đặt `root.eventMode = 'static'` và `root.hitArea = app.screen`, rồi nghe `pointerdown` / `globalpointermove` / `pointerup` trên `root` (xem `sorting.js`). Phần tử xếp đều thì tính chỉ số bằng `core/hit-test.js`; hình bất kỳ thì dùng `webgl/picking.js`.

Phím tắt trong mọi bài có Play/Pause: **Space** = Play/Pause, **→** = Step, **R** = Reset. Thanh tiêu đề có nút **Xuất PNG** và **Toàn màn hình**.

## Đo hiệu năng (Ch.4)
Mở `benchmark/index.html` (hoặc bấm **Benchmark** trên thanh tiêu đề), chọn cách vẽ và số đối tượng, bấm **Bắt đầu đo**, xong bấm **Tải CSV**. Khi đo phải để cửa sổ hiện trên màn hình và đóng các tab khác.

## Trước khi nộp
Bài mẫu chỉ hiện khi có `?dev` nên không cần xóa. Chép thư mục này sang máy khác, tắt mạng, chạy bằng Live Server và kiểm tra mọi bài.
