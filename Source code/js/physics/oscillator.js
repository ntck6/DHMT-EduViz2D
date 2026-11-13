// Con lắc & lò xo – người phụ trách: C
// Tác vụ 2D minh họa: cập nhật trạng thái theo thời gian (tích phân số).
//
// Gợi ý cách chia file:
//   physics/integrators.js   Euler, Verlet, RK4, không dùng PixiJS. Cùng một chữ ký, ví dụ:
//                              step(state, dt, derivative) → state mới
//                            → kiểm tra bằng node --test: lò xo không ma sát có nghiệm
//                              x(t) = A·cos(ωt), so sai số và năng lượng sau N bước.
//   physics/oscillator.js    File này: vẽ lò xo/con lắc, cho chạy 3 integrator cạnh nhau.
//
// Số liệu sai số và năng lượng là thử nghiệm (b) của Ch.4 (bộ kịch bản ở Documents/Ch4. Cai dat va thu nghiem.md, Bảng 4.4:
// lò xo không ma sát, 3 phương pháp × Δt = 1/30, 1/60, 1/120 s, 10 chu kỳ).
// Mẫu tách mô hình khỏi phần vẽ: physics/projectile-model.js + tests/projectile-model.test.mjs.
//
// Helper có sẵn: core/playback.js, core/view.js + core/draw.js (hệ trục), controls.select.
// Xem bài mẫu: mở trang với ?dev#template.
import { showPlaceholder } from '../core/placeholder.js';

export function mount(context) {
  return showPlaceholder(context, {
    owner: 'C',
    todo: [
      'Viết Euler, Verlet, RK4 + test với nghiệm giải tích',
      'Vẽ lò xo hoặc con lắc chuyển động',
      'Kéo quả nặng ra vị trí ban đầu rồi thả (core/drag.js)',
      'Chạy 3 integrator cạnh nhau, hiện năng lượng',
      'Xuất số liệu sai số cho Ch.4',
    ],
  });
}
