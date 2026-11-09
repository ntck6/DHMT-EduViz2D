// Pipeline WebGL từng bước – người phụ trách: A
// Tác vụ 2D minh họa: toàn bộ pipeline vẽ 2D bằng WebGL thuần, không qua PixiJS.
//
// Một đa giác (kéo được từng đỉnh) đi qua các công đoạn của framework Ch.1:
//   1. Đỉnh       – tọa độ nằm trong vertex buffer (VBO), vẽ bằng gl.POINTS
//   2. Tam giác   – chia đa giác bằng ear clipping (webgl/triangulate.js),
//                   chỉ số nằm trong index buffer, vẽ khung dây bằng gl.LINES
//   3. Biến đổi   – ma trận model (phóng to, xoay) gửi lên GPU qua uniform
//   4. Tô màu     – fragment shader tô màu từng điểm ảnh theo khoảng cách tới tâm
//   5. Instancing – N bản sao: 1 lệnh drawElementsInstanced so với N lệnh drawElements
// PixiJS chỉ vẽ tay nắm kéo-thả và chữ chú thích đè lên trên.
import { Container, Graphics, Text } from '../pixi.js';
import { COLOR, LABEL_STYLE } from '../core/theme.js';
import { addLabel } from '../core/draw.js';
import { makeDraggable } from '../core/drag.js';
import { countDrawCalls, createBuffer, createProgram } from '../webgl/gl-utils.js';
import { invert, multiply, ortho2D, rotate, scale, transformPoint, translate } from '../webgl/matrix.js';
import { triangulate } from '../webgl/triangulate.js';

const STEPS = [
  { value: 'points', label: '1. Đỉnh (vertex buffer)', hint: 'Bước 1: tọa độ các đỉnh nằm trong vertex buffer, vẽ bằng gl.POINTS.' },
  { value: 'triangles', label: '2. Chia tam giác', hint: 'Bước 2: GPU chỉ vẽ được tam giác. Ear clipping chia đa giác lõm thành n − 2 tam giác.' },
  { value: 'transform', label: '3. Biến đổi (ma trận)', hint: 'Bước 3: ma trận model (phóng to, xoay) được gửi lên GPU qua uniform; vertex shader nhân từng đỉnh.' },
  { value: 'fill', label: '4. Tô màu (fragment shader)', hint: 'Bước 4: fragment shader tính màu cho từng điểm ảnh bên trong các tam giác.' },
  { value: 'instancing', label: '5. Instancing', hint: 'Bước 5: vẽ nhiều bản sao. Bật instancing: 1 lệnh vẽ; tắt: mỗi bản sao 1 lệnh vẽ.' },
];

const VERTEX = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aPosition; // tọa độ đỉnh (điểm ảnh)
layout(location = 1) in vec2 aOffset;   // vị trí bản sao (chỉ dùng ở bước instancing)

uniform mat3 uProjection; // điểm ảnh → clip space
uniform mat3 uModel;      // phóng to, xoay quanh tâm đa giác
uniform float uPointSize;

out vec2 vLocal; // tọa độ gốc, chuyển sang fragment shader để tô màu

void main() {
  vec2 world = (uModel * vec3(aPosition, 1.0)).xy + aOffset;
  gl_Position = vec4((uProjection * vec3(world, 1.0)).xy, 0.0, 1.0);
  gl_PointSize = uPointSize;
  vLocal = aPosition;
}
`;

const FRAGMENT = /* glsl */ `#version 300 es
precision mediump float;

in vec2 vLocal;
uniform int uMode;      // 0: một màu; 1: chuyển màu theo khoảng cách tới tâm
uniform vec4 uColor;
uniform vec2 uCenter;
uniform float uRadius;
out vec4 outColor;

void main() {
  if (uMode == 1) {
    float t = clamp(length(vLocal - uCenter) / uRadius, 0.0, 1.0);
    outColor = vec4(mix(vec3(0.15, 0.39, 0.92), vec3(0.92, 0.35, 0.05), t), 1.0);
  } else {
    outColor = uColor;
  }
}
`;

const INSTANCE_COUNTS = [1, 10, 100, 1000, 10000];

function starPolygon(cx, cy, radius) {
  return Array.from({ length: 14 }, (_, i) => {
    const r = i % 2 ? radius * 0.45 : radius;
    const a = (Math.PI * i) / 7 - Math.PI / 2;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
}

function rgba(color, alpha = 1) {
  return [((color >> 16) & 255) / 255, ((color >> 8) & 255) / 255, (color & 255) / 255, alpha];
}

export function mount({ root, controls, width, height, createGLLayer }) {
  const layer = createGLLayer();
  const gl = layer.gl;
  const drawCalls = countDrawCalls(gl);

  const state = {
    step: 'points',
    zoom: 1,
    angleDeg: 0,
    instances: 100,
    useInstancing: true,
    vertices: starPolygon(width / 2, height / 2, Math.min(width, height) * 0.35),
  };
  let size = { width, height };
  let indices = [];
  let model = null;
  let cpuMs = 0;
  let frames = 0;
  let cpuSum = 0;

  // ---- Dữ liệu trên GPU --------------------------------------------------
  const program = createProgram(gl, VERTEX, FRAGMENT);
  const u = Object.fromEntries(
    ['uProjection', 'uModel', 'uPointSize', 'uMode', 'uColor', 'uCenter', 'uRadius']
      .map((name) => [name, gl.getUniformLocation(program, name)]),
  );

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const positionBuffer = createBuffer(gl, gl.ARRAY_BUFFER, 4 * 2 * 64, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const offsetBuffer = createBuffer(gl, gl.ARRAY_BUFFER, 4 * 2 * INSTANCE_COUNTS.at(-1), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(1, 1); // mỗi bản sao đọc một cặp (x, y)
  gl.bindVertexArray(null);
  const triangleIndexBuffer = gl.createBuffer();
  const lineIndexBuffer = gl.createBuffer();
  let lineIndexCount = 0;

  // Đỉnh đổi → nạp lại VBO, chia tam giác lại, nạp lại index buffer.
  function uploadGeometry() {
    const flat = new Float32Array(state.vertices.flatMap((p) => [p.x, p.y]));
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flat);

    indices = triangulate(state.vertices);
    const lines = [];
    for (let i = 0; i < indices.length; i += 3) {
      const [a, b, c] = [indices[i], indices[i + 1], indices[i + 2]];
      lines.push(a, b, b, c, c, a);
    }
    lineIndexCount = lines.length;
    gl.bindVertexArray(vao); // index buffer được lưu trong VAO
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lines), gl.DYNAMIC_DRAW);
    gl.bindVertexArray(null);
  }

  function centroid() {
    const n = state.vertices.length;
    return state.vertices.reduce((s, p) => ({ x: s.x + p.x / n, y: s.y + p.y / n }), { x: 0, y: 0 });
  }

  function radius(center) {
    return Math.max(...state.vertices.map((p) => Math.hypot(p.x - center.x, p.y - center.y)));
  }

  // Lưới vị trí cho các bản sao, phủ kín khung vẽ.
  function instanceLayout() {
    const n = state.instances;
    const cols = Math.ceil(Math.sqrt((n * size.width) / size.height));
    const rows = Math.ceil(n / cols);
    const cell = Math.min(size.width / cols, size.height / rows);
    const offsets = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      offsets[i * 2] = (i % cols + 0.5) * cell;
      offsets[i * 2 + 1] = (Math.floor(i / cols) + 0.5) * cell;
    }
    return { offsets, cell };
  }

  // ---- Vẽ ----------------------------------------------------------------
  function render() {
    const center = centroid();
    const r = radius(center);
    const instancing = state.step === 'instancing';
    const turn = rotate((state.angleDeg * Math.PI) / 180);
    let offsets = null;

    if (instancing) {
      // Mỗi bản sao: đưa tâm đa giác về gốc, thu nhỏ vừa ô lưới, xoay; aOffset dời tới ô.
      const layout = instanceLayout();
      offsets = layout.offsets;
      model = multiply(turn, scale((state.zoom * layout.cell * 0.45) / r), translate(-center.x, -center.y));
      gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, offsets);
    } else {
      // Phóng to và xoay quanh tâm đa giác: dời tâm về gốc → co giãn → xoay → dời lại.
      model = multiply(translate(center.x, center.y), turn, scale(state.zoom), translate(-center.x, -center.y));
    }

    const start = performance.now();
    drawCalls.reset();
    layer.clear();
    gl.useProgram(program);
    gl.uniformMatrix3fv(u.uProjection, false, ortho2D(size.width, size.height));
    gl.uniformMatrix3fv(u.uModel, false, model);
    gl.uniform2f(u.uCenter, center.x, center.y);
    gl.uniform1f(u.uRadius, r);
    gl.uniform1f(u.uPointSize, 10 * (window.devicePixelRatio || 1));
    gl.bindVertexArray(vao);
    gl.disableVertexAttribArray(1);
    gl.vertexAttrib2f(1, 0, 0); // khi tắt mảng, attribute dùng giá trị hằng này

    const drawWire = (color) => {
      gl.uniform1i(u.uMode, 0);
      gl.uniform4fv(u.uColor, rgba(color));
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineIndexBuffer);
      gl.drawElements(gl.LINES, lineIndexCount, gl.UNSIGNED_SHORT, 0);
    };
    const drawPoints = () => {
      gl.uniform1i(u.uMode, 0);
      gl.uniform4fv(u.uColor, rgba(COLOR.accent));
      gl.drawArrays(gl.POINTS, 0, state.vertices.length);
    };

    if (state.step === 'points') {
      drawPoints();
    } else if (state.step === 'triangles' || state.step === 'transform') {
      drawWire(COLOR.primary);
      drawPoints();
    } else if (state.step === 'fill') {
      gl.uniform1i(u.uMode, 1);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    } else if (instancing) {
      gl.uniform1i(u.uMode, 1);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);
      if (state.useInstancing) {
        gl.enableVertexAttribArray(1);
        gl.drawElementsInstanced(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0, state.instances);
      } else {
        for (let i = 0; i < state.instances; i++) {
          gl.vertexAttrib2f(1, offsets[i * 2], offsets[i * 2 + 1]);
          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        }
      }
    }
    gl.bindVertexArray(null);

    // Thời gian CPU để gửi lệnh vẽ (GPU chạy song song, không tính ở đây).
    cpuSum += performance.now() - start;
    frames += 1;
    if (frames === 30) {
      cpuMs = cpuSum / frames;
      cpuSum = 0;
      frames = 0;
    }
    updateReadouts();
  }

  // ---- Lớp PixiJS: tay nắm kéo đỉnh + chú thích --------------------------
  const handles = new Container();
  const handleLabels = new Container();
  const hint = new Text({ text: '', style: { ...LABEL_STYLE, fontSize: 13, wordWrap: true, wordWrapWidth: width - 24 } });
  hint.position.set(12, 10);
  const hintBackground = new Graphics(); // nền trắng mờ để chữ đọc được khi đè lên hình
  root.addChild(handles, handleLabels, hintBackground, hint);

  function drawHintBackground() {
    hintBackground.clear().roundRect(6, 4, hint.width + 12, hint.height + 12, 6).fill({ color: 0xffffff, alpha: 0.85 });
  }

  function buildHandles() {
    handles.removeChildren().forEach((child) => child.destroy());
    state.vertices.forEach((_, index) => {
      const handle = new Graphics().circle(0, 0, 9).fill({ color: COLOR.accent, alpha: 0.001 }).stroke({ width: 1.5, color: COLOR.accent });
      makeDraggable(handle, {
        onDrag: (pos) => {
          state.vertices[index] = transformPoint(invert(model), pos);
          uploadGeometry();
          render();
          placeHandles();
        },
      });
      handles.addChild(handle);
    });
  }

  function placeHandles() {
    const visible = state.step !== 'instancing';
    handles.visible = visible;
    handleLabels.removeChildren().forEach((child) => child.destroy());
    if (!visible) return;
    state.vertices.forEach((p, i) => {
      const screen = transformPoint(model, p);
      handles.children[i].position.set(screen.x, screen.y);
      addLabel(handleLabels, `P${i}`, screen.x + 10, screen.y - 10, 0, 1);
    });
  }

  // ---- Bảng điều khiển ---------------------------------------------------
  controls.heading('Công đoạn');
  controls.select('Xem bước', STEPS, state.step, (value) => {
    state.step = value;
    refresh();
  });

  controls.heading('Biến đổi (uniform uModel)');
  controls.slider({ label: 'Phóng to', min: 0.3, max: 2, step: 0.05, value: state.zoom, unit: '×', onInput: (v) => { state.zoom = v; refresh(); } });
  controls.slider({ label: 'Xoay', min: -180, max: 180, step: 1, value: state.angleDeg, unit: '°', onInput: (v) => { state.angleDeg = v; refresh(); } });

  controls.heading('Instancing (bước 5)');
  controls.select('Số bản sao', INSTANCE_COUNTS.map((n) => ({ value: String(n), label: n.toLocaleString('vi-VN') })), String(state.instances), (value) => {
    state.instances = Number(value);
    refresh();
  });
  controls.checkbox('Dùng instancing (1 lệnh vẽ)', state.useInstancing, (value) => { state.useInstancing = value; refresh(); });

  controls.heading('Số liệu mỗi khung hình');
  const showVertices = controls.readout('Số đỉnh');
  const showTriangles = controls.readout('Số tam giác');
  const showCalls = controls.readout('Lệnh vẽ');
  const showCpu = controls.readout('CPU gửi lệnh vẽ');
  const showMatrix = controls.readout('uModel');
  controls.note('Kéo các vòng tròn P0, P1… để đổi hình; tam giác được chia lại ngay.');

  function updateReadouts() {
    const copies = state.step === 'instancing' ? state.instances : 1;
    showVertices(`${state.vertices.length * copies}`);
    showTriangles(`${(indices.length / 3) * copies}`);
    showCalls(`${drawCalls.calls}`);
    showCpu(`${cpuMs.toFixed(3)} ms`);
    showMatrix(`[${[model[0], model[3], model[6]].map((v) => v.toFixed(2)).join(' ')}]`);
  }

  function refresh() {
    hint.text = STEPS.find((s) => s.value === state.step).hint;
    drawHintBackground();
    render();
    placeHandles();
  }

  uploadGeometry();
  buildHandles();
  refresh();

  return {
    update() {
      render(); // vẽ lại mỗi khung hình để đo thời gian ổn định
    },
    resize(nextWidth, nextHeight) {
      const sx = nextWidth / size.width;
      const sy = nextHeight / size.height;
      state.vertices = state.vertices.map((p) => ({ x: p.x * sx, y: p.y * sy }));
      size = { width: nextWidth, height: nextHeight };
      hint.style.wordWrapWidth = nextWidth - 24;
      uploadGeometry();
      refresh();
    },
  };
}
