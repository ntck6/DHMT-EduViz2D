// Trang đo hiệu năng cho Ch.4 (a): cùng một cảnh, 3 cách vẽ, nhiều số đối tượng.
// Mỗi lần chạy: khởi động (bỏ số liệu) rồi đo; ghi FPS, thời gian khung hình
// (trung bình, p95), thời gian CPU cho phần vẽ, số lệnh vẽ GPU.
//
// Tham số trên địa chỉ (tùy chọn): ?n=1000,5000&warm=1000&measure=3000&renderers=webgl,pixi&labels=1&auto
import { RENDERERS } from './renderers.js';
import { createScene, stepScene, summarize } from './scene.js';
import { downloadBlob } from '../js/core/export.js';

const WIDTH = 960;
const HEIGHT = 540;
const MAX_LABELS = 1000;

const params = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);
const host = $('bench-stage');
const results = [];

// ---- Giá trị mặc định từ địa chỉ trang ----------------------------------
$('counts').value = params.get('n') ?? '1000,5000,10000,50000,100000';
$('warm').value = params.get('warm') ?? '1000';
$('measure').value = params.get('measure') ?? '3000';
$('labels').checked = params.get('labels') === '1';
const chosen = params.get('renderers')?.split(',');
for (const [key, renderer] of Object.entries(RENDERERS)) {
  const label = document.createElement('label');
  label.innerHTML = `<input type="checkbox" value="${key}"> ${renderer.label}`;
  label.querySelector('input').checked = !chosen || chosen.includes(key);
  $('renderer-list').append(label);
}

// ---- Thông tin máy (ghi kèm số liệu, bắt buộc cho mục môi trường Ch.4) -----
function environment() {
  const probe = document.createElement('canvas').getContext('webgl2');
  const info = probe?.getExtension('WEBGL_debug_renderer_info');
  const gpu = info ? probe.getParameter(info.UNMASKED_RENDERER_WEBGL) : probe?.getParameter(probe.RENDERER) ?? 'không rõ';
  probe?.getExtension('WEBGL_lose_context')?.loseContext();
  return {
    browser: navigator.userAgent,
    gpu,
    dpr: window.devicePixelRatio || 1,
    canvas: `${WIDTH}x${HEIGHT}`,
  };
}
const env = environment();
$('env').textContent = `GPU: ${env.gpu} · devicePixelRatio: ${env.dpr} · khung vẽ: ${env.canvas} px · ${env.browser}`;

// ---- Một lần đo ---------------------------------------------------------
function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function runOne(key, count, withLabels, warmMs, measureMs) {
  const renderer = await RENDERERS[key].create(host, WIDTH, HEIGHT);
  const scene = createScene(count, WIDTH, HEIGHT);
  renderer.setup(scene, withLabels ? Math.min(count, MAX_LABELS) : 0);

  const frameTimes = [];
  const cpuTimes = [];
  let last = await nextFrame();
  const startedAt = last;
  let measuringFrom = null;

  for (;;) {
    const now = await nextFrame();
    const dt = (now - last) / 1000;
    last = now;
    stepScene(scene, dt);
    const cpuStart = performance.now();
    renderer.render(scene);
    const cpu = performance.now() - cpuStart;

    if (measuringFrom === null) {
      if (now - startedAt >= warmMs) measuringFrom = now;
      continue;
    }
    frameTimes.push(dt * 1000);
    cpuTimes.push(cpu);
    if (now - measuringFrom >= measureMs) break;
  }

  const drawCalls = renderer.drawCalls;
  renderer.destroy();
  const frame = summarize(frameTimes);
  const cpu = summarize(cpuTimes);
  return {
    renderer: RENDERERS[key].label,
    n: count,
    labels: withLabels ? Math.min(count, MAX_LABELS) : 0,
    fps: (frameTimes.length / (measureMs / 1000)),
    frameAvg: frame.mean,
    frameP95: frame.p95,
    cpuAvg: cpu.mean,
    drawCalls: drawCalls ?? '',
    note: drawCalls === null ? 'Canvas 2D: không đếm được lệnh vẽ GPU (trình duyệt tự xử lý)' : '',
  };
}

// ---- Chạy cả loạt và hiển thị ------------------------------------------
function addRow(row) {
  results.push(row);
  const tr = document.createElement('tr');
  const cells = [
    row.renderer, row.n.toLocaleString('vi-VN'), row.labels,
    row.fps === '' ? '–' : row.fps.toFixed(1),
    row.frameAvg === '' ? '–' : row.frameAvg.toFixed(2),
    row.frameP95 === '' ? '–' : row.frameP95.toFixed(2),
    row.cpuAvg === '' ? '–' : row.cpuAvg.toFixed(2),
    row.drawCalls === '' ? '–' : row.drawCalls,
    row.note,
  ];
  for (const value of cells) {
    const td = document.createElement('td');
    td.textContent = value;
    tr.append(td);
  }
  $('results').append(tr);
}

async function runAll() {
  const keys = [...document.querySelectorAll('#renderer-list input:checked')].map((input) => input.value);
  const counts = $('counts').value.split(',').map((v) => Number(v.trim())).filter((v) => v > 0);
  const warmMs = Number($('warm').value);
  const measureMs = Number($('measure').value);
  const labelModes = $('labels').checked ? [false, true] : [false];

  $('start').disabled = true;
  $('download').disabled = true;
  const total = keys.length * counts.length * labelModes.length;
  let done = 0;

  for (const key of keys) {
    for (const withLabels of labelModes) {
      for (const count of counts) {
        done += 1;
        if (withLabels && !RENDERERS[key].supportsLabels) {
          addRow({ renderer: RENDERERS[key].label, n: count, labels: Math.min(count, MAX_LABELS), fps: '', frameAvg: '', frameP95: '', cpuAvg: '', drawCalls: '', note: 'Không áp dụng: WebGL thuần chưa vẽ chữ' });
          continue;
        }
        $('status').textContent = `Đang đo ${done}/${total}: ${RENDERERS[key].label}, ${count.toLocaleString('vi-VN')} đối tượng${withLabels ? ', có chữ' : ''}…`;
        addRow(await runOne(key, count, withLabels, warmMs, measureMs));
      }
    }
  }

  $('status').textContent = `Xong ${total} lần đo. Tải CSV để vẽ biểu đồ cho Ch.4.`;
  $('start').disabled = false;
  $('download').disabled = false;
  document.body.dataset.done = 'true'; // để script kiểm tra tự động biết đã xong
}

function toCSV() {
  const columns = ['renderer', 'n', 'labels', 'fps', 'frame_ms_avg', 'frame_ms_p95', 'cpu_ms_avg', 'draw_calls', 'note', 'gpu', 'dpr', 'canvas', 'browser'];
  const quote = (v) => `"${String(v).replaceAll('"', '""')}"`;
  const format = (v) => (typeof v === 'number' ? Number(v.toFixed(3)) : v);
  const lines = results.map((r) => [
    r.renderer, r.n, r.labels, format(r.fps), format(r.frameAvg), format(r.frameP95), format(r.cpuAvg),
    r.drawCalls, r.note, env.gpu, env.dpr, env.canvas, env.browser,
  ].map(quote).join(','));
  return [columns.join(','), ...lines].join('\n');
}

$('start').addEventListener('click', runAll);
$('download').addEventListener('click', () => {
  // Thêm BOM để Excel đọc đúng tiếng Việt.
  downloadBlob(new Blob(['﻿', toCSV()], { type: 'text/csv;charset=utf-8' }), `benchmark-${Date.now()}.csv`);
});
window.benchmarkCSV = toCSV; // để script kiểm tra tự động đọc kết quả

if (params.has('auto')) runAll();
