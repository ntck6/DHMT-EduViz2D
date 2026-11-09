// Đo độ chính xác của một đường cong đã vẽ, từ ảnh đọc ra bằng gl.readPixels.
// Không dùng DOM/WebGL nên kiểm tra được bằng node --test.
//
//   pixels: Uint8Array RGBA, hàng 0 là hàng DƯỚI CÙNG (đúng thứ tự của readPixels)
//   curve:  [p0, p1, p2] đường cong thật, tọa độ điểm ảnh (gốc trên trái)
//
// Kết quả:
//   maxError, meanError – khoảng cách từ tâm các điểm ảnh được tô (alpha > 127) tới
//                         đường cong thật, trừ đi nửa bề rộng nét (điểm ảnh)
//   coverage            – % điểm lấy mẫu trên đường cong thật mà điểm ảnh chứa nó được tô
import { distanceToQuadratic, quadPoint } from '../js/webgl/curve-math.js';

export function measureCurve(pixels, width, height, curve, halfWidth, { samples = 2000 } = {}) {
  const alphaAt = (x, y) => pixels[((height - 1 - y) * width + x) * 4 + 3];
  const [p0, p1, p2] = curve;

  let lit = 0;
  let sum = 0;
  let max = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alphaAt(x, y) <= 127) continue;
      const { distance } = distanceToQuadratic({ x: x + 0.5, y: y + 0.5 }, p0, p1, p2);
      const error = Math.max(0, distance - halfWidth);
      lit += 1;
      sum += error;
      if (error > max) max = error;
    }
  }

  let inside = 0;
  let covered = 0;
  for (let i = 0; i <= samples; i++) {
    const p = quadPoint(p0, p1, p2, i / samples);
    const x = Math.floor(p.x);
    const y = Math.floor(p.y);
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    inside += 1;
    if (alphaAt(x, y) > 127) covered += 1;
  }

  return {
    litPixels: lit,
    maxError: max,
    meanError: lit ? sum / lit : 0,
    coverage: inside ? (covered / inside) * 100 : 0,
  };
}
