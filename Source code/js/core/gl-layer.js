// Lớp vẽ WebGL thuần đặt DƯỚI canvas PixiJS (PixiJS có nền trong suốt).
// Nhờ vậy một bài có thể vẽ phần nặng bằng WebGL tự viết, còn chữ, hệ trục,
// tay nắm kéo-thả vẫn vẽ bằng PixiJS đè lên trên.
//
// Bài học không gọi trực tiếp file này mà dùng createGLLayer() nhận được trong
// mount(); khung tự đổi kích thước và tự xóa lớp khi chuyển bài.
import { getWebGL2, resizeToDisplay } from '../webgl/gl-utils.js';

export function createGLLayer(host) {
  const canvas = document.createElement('canvas');
  canvas.className = 'gl-layer';
  host.prepend(canvas); // nằm trước canvas PixiJS trong DOM nên bị PixiJS đè lên

  // preserveDrawingBuffer giữ lại hình đã vẽ để nút "Xuất PNG" chụp được.
  const gl = getWebGL2(canvas, { preserveDrawingBuffer: true });
  let width = 0;
  let height = 0;

  return {
    canvas,
    gl,
    get width() { return width; },
    get height() { return height; },
    resize(nextWidth, nextHeight) {
      width = nextWidth;
      height = nextHeight;
      resizeToDisplay(gl, width, height);
    },
    clear(r = 0, g = 0, b = 0, a = 0) {
      gl.clearColor(r, g, b, a);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    destroy() {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
