import { Application } from '../pixi.js';

// Tạo canvas PixiJS nằm trong host và tự co giãn theo host.
export async function createStage(host) {
  const app = new Application();
  await app.init({
    preference: 'webgl',
    resizeTo: host,
    // Nền trong suốt để thấy lớp WebGL thuần nằm bên dưới (core/gl-layer.js);
    // nền trắng do CSS của .stage lo.
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
    preserveDrawingBuffer: true, // để nút "Xuất PNG" đọc lại được hình
  });
  host.append(app.canvas);

  // resizeTo chỉ theo dõi sự kiện resize của cửa sổ. Khung vẽ còn đổi kích thước khi
  // bố cục trang thay đổi (bảng điều khiển dài ra, vào toàn màn hình…), nên theo dõi
  // trực tiếp phần tử host bằng ResizeObserver của HTML5.
  new ResizeObserver(() => app.resize()).observe(host);

  // Cho phép bắt sự kiện chuột ở mọi chỗ trên canvas (cần cho kéo-thả).
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  return app;
}
