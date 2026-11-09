import { Application } from '../pixi.js';

// Tạo canvas PixiJS nằm trong host và tự co giãn theo host.
export async function createStage(host) {
  const app = new Application();
  await app.init({
    preference: 'webgl',
    resizeTo: host,
    background: '#ffffff',
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  });
  host.append(app.canvas);

  // Cho phép bắt sự kiện chuột ở mọi chỗ trên canvas (cần cho kéo-thả).
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  return app;
}
