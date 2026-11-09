// Thử nghiệm (f) – thử nghiệm chính của Ch.4: tái hiện Loop & Blinn (2005) trên WebGL.
//
// Cùng một quỹ đạo ném xiên (parabol) vẽ bằng 3 cách, ở 4 mức phóng to quanh đỉnh:
//   - Loop & Blinn: 1 tứ giác, fragment shader tính u² − v (js/webgl/loop-blinn.js)
//   - Chia 120 đoạn thẳng và 30 đoạn thẳng (cách thông thường, js/webgl/polyline.js)
// Mỗi lần vẽ đọc điểm ảnh bằng readPixels rồi đo sai số hình học so với parabol thật
// (benchmark/curve-measure.js), độ phủ, số đỉnh gửi lên GPU và thời gian vẽ.
//
// Tham số trên địa chỉ (tùy chọn): ?reps=200&auto
import { getWebGL2, resizeToDisplay } from '../js/webgl/gl-utils.js';
import { ortho2D } from '../js/webgl/matrix.js';
import { parabolaToBezier } from '../js/webgl/curve-math.js';
import { createCurveRenderer } from '../js/webgl/loop-blinn.js';
import { createPolylineRenderer } from '../js/webgl/polyline.js';
import { fitView, zoomView } from '../js/core/view.js';
import { downloadBlob } from '../js/core/export.js';
import { solveProjectile } from '../js/physics/projectile-model.js';
import { measureCurve } from './curve-measure.js';
import { environment } from './env.js';

const WIDTH = 960;
const HEIGHT = 540;
const STROKE_WIDTH = 2;
const ZOOMS = [1, 4, 16, 64];
const PREVIEW_ZOOM = 16;
const SCENE = { v0: 20, thetaDeg: 45, g: 9.8 };

const params = new URLSearchParams(location.search);
const reps = Number(params.get('reps') ?? 200);
const $ = (id) => document.getElementById(id);
const env = environment(`${WIDTH}x${HEIGHT} (pixel ratio 1)`);
$('env').textContent = `GPU: ${env.gpu} · khung vẽ: ${env.canvas} · ${env.browser}`;

// Độ phân giải cố định 1 điểm ảnh CSS = 1 điểm ảnh thật để số đo giống nhau trên mọi máy.
const canvas = $('curve-canvas');
const gl = getWebGL2(canvas, { antialias: true, preserveDrawingBuffer: true });
resizeToDisplay(gl, WIDTH, HEIGHT, 1);
const curve = createCurveRenderer(gl);
const polyline = createPolylineRenderer(gl);
const projection = ortho2D(WIDTH, HEIGHT);

const solution = solveProjectile(SCENE);
const base = fitView({ width: WIDTH, height: HEIGHT, needX: solution.range * 1.05, needY: solution.maxHeight * 1.15 });
const apex = solution.position(solution.flightTime / 2);

const METHODS = [
  { key: 'loop-blinn', label: 'Loop & Blinn', segments: 0 },
  { key: 'polyline-120', label: '120 đoạn thẳng', segments: 120 },
  { key: 'polyline-30', label: '30 đoạn thẳng', segments: 30 },
];

// Tạo hình học và vẽ một lần. Trả về số đỉnh.
function drawOnce(method, view) {
  const style = { projection, width: STROKE_WIDTH, color: 0x000000 };
  if (method.segments === 0) {
    curve.draw(parabolaToBezier(solution).map(view.toScreen), style);
    return curve.vertexCount;
  }
  const points = Array.from({ length: method.segments + 1 }, (_, i) =>
    view.toScreen(solution.position((solution.flightTime * i) / method.segments)));
  polyline.draw(points, style);
  return polyline.vertexCount;
}

function clear() {
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function copyPreview(target) {
  const ctx = target.getContext('2d');
  const crop = 120; // vùng 120 × 120 px quanh đỉnh, phóng 2 lần để thấy rõ điểm ảnh
  const anchor = base.toScreen(apex);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, target.width, target.height);
  ctx.drawImage(canvas, anchor.x - crop / 2, anchor.y - crop / 2, crop, crop, 0, 0, target.width, target.height);
}

const results = [];

function addRow(row) {
  results.push(row);
  const tr = document.createElement('tr');
  for (const value of [row.method, `${row.zoom}×`, row.vertices, row.maxError.toFixed(3), row.meanError.toFixed(3), row.coverage.toFixed(1), row.drawMs.toFixed(4)]) {
    const td = document.createElement('td');
    td.textContent = value;
    tr.append(td);
  }
  $('results').append(tr);
}

async function runAll() {
  $('start').disabled = true;
  $('download').disabled = true;
  $('results').replaceChildren();
  results.length = 0;

  for (const zoom of ZOOMS) {
    const view = zoom === 1 ? base : zoomView(base, zoom, apex);
    const truth = parabolaToBezier(solution).map(view.toScreen); // đường cong thật trên màn hình
    for (const method of METHODS) {
      $('status').textContent = `Đang đo: ${method.label}, phóng to ${zoom}×…`;
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Thời gian: tạo hình học + vẽ, lặp reps lần, gl.finish() để chờ GPU vẽ xong.
      clear();
      gl.finish();
      const start = performance.now();
      let vertices = 0;
      for (let i = 0; i < reps; i++) vertices = drawOnce(method, view);
      gl.finish();
      const drawMs = (performance.now() - start) / reps;

      // Độ chính xác: vẽ đúng 1 lần trên nền trống rồi đọc điểm ảnh.
      clear();
      drawOnce(method, view);
      const pixels = new Uint8Array(WIDTH * HEIGHT * 4);
      gl.readPixels(0, 0, WIDTH, HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      const accuracy = measureCurve(pixels, WIDTH, HEIGHT, truth, STROKE_WIDTH / 2);

      if (zoom === PREVIEW_ZOOM) copyPreview($(`preview-${method.key}`));
      addRow({ method: method.label, zoom, vertices, drawMs, ...accuracy });
    }
  }

  $('status').textContent = `Xong ${results.length} lần đo. Tải CSV để đưa vào Bảng 4 của báo cáo.`;
  $('start').disabled = false;
  $('download').disabled = false;
  document.body.dataset.done = 'true';
}

function toCSV() {
  const columns = ['method', 'zoom', 'vertices', 'max_error_px', 'mean_error_px', 'coverage_pct', 'lit_pixels', 'draw_ms', 'gpu', 'browser'];
  const quote = (v) => `"${String(v).replaceAll('"', '""')}"`;
  const lines = results.map((r) => [
    r.method, r.zoom, r.vertices, r.maxError.toFixed(4), r.meanError.toFixed(4), r.coverage.toFixed(2), r.litPixels, r.drawMs.toFixed(5), env.gpu, env.browser,
  ].map(quote).join(','));
  return [columns.join(','), ...lines].join('\n');
}

$('start').addEventListener('click', runAll);
$('download').addEventListener('click', () => {
  downloadBlob(new Blob(['﻿', toCSV()], { type: 'text/csv;charset=utf-8' }), `curve-experiment-${Date.now()}.csv`);
});
window.curveCSV = toCSV; // để script kiểm tra tự động đọc kết quả

if (params.has('auto')) runAll();
