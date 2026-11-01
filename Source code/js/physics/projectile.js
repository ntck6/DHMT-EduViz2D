import { Container, Graphics, Text } from '../../lib/pixi.min.js';
import { solveProjectile } from './projectile-model.js';

const MARGIN = { left: 56, right: 24, top: 20, bottom: 40 };
const VIEW_WIDTHS = [5, 10, 20, 50, 100, 200, 500, 1000, 2000]; // mét
const STEP_SECONDS = 0.1;
const SAMPLES = 120;
const ARROW_PX_PER_MS = 2.5; // độ dài vector (px) trên 1 m/s

const COLOR = {
  grid: 0xe4e7eb,
  axis: 0x616e7c,
  label: 0x3e4c59,
  path: 0x2563eb,
  ball: 0xdc2626,
  speed: 0xea580c,
  vx: 0x0891b2,
  vy: 0x16a34a,
};

const LABEL_STYLE = { fontFamily: 'system-ui, "Segoe UI", sans-serif', fontSize: 12, fill: COLOR.label };

export function mount({ app, controls, width, height }) {
  const params = { v0: 20, thetaDeg: 45, g: 9.8 };
  const show = { path: true, vectors: true };
  let size = { width, height };
  let solution = solveProjectile(params);
  let view = null;
  let t = 0;
  let playing = false;

  const scene = new Container();
  const gridLayer = new Graphics();
  const pathLayer = new Graphics();
  const labelLayer = new Container();
  const bodyLayer = new Graphics();
  scene.addChild(gridLayer, pathLayer, labelLayer, bodyLayer);
  app.stage.addChild(scene);

  // Giữ tỉ lệ x:y bằng nhau để góc trên màn hình đúng với góc ném. Khung nhìn
  // đổi theo từng nấc, nhờ vậy khi kéo v0 vẫn thấy quỹ đạo dài ra hay ngắn lại.
  function computeView() {
    const plotW = Math.max(size.width - MARGIN.left - MARGIN.right, 1);
    const plotH = Math.max(size.height - MARGIN.top - MARGIN.bottom, 1);
    const viewWidth = VIEW_WIDTHS.find((w) => {
      const metersTall = (w * plotH) / plotW;
      return w >= solution.range * 1.05 && metersTall >= solution.maxHeight * 1.15;
    }) ?? VIEW_WIDTHS.at(-1);
    return { plotW, plotH, viewWidth, scale: plotW / viewWidth };
  }

  function toScreen({ x, y }) {
    return { x: MARGIN.left + x * view.scale, y: size.height - MARGIN.bottom - y * view.scale };
  }

  function addLabel(text, x, y, anchorX = 0, anchorY = 0) {
    const label = new Text({ text, style: LABEL_STYLE });
    label.anchor.set(anchorX, anchorY);
    label.position.set(x, y);
    labelLayer.addChild(label);
  }

  function drawBackground() {
    view = computeView();
    gridLayer.clear();
    labelLayer.removeChildren().forEach((child) => child.destroy());

    const stepMeters = view.viewWidth / 5;
    const origin = toScreen({ x: 0, y: 0 });

    for (let i = 0; i <= 5; i++) {
      const { x } = toScreen({ x: i * stepMeters, y: 0 });
      gridLayer.moveTo(x, MARGIN.top).lineTo(x, origin.y);
      addLabel(String(i * stepMeters), x, origin.y + 6, 0.5, 0);
    }
    for (let i = 1; ; i++) {
      const { y } = toScreen({ x: 0, y: i * stepMeters });
      if (y < MARGIN.top) break;
      gridLayer.moveTo(MARGIN.left, y).lineTo(size.width - MARGIN.right, y);
      addLabel(String(i * stepMeters), MARGIN.left - 8, y, 1, 0.5);
    }
    gridLayer.stroke({ width: 1, color: COLOR.grid });

    gridLayer
      .moveTo(MARGIN.left, MARGIN.top)
      .lineTo(MARGIN.left, origin.y)
      .lineTo(size.width - MARGIN.right, origin.y)
      .stroke({ width: 1.5, color: COLOR.axis });

    addLabel('x (m)', size.width - MARGIN.right, origin.y + 22, 1, 0);
    addLabel('y (m)', MARGIN.left + 6, MARGIN.top, 0, 0);
  }

  function drawPath() {
    pathLayer.clear();
    if (!show.path) return;

    const { flightTime, range, maxHeight, position } = solution;
    const start = toScreen(position(0));
    pathLayer.moveTo(start.x, start.y);
    for (let i = 1; i <= SAMPLES; i++) {
      const point = toScreen(position((flightTime * i) / SAMPLES));
      pathLayer.lineTo(point.x, point.y);
    }
    pathLayer.stroke({ width: 2, color: COLOR.path });

    const apex = toScreen(position(flightTime / 2));
    const landing = toScreen({ x: range, y: 0 });
    pathLayer.circle(apex.x, apex.y, 3.5).circle(landing.x, landing.y, 3.5).fill(COLOR.path);
    addLabel(`H = ${maxHeight.toFixed(2)} m`, apex.x, apex.y - 8, 0.5, 1);
    addLabel(`R = ${range.toFixed(2)} m`, Math.min(landing.x, size.width - 44), landing.y - 8, 0.5, 1);
  }

  function drawArrow(from, dx, dy, color) {
    const length = Math.hypot(dx, dy);
    if (length < 1) return;
    const ux = dx / length;
    const uy = dy / length;
    const tip = { x: from.x + dx, y: from.y + dy };
    const head = Math.min(8, length / 2);
    bodyLayer
      .moveTo(from.x, from.y)
      .lineTo(tip.x, tip.y)
      .stroke({ width: 2, color })
      .moveTo(tip.x, tip.y)
      .lineTo(tip.x - ux * head - uy * head * 0.5, tip.y - uy * head + ux * head * 0.5)
      .lineTo(tip.x - ux * head + uy * head * 0.5, tip.y - uy * head - ux * head * 0.5)
      .closePath()
      .fill(color);
  }

  function drawBody() {
    const position = toScreen(solution.position(t));
    const velocity = solution.velocity(t);
    bodyLayer.clear();
    if (show.vectors) {
      const dx = velocity.x * ARROW_PX_PER_MS;
      const dy = -velocity.y * ARROW_PX_PER_MS; // trục y màn hình hướng xuống
      drawArrow(position, dx, 0, COLOR.vx);
      drawArrow(position, 0, dy, COLOR.vy);
      drawArrow(position, dx, dy, COLOR.speed);
    }
    bodyLayer.circle(position.x, position.y, 7).fill(COLOR.ball);
    updateReadouts(velocity);
  }

  function redrawAll() {
    drawBackground();
    drawPath();
    drawBody();
  }

  function setTime(next) {
    t = Math.min(next, solution.flightTime);
    if (t >= solution.flightTime) setPlaying(false);
    drawBody();
  }

  function setPlaying(next) {
    playing = next;
    playButton.disabled = playing;
    pauseButton.disabled = !playing;
  }

  function reset() {
    t = 0;
    setPlaying(false);
    drawBody();
  }

  function setParam(name, value) {
    params[name] = value;
    solution = solveProjectile(params);
    t = 0;
    setPlaying(false);
    redrawAll();
    updateResults();
  }

  controls.heading('Tham số');
  controls.slider({ label: 'Vận tốc đầu v₀', min: 1, max: 50, step: 1, value: params.v0, unit: 'm/s', onInput: (v) => setParam('v0', v) });
  controls.slider({ label: 'Góc ném θ', min: 0, max: 90, step: 1, value: params.thetaDeg, unit: '°', onInput: (v) => setParam('thetaDeg', v) });
  controls.slider({ label: 'Trọng trường g', min: 1.6, max: 25, step: 0.1, value: params.g, unit: 'm/s²', onInput: (v) => setParam('g', v) });

  controls.heading('Điều khiển');
  const playButton = controls.button('Play', () => {
    if (t >= solution.flightTime) t = 0;
    setPlaying(true);
  });
  const pauseButton = controls.button('Pause', () => setPlaying(false));
  controls.button('Reset', reset);
  controls.button('Step', () => {
    setPlaying(false);
    setTime(t + STEP_SECONDS);
  });

  controls.heading('Hiển thị');
  controls.checkbox('Đường quỹ đạo', show.path, (value) => {
    show.path = value;
    drawBackground();
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

  setPlaying(false);
  updateResults();
  redrawAll();

  return {
    update(dt) {
      if (playing) setTime(t + dt);
    },
    resize(nextWidth, nextHeight) {
      size = { width: nextWidth, height: nextHeight };
      redrawAll();
    },
    destroy() {
      scene.destroy({ children: true });
    },
  };
}
