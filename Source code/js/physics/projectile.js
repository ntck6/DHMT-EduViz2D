// Ném xiên – người phụ trách: C. Bài mẫu đầy đủ cho cả nhóm tham khảo.
// VIỆC CỦA C (tương tác trực tiếp): kéo đầu mũi tên v₀ để đổi góc và vận tốc
// (core/drag.js); thêm bia mục tiêu kéo được và thử bắn trúng.
import { Container, Graphics } from '../pixi.js';
import { COLOR } from '../core/theme.js';
import { fitView } from '../core/view.js';
import { addLabel, drawArrow, drawAxes } from '../core/draw.js';
import { createPlayback } from '../core/playback.js';
import { solveProjectile } from './projectile-model.js';

const STEP_SECONDS = 0.1;
const SAMPLES = 120;
const ARROW_PX_PER_MS = 2.5; // độ dài vector (px) trên 1 m/s

export function mount({ root, controls, width, height }) {
  const params = { v0: 20, thetaDeg: 45, g: 9.8 };
  const show = { path: true, vectors: true };
  let size = { width, height };
  let solution = solveProjectile(params);
  let view = null;
  let t = 0;

  const gridLayer = new Graphics();
  const pathLayer = new Graphics();
  const labelLayer = new Container();
  const pathLabels = new Container();
  const bodyLayer = new Graphics();
  root.addChild(gridLayer, pathLayer, labelLayer, pathLabels, bodyLayer);

  // Tỉ lệ x:y bằng nhau để góc trên màn hình đúng với góc ném.
  function drawBackground() {
    view = fitView({ ...size, needX: solution.range * 1.05, needY: solution.maxHeight * 1.15 });
    drawAxes(gridLayer, labelLayer, view, { xLabel: 'x (m)', yLabel: 'y (m)' });
  }

  function drawPath() {
    pathLayer.clear();
    pathLabels.removeChildren().forEach((child) => child.destroy());
    if (!show.path) return;

    const { flightTime, range, maxHeight, position } = solution;
    const start = view.toScreen(position(0));
    pathLayer.moveTo(start.x, start.y);
    for (let i = 1; i <= SAMPLES; i++) {
      const point = view.toScreen(position((flightTime * i) / SAMPLES));
      pathLayer.lineTo(point.x, point.y);
    }
    pathLayer.stroke({ width: 2, color: COLOR.primary });

    const apex = view.toScreen(position(flightTime / 2));
    const landing = view.toScreen({ x: range, y: 0 });
    pathLayer.circle(apex.x, apex.y, 3.5).circle(landing.x, landing.y, 3.5).fill(COLOR.primary);
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
    drawPath();
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

  controls.heading('Hiển thị');
  controls.checkbox('Đường quỹ đạo', show.path, (value) => {
    show.path = value;
    drawPath();
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
