import { Application } from '../../lib/pixi.min.js';

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
  return app;
}
