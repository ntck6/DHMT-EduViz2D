// Ba cách vẽ cùng một cảnh (benchmark/scene.js) để so sánh ở Ch.4:
//   canvas2d – Canvas 2D API của HTML5: JavaScript gọi fillRect cho từng hình;
//              trình duyệt tự quyết cách vẽ (có thể dùng GPU bên trong)
//   pixi     – PixiJS (WebGL), ParticleContainer: thư viện tự gộp lệnh vẽ
//   webgl    – WebGL thuần nhóm tự viết: instancing, 1 lệnh vẽ cho mọi hình
//
// Mỗi cách vẽ có cùng giao diện:
//   const r = await RENDERERS.webgl.create(host, width, height);
//   r.setup(scene, labelCount);  r.render(scene);  r.drawCalls;  r.destroy();
import { Application, BitmapText, Particle, ParticleContainer, Texture } from '../js/pixi.js';
import { countDrawCalls, getWebGL2, resizeToDisplay } from '../js/webgl/gl-utils.js';
import { ortho2D } from '../js/webgl/matrix.js';
import { FLOATS_PER_RECT, createInstancedRects, writeRect } from '../js/webgl/instanced-rects.js';
import { PALETTE, RECT_SIZE } from './scene.js';

const LABEL_FONT = { fontFamily: 'Arial', fontSize: 10, fill: 0x1f2933 };
const toCss = (color) => `#${color.toString(16).padStart(6, '0')}`;

function createCanvas(host, width, height) {
  const canvas = document.createElement('canvas');
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  host.append(canvas);
  return { canvas, ratio };
}

export const RENDERERS = {
  canvas2d: {
    label: 'Canvas 2D',
    supportsLabels: true,
    async create(host, width, height) {
      const { canvas, ratio } = createCanvas(host, width, height);
      const ctx = canvas.getContext('2d');
      ctx.scale(ratio, ratio);
      let labelCount = 0;
      return {
        drawCalls: null, // Canvas 2D không cho đếm lệnh vẽ GPU (trình duyệt tự xử lý bên trong)
        setup(_scene, labels) { labelCount = labels; },
        render(scene) {
          const { count, positions } = scene;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          // Gom theo màu để không đổi fillStyle cho từng hình.
          for (let c = 0; c < PALETTE.length; c++) {
            ctx.fillStyle = toCss(PALETTE[c]);
            for (let i = c; i < count; i += PALETTE.length) {
              ctx.fillRect(positions[i * 2], positions[i * 2 + 1], RECT_SIZE, RECT_SIZE);
            }
          }
          if (labelCount) {
            ctx.fillStyle = toCss(LABEL_FONT.fill);
            ctx.font = `${LABEL_FONT.fontSize}px ${LABEL_FONT.fontFamily}`;
            for (let i = 0; i < labelCount; i++) ctx.fillText(String(i), positions[i * 2] + 6, positions[i * 2 + 1]);
          }
        },
        destroy() { canvas.remove(); },
      };
    },
  },

  pixi: {
    label: 'PixiJS',
    supportsLabels: true,
    async create(host, width, height) {
      const app = new Application();
      await app.init({
        width, height, preference: 'webgl', background: '#ffffff', antialias: false,
        autoStart: false, autoDensity: true, resolution: window.devicePixelRatio || 1,
      });
      host.append(app.canvas);
      const counter = countDrawCalls(app.renderer.gl);
      let particles = [];
      let labels = [];
      return {
        get drawCalls() { return counter.calls; },
        setup(scene, labelCount) {
          const container = new ParticleContainer({ dynamicProperties: { position: true } });
          const texScale = RECT_SIZE / Texture.WHITE.width;
          particles = Array.from({ length: scene.count }, (_, i) => {
            const particle = new Particle({ texture: Texture.WHITE, scaleX: texScale, scaleY: texScale, tint: PALETTE[i % PALETTE.length] });
            container.addParticle(particle);
            return particle;
          });
          app.stage.addChild(container);
          labels = Array.from({ length: labelCount }, (_, i) => app.stage.addChild(new BitmapText({ text: String(i), style: LABEL_FONT })));
        },
        render(scene) {
          const { positions } = scene;
          for (let i = 0; i < particles.length; i++) {
            particles[i].x = positions[i * 2];
            particles[i].y = positions[i * 2 + 1];
          }
          for (let i = 0; i < labels.length; i++) labels[i].position.set(positions[i * 2] + 6, positions[i * 2 + 1] - 10);
          counter.reset();
          app.renderer.render(app.stage);
        },
        destroy() { app.destroy(true, { children: true }); },
      };
    },
  },

  webgl: {
    label: 'WebGL thuần',
    supportsLabels: false, // chữ cần atlas font, không làm trong đồ án
    async create(host, width, height) {
      const { canvas } = createCanvas(host, width, height);
      const gl = getWebGL2(canvas, { antialias: false });
      resizeToDisplay(gl, width, height);
      const counter = countDrawCalls(gl);
      const rects = createInstancedRects(gl);
      const projection = ortho2D(width, height);
      let data = null;
      return {
        get drawCalls() { return counter.calls; },
        setup(scene) {
          data = new Float32Array(scene.count * FLOATS_PER_RECT);
          for (let i = 0; i < scene.count; i++) writeRect(data, i, 0, 0, RECT_SIZE, RECT_SIZE, PALETTE[i % PALETTE.length]);
        },
        render(scene) {
          const { count, positions } = scene;
          for (let i = 0; i < count; i++) {
            data[i * FLOATS_PER_RECT] = positions[i * 2];
            data[i * FLOATS_PER_RECT + 1] = positions[i * 2 + 1];
          }
          counter.reset();
          gl.clearColor(1, 1, 1, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
          rects.update(data, count);
          rects.draw(projection);
        },
        destroy() {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
          canvas.remove();
        },
      };
    },
  },
};
