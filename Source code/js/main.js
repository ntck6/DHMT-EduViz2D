// Khung ứng dụng: dựng menu, nạp bài học, chạy vòng lặp vẽ.
// Thành viên viết bài học không cần sửa file này.
import { Container } from './pixi.js';
import { lessons } from './lessons.js';
import { createStage } from './core/stage.js';
import { createControls } from './core/controls.js';
import { createFpsMeter } from './core/fps.js';
import { createGLLayer } from './core/gl-layer.js';
import { exportPNG } from './core/export.js';

const MAX_FRAME_MS = 250; // tránh nhảy cóc khi quay lại tab sau một lúc rời đi
const showDev = new URLSearchParams(location.search).has('dev');
const visibleLessons = lessons.filter((lesson) => showDev || !lesson.devOnly);

const menu = document.getElementById('menu');
const titleEl = document.getElementById('lesson-title');
const taskEl = document.getElementById('lesson-task');
const fpsEl = document.getElementById('fps');
const host = document.getElementById('stage');
const controls = createControls(document.getElementById('controls'));
const fps = createFpsMeter();

const app = await createStage(host);

let current = null; // bài đang chạy: { update, resize, destroy }
let currentId = null;
let root = null; // Container riêng của bài đang chạy
let glLayers = []; // các lớp WebGL thuần bài đang dùng
let width = 0;
let height = 0;
let loadToken = 0;

function renderMenu(activeId) {
  menu.replaceChildren();
  let group = null;
  for (const lesson of visibleLessons) {
    if (lesson.group !== group) {
      group = lesson.group;
      const heading = document.createElement('h3');
      heading.textContent = group;
      menu.append(heading);
    }
    const link = document.createElement('a');
    link.href = `#${lesson.id}`;
    link.textContent = lesson.title;
    if (lesson.status === 'todo') {
      const note = document.createElement('small');
      note.textContent = `${lesson.owner} · đang làm`;
      link.append(note);
    }
    if (lesson.id === activeId) link.setAttribute('aria-current', 'page');
    menu.append(link);
  }
}

// Bài học gọi hàm này (nhận qua mount) để có một lớp WebGL thuần riêng.
function addGLLayer() {
  const layer = createGLLayer(host);
  layer.resize(width, height);
  glLayers.push(layer);
  return layer;
}

async function openLesson() {
  const lesson = visibleLessons.find((item) => item.id === location.hash.slice(1)) ?? visibleLessons[0];
  const token = ++loadToken;
  renderMenu(lesson.id);
  titleEl.textContent = lesson.title;
  taskEl.textContent = `Tác vụ 2D: ${lesson.task}`;

  const module = await lesson.load();
  if (token !== loadToken) return; // người dùng đã chọn bài khác trong lúc tải

  // Dọn bài cũ: bài tự dọn phần riêng (nếu có), khung xóa mọi thứ đã vẽ.
  current?.destroy?.();
  root?.destroy({ children: true });
  glLayers.forEach((layer) => layer.destroy());
  glLayers = [];
  controls.clear();

  root = new Container();
  app.stage.addChild(root);
  width = app.screen.width;
  height = app.screen.height;
  currentId = lesson.id;
  current = module.mount({ root, app, host, controls, width, height, createGLLayer: addGLLayer }) ?? {};
}

app.ticker.add((ticker) => {
  // deltaMS bị PixiJS chặn khi máy chậm, nên dùng elapsedMS là thời gian thật.
  fpsEl.textContent = `${fps.tick(ticker.elapsedMS)} FPS`;
  if (!current) return;
  if (app.screen.width !== width || app.screen.height !== height) {
    width = app.screen.width;
    height = app.screen.height;
    glLayers.forEach((layer) => layer.resize(width, height));
    current.resize?.(width, height);
  }
  current.update?.(Math.min(ticker.elapsedMS, MAX_FRAME_MS) / 1000);
});

document.getElementById('export-png').addEventListener('click', () => {
  app.renderer.render(app.stage); // vẽ lại ngay để ảnh có khung hình mới nhất
  exportPNG(host, `eduviz2d-${currentId}.png`);
});

document.getElementById('fullscreen').addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else host.requestFullscreen();
});

addEventListener('hashchange', openLesson);
openLesson();
