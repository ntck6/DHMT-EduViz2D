# EduViz2D

Ứng dụng web 2D hỗ trợ học Tin học và Vật lý, viết bằng HTML5, JavaScript thuần và PixiJS (WebGL). Không cần cài đặt hay build.

## Cách chạy
Không mở `index.html` bằng cách nhấp đúp, vì `import` không chạy trên `file://`. Dùng một trong hai cách:

- VS Code: cài tiện ích **Live Server**, mở thư mục này, nhấp phải `index.html` → *Open with Live Server*.
- Python: chạy lệnh sau trong thư mục này rồi mở http://localhost:5173

```bash
python -m http.server 5173
```

Kiểm tra công thức (cần Node.js):

```bash
node --test
```

## Thêm một bài học
1. Tạo file trong `js/cs/` hoặc `js/physics/`, xuất hàm `mount`:

```js
export function mount({ app, controls, width, height }) {
  // Vẽ vào app.stage, tạo control bằng controls.slider / button / checkbox / readout
  return {
    update(dt) {},               // gọi mỗi khung hình, dt tính bằng giây
    resize(width, height) {},    // khi khung vẽ đổi kích thước
    destroy() {},                // dọn đối tượng đã tạo khi chuyển bài
  };
}
```

2. Điền `load: () => import('./cs/ten-file.js')` cho bài đó trong `js/lessons.js`.

Xem mẫu đầy đủ ở `js/physics/projectile.js`. Nên tách phần tính toán sang file riêng không dùng PixiJS (như `projectile-model.js`) để kiểm tra được bằng `node --test`.

## Thư mục
| Thư mục | Nội dung |
|---|---|
| `js/core/` | Khởi tạo PixiJS, bảng điều khiển, đo FPS |
| `js/cs/` | Bài Tin học |
| `js/physics/` | Bài Vật lý |
| `js/webgl/` | Shader và helper WebGL thuần |
| `benchmark/` | Trang đo FPS cho Chương 4 |
| `lib/` | PixiJS 8.22.0, tải sẵn để chạy offline |
| `tests/` | Kiểm tra công thức |
