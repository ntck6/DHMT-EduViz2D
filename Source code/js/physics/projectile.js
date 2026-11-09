// Ném xiên – người phụ trách: C (mô hình, tương tác); A (vẽ quỹ đạo bằng Loop & Blinn).
//
// Quỹ đạo là một parabol, trùng khít một đường cong Bézier bậc 2, nên được vẽ bằng
// phương pháp chính của Ch.3: Loop & Blinn 2005 (js/webgl/loop-blinn.js) trên lớp
// WebGL thuần. Có thể đổi sang cách thông thường (chia 120 đoạn thẳng) và phóng to
// quanh đỉnh để so sánh: đường gấp khúc lộ cạnh, Loop & Blinn vẫn mịn.
// Hệ trục, chữ, vật và vector vẫn do PixiJS vẽ đè lên trên.
//
// VIỆC CỦA C (tương tác trực tiếp): kéo đầu mũi tên v₀ để đổi góc và vận tốc
// (core/drag.js); thêm bia mục tiêu kéo được và thử bắn trúng.
import { Container, Graphics } from '../pixi.js';
import { COLOR } from '../core/theme.js';
import { fitView, zoomView } from '../core/view.js';
import { addLabel, drawArrow, drawAxes } from '../core/draw.js';
import { createPlayback } from '../core/playback.js';
import { ortho2D } from '../webgl/matrix.js';
import { parabolaToBezier } from '../webgl/curve-math.js';
import { createCurveRenderer } from '../webgl/loop-blinn.js';
import { createPolylineRenderer } from '../webgl/polyline.js';
import { solveProjectile } from './projectile-model.js';

const STEP_SECONDS = 0.1;
const POLYLINE_SEGMENTS = 120;
const STROKE_WIDTH = 2.5; // bề rộng nét quỹ đạo (điểm ảnh)
const ARROW_PX_PER_MS = 2.5; // độ dài vector (px) trên 1 m/s

export function mount({ root, controls, width, height, createGLLayer }) {
  const params = { v0: 20, thetaDeg: 45, g: 9.8 };
  const show = { path: true, vectors: true };
  let size = { width, height };
  let solution = solveProjectile(params);
  let method = 'loop-blinn';
  let zoom = 1;
  let view = null;
  let t = 0;

  // Lớp WebGL thuần cho quỹ đạo.
  const layer = createGLLayer();
  const gl = layer.gl;
  const curve = createCurveRenderer(gl);
  const polyline = createPolylineRenderer(gl);

  const gridLayer = new Graphics();
  const labelLayer = new Container();
  const plotLayer = new Container(); // phần nằm trong vùng vẽ, bị cắt theo khung
  const markerLayer = new Graphics();
  const pathLabels = new Container();
  const bodyLayer = new Graphics();
  const plotMask = new Graphics();
  plotLayer.addChild(markerLayer, pathLabels, bodyLayer);
  plotLayer.mask = plotMask;
  root.addChild(gridLayer, labelLayer, plotLayer, plotMask);

  function plotRect() {
    const { margin } = view;
    return { x: margin.left, y: margin.top, w: size.width - margin.left - margin.right, h: size.height - margin.top - margin.bottom };
  }

  // Tỉ lệ x:y bằng nhau để góc trên màn hình đúng với góc ném. Khi phóng to, giữ
  // đỉnh quỹ đạo đứng yên trên màn hình.
  function drawBackground() {
    const base = fitView({ ...size, needX: solution.range * 1.05, needY: solution.maxHeight * 1.15 });
    const apex = solution.position(solution.flightTime / 2);
    view = zoom === 1 ? base : zoomView(base, zoom, apex);
    drawAxes(gridLayer, labelLayer, view, { xLabel: 'x (m)', yLabel: 'y (m)' });
    const r = plotRect();
    plotMask.clear().rect(r.x, r.y, r.w, r.h).fill(0xffffff);
  }

  // Vẽ quỹ đạo bằng WebGL thuần, cắt theo vùng vẽ (scissor test).
  function drawCurve() {
    layer.clear();
    if (!show.path || solution.flightTime <= 0) {
      showVertices('0');
      return;
    }
    const ratio = gl.canvas.width / size.width;
    const r = plotRect();
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(Math.round(r.x * ratio), Math.round((size.height - r.y - r.h) * ratio), Math.round(r.w * ratio), Math.round(r.h * ratio));

    const projection = ortho2D(size.width, size.height);
    const style = { projection, width: STROKE_WIDTH, color: COLOR.primary };
    const screenPoints = parabolaToBezier(solution).map(view.toScreen);
    const drawn = method === 'loop-blinn' && curve.draw(screenPoints, style);
    if (!drawn) {
      // Cách thông thường (hoặc khi đường cong suy biến, ví dụ ném thẳng đứng).
      const points = Array.from({ length: POLYLINE_SEGMENTS + 1 }, (_, i) =>
        view.toScreen(solution.position((solution.flightTime * i) / POLYLINE_SEGMENTS)));
      polyline.draw(points, style);
    }
    gl.disable(gl.SCISSOR_TEST);
    showVertices(`${drawn ? curve.vertexCount : polyline.vertexCount}`);
  }

  function drawMarkers() {
    markerLayer.clear();
    pathLabels.removeChildren().forEach((child) => child.destroy());
    if (!show.path) return;
    const { flightTime, range, maxHeight, position } = solution;
    const apex = view.toScreen(position(flightTime / 2));
    const landing = view.toScreen({ x: range, y: 0 });
    markerLayer.circle(apex.x, apex.y, 3.5).circle(landing.x, landing.y, 3.5).fill(COLOR.primary);
    addLabel(pathLabels, `H = ${maxHeight.toFixed(2)} m`, apex.x, apex.y - 8, 0.5, 1);
    addLabel(pathLabels, `R = ${range.toFixed(2)} m`, Math.min(landing.x, size.width - 44), landing.y - 8, 0.5, 1);
  }

  function drawBody() {
    const position = view.toScreen(solution.position(t));
    const velocity = solution.velocity(t);
    bodyLayer.clear();
    if (show.vectors) {
      const dx = velocity.x * ARROW_PX_PER_MS;
      const dy = -velocity.y * ARROW_PX_PER_MS; // trục y màn hình hướng xuống
      drawArrow(bodyLayer, position, dx, 0, COLOR.cyan);
      drawArrow(bodyLayer, position, 0, dy, COLOR.green);
      drawArrow(bodyLayer, position, dx, dy, COLOR.orange);
    }
    bodyLayer.circle(position.x, position.y, 7).fill(COLOR.accent);
    updateReadouts(velocity);
  }

  function redrawAll() {
    drawBackground();
    drawCurve();
    drawMarkers();
    drawBody();
  }

  function setTime(next) {
    t = Math.min(next, solution.flightTime);
    if (t >= solution.flightTime) playback.pause();
    drawBody();
  }

  function setParam(name, value) {
    params[name] = value;
    solution = solveProjectile(params);
    t = 0;
    playback.pause();
    redrawAll();
    updateResults();
  }

  controls.heading('Tham số');
  controls.slider({ label: 'Vận tốc đầu v₀', min: 1, max: 50, step: 1, value: params.v0, unit: 'm/s', onInput: (v) => setParam('v0', v) });
  controls.slider({ label: 'Góc ném θ', min: 0, max: 90, step: 1, value: params.thetaDeg, unit: '°', onInput: (v) => setParam('thetaDeg', v) });
  controls.slider({ label: 'Trọng trường g', min: 1.6, max: 25, step: 0.1, value: params.g, unit: 'm/s²', onInput: (v) => setParam('g', v) });

  const playback = createPlayback(controls, {
    onPlay: () => {
      if (t >= solution.flightTime) t = 0;
    },
    onReset: () => setTime(0),
    onStep: () => setTime(t + STEP_SECONDS),
  });

  controls.heading('Vẽ quỹ đạo (phương pháp Ch.3)');
  controls.select('Cách vẽ', [
    { value: 'loop-blinn', label: 'Loop & Blinn (GPU, 1 tứ giác)' },
    { value: 'polyline', label: `${POLYLINE_SEGMENTS} đoạn thẳng (thông thường)` },
  ], method, (value) => {
    method = value;
    drawCurve();
  });
  controls.slider({ label: 'Phóng to quanh đỉnh', min: 0, max: 6, step: 1, value: 0, unit: '', onInput: (power) => {
    zoom = 2 ** power;
    showZoom(`${zoom}×`);
    redrawAll();
  } });
  const showZoom = controls.readout('Mức phóng to');
  const showVertices = controls.readout('Số đỉnh gửi lên GPU');
  showZoom('1×');

  controls.heading('Hiển thị');
  controls.checkbox('Đường quỹ đạo', show.path, (value) => {
    show.path = value;
    drawCurve();
    drawMarkers();
  });
  controls.checkbox('Vector vận tốc', show.vectors, (value) => {
    show.vectors = value;
    drawBody();
  });

  controls.heading('Kết quả lý thuyết');
  const showFlightTime = controls.readout('Thời gian bay T');
  const showMaxHeight = controls.readout('Độ cao cực đại H');
  const showRange = controls.readout('Tầm xa R');

  controls.heading('Tại thời điểm t');
  const showTime = controls.readout('t');
  const showVx = controls.readout('vₓ');
  const showVy = controls.readout('vᵧ');

  function updateResults() {
    showFlightTime(`${solution.flightTime.toFixed(2)} s`);
    showMaxHeight(`${solution.maxHeight.toFixed(2)} m`);
    showRange(`${solution.range.toFixed(2)} m`);
  }

  function updateReadouts(velocity) {
    showTime(`${t.toFixed(2)} s`);
    showVx(`${velocity.x.toFixed(2)} m/s`);
    showVy(`${velocity.y.toFixed(2)} m/s`);
  }

  updateResults();
  redrawAll();

  return {
    update(dt) {
      if (playback.playing) setTime(t + dt * playback.speed);
    },
    resize(nextWidth, nextHeight) {
      size = { width: nextWidth, height: nextHeight };
      redrawAll();
    },
  };
}
