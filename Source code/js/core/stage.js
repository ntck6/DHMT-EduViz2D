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

  // Cho phép bắt sự kiện chuột ở mọi chỗ trên canvas (cần cho kéo-thả).
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  return app;
}
