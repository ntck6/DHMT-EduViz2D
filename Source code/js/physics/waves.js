// Giao thoa sóng – người phụ trách: C
// Tác vụ 2D minh họa: tính màu từng điểm ảnh bằng fragment shader.
//
// File này đã nối sẵn shader GLSL vào PixiJS qua Filter và truyền thời gian
// uTime mỗi khung hình. Shader hiện chỉ vẽ sọc chạy để chứng minh đường ống
// hoạt động. Việc của C: thay phần thân main() trong biến fragment bên dưới bằng công thức
// giao thoa hai nguồn, thêm uniform cho vị trí nguồn, bước sóng, tần số.
//
// Lưu ý về tọa độ:
//   gl_FragCoord.xy là tọa độ điểm ảnh thật (tính cả devicePixelRatio), gốc ở GÓC DƯỚI TRÁI.
//   Tọa độ PixiJS có gốc ở góc trên trái, nên khi truyền vị trí nguồn từ JS sang
//   cần nhân resolution và lật trục y: yShader = (height - y) * resolution.
//
// Kéo nguồn sóng: dùng core/drag.js rồi cập nhật uniform tương ứng.
//
// Thử nghiệm Ch.4 (e): viết thêm bản tính cùng công thức bằng JavaScript, vẽ bằng
// Canvas 2D (ImageData), rồi đo thời gian mỗi khung hình của hai bản ở nhiều độ phân giải.
import { Filter, GlProgram, Graphics, defaultFilterVert } from '../pixi.js';

const fragment = /* glsl */ `
in vec2 vTextureCoord;
out vec4 finalColor;

uniform float uTime;

void main() {
  // TODO (C): thay bằng công thức giao thoa hai nguồn.
  float stripes = 0.5 + 0.5 * sin(gl_FragCoord.x * 0.05 - uTime * 3.0);
  finalColor = vec4(vec3(stripes) * vec3(0.15, 0.4, 0.9), 1.0);
}
`;

export function mount({ root, app, controls, width, height }) {
  const filter = new Filter({
    glProgram: GlProgram.from({ vertex: defaultFilterVert, fragment, name: 'waves' }),
    resources: {
      waveUniforms: {
        uTime: { value: 0, type: 'f32' },
      },
    },
  });
  const uniforms = filter.resources.waveUniforms.uniforms;

  // Filter chỉ tô lên vùng của đối tượng gắn nó, nên cần một hình chữ nhật phủ kín khung vẽ.
  const surface = new Graphics();
  surface.filters = [filter];
  root.addChild(surface);

  function cover(w, h) {
    surface.clear().rect(0, 0, w, h).fill(0xffffff);
  }
  cover(width, height);

  controls.heading('Việc cần làm (C)');
  controls.note('• Thay công thức trong fragment shader');
  controls.note('• Thêm uniform: vị trí 2 nguồn, bước sóng, tần số');
  controls.note('• Kéo 2 nguồn sóng bằng core/drag.js');
  controls.note('• Bấm một điểm để hiện biên độ tại đó');
  controls.note(`• Độ phân giải hiện tại: ${app.renderer.resolution}×`);

  return {
    update(dt) {
      uniforms.uTime += dt;
    },
    resize: cover,
  };
}
