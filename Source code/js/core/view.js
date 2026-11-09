// Đổi tọa độ thế giới (mét, ô lưới…) sang điểm ảnh trên canvas.
// File này không dùng PixiJS nên kiểm tra được bằng `node --test`.

export const DEFAULT_MARGIN = { left: 56, right: 24, top: 20, bottom: 40 };
export const NICE_WIDTHS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

// Chọn khung nhìn tỉ lệ x:y bằng nhau, gốc (0, 0) ở góc dưới trái, đủ chứa
// vùng needX × needY. Độ rộng lấy theo nấc trong NICE_WIDTHS để khi tham số
// đổi một chút thì khung không nhảy theo.
export function fitView({ width, height, needX, needY, margin = DEFAULT_MARGIN, widths = NICE_WIDTHS }) {
  const plotW = Math.max(width - margin.left - margin.right, 1);
  const plotH = Math.max(height - margin.top - margin.bottom, 1);
  const viewWidth = widths.find((w) => w >= needX && (w * plotH) / plotW >= needY) ?? widths.at(-1);
  const scale = plotW / viewWidth; // số điểm ảnh trên 1 đơn vị
  const bottom = height - margin.bottom;

  return {
    width,
    height,
    margin,
    viewWidth,
    viewHeight: plotH / scale,
    scale,
    toScreen: ({ x, y }) => ({ x: margin.left + x * scale, y: bottom - y * scale }),
    toWorld: ({ x, y }) => ({ x: (x - margin.left) / scale, y: (bottom - y) / scale }),
  };
}

// Phóng to một khung nhìn zoom lần quanh điểm focus (tọa độ thế giới); focus giữ
// nguyên vị trí trên màn hình. Trả về khung nhìn có cùng các hàm như fitView().
export function zoomView(view, zoom, focus) {
  const anchor = view.toScreen(focus);
  const scale = view.scale * zoom;
  return {
    ...view,
    zoom,
    scale,
    viewWidth: view.viewWidth / zoom,
    viewHeight: view.viewHeight / zoom,
    toScreen: ({ x, y }) => ({ x: anchor.x + (x - focus.x) * scale, y: anchor.y - (y - focus.y) * scale }),
    toWorld: ({ x, y }) => ({ x: focus.x + (x - anchor.x) / scale, y: focus.y - (y - anchor.y) / scale }),
  };
}

// Bước chia "đẹp" (1, 2, 5 × 10ⁿ) gần nhất mà không nhỏ hơn raw. Dùng cho vạch chia trục.
export function niceStep(raw) {
  const power = 10 ** Math.floor(Math.log10(raw));
  const fraction = raw / power;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * power;
}
