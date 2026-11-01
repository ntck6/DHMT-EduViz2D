import { lessons } from './lessons.js';
import { createStage } from './core/stage.js';
import { createControls } from './core/controls.js';
import { createFpsMeter } from './core/fps.js';

const menu = document.getElementById('menu');
const titleEl = document.getElementById('lesson-title');
const fpsEl = document.getElementById('fps');
const controls = createControls(document.getElementById('controls'));
const fps = createFpsMeter();

const app = await createStage(document.getElementById('stage'));

const MAX_FRAME_MS = 250; // tránh nhảy cóc khi quay lại tab sau một lúc rời đi

let current = null; // bài đang chạy: { update, resize, destroy }
let width = 0;
let height = 0;
let loadToken = 0;

function renderMenu(activeId) {
  menu.replaceChildren();
  let group = null;
  for (const lesson of lessons) {
    if (lesson.group !== group) {
      group = lesson.group;
      const heading = document.createElement('h3');
      heading.textContent = group;
      menu.append(heading);
    }
    if (lesson.load) {
      const link = document.createElement('a');
      link.href = `#${lesson.id}`;
      link.textContent = lesson.title;
      if (lesson.id === activeId) link.setAttribute('aria-current', 'page');
      menu.append(link);
    } else {
      const item = document.createElement('span');
      item.textContent = lesson.title;
      const note = document.createElement('small');
      note.textContent = 'Đang làm';
      item.append(note);
      menu.append(item);
    }
  }
}

async function openLesson() {
  const ready = lessons.filter((lesson) => lesson.load);
  const lesson = ready.find((item) => item.id === location.hash.slice(1)) ?? ready[0];
  const token = ++loadToken;
  renderMenu(lesson.id);
  titleEl.textContent = lesson.title;

  const module = await lesson.load();
  if (token !== loadToken) return; // người dùng đã chọn bài khác trong lúc tải

  current?.destroy();
  app.stage.removeChildren();
  controls.clear();

  width = app.screen.width;
  height = app.screen.height;
  current = module.mount({ app, controls, width, height });
}

app.ticker.add((ticker) => {
  // deltaMS bị PixiJS chặn khi máy chậm, nên dùng elapsedMS là thời gian thật.
  fpsEl.textContent = `${fps.tick(ticker.elapsedMS)} FPS`;
  if (!current) return;
  if (app.screen.width !== width || app.screen.height !== height) {
    width = app.screen.width;
    height = app.screen.height;
    current.resize?.(width, height);
  }
  current.update?.(Math.min(ticker.elapsedMS, MAX_FRAME_MS) / 1000);
});

addEventListener('hashchange', openLesson);
openLesson();
