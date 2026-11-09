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
    stage.js, fps.js      Khởi tạo PixiJS, đếm FPS
  cs/                   Bài Tin học: sorting.js, astar.js (B), graph.js (A)
  physics/              Bài Vật lý: projectile.js, oscillator.js, waves.js (C)
  _template/            Bài mẫu để sao chép
  webgl/                WebGL thuần cho trang benchmark (A)
benchmark/              Trang đo hiệu năng cho Ch.4 (A)
tests/                  Kiểm tra bằng node --test
```

## Viết một bài học
Mỗi bài là một file xuất hàm `mount`. File khung của từng bài **đã có sẵn** trong `js/cs/` và `js/physics/`, phần đầu file ghi việc cần làm và gợi ý cách chia file.

```js
export function mount({ root, app, controls, width, height }) {
  // root:     Container của bài; vẽ gì thì root.addChild(...). Khung tự xóa khi chuyển bài.
  // controls: bảng điều khiển bên phải.
  // width, height: kích thước khung vẽ (điểm ảnh).
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

## Trước khi nộp
Bài mẫu chỉ hiện khi có `?dev` nên không cần xóa. Chép thư mục này sang máy khác, tắt mạng, chạy bằng Live Server và kiểm tra mọi bài.
