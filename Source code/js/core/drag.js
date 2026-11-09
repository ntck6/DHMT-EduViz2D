// Cho phép kéo-thả một đối tượng PixiJS (Graphics, Sprite, Container…).
//
//   makeDraggable(point, {
//     onDrag: (pos) => { ... },   // pos: tọa độ điểm ảnh trên canvas
//   });
//
// Hàm không tự di chuyển đối tượng: bài học tự quyết định (ví dụ đổi pos sang
// tọa độ thế giới, giới hạn vùng kéo, rồi vẽ lại). Trả về hàm để tắt kéo-thả.
export function makeDraggable(target, { onStart, onDrag, onEnd } = {}) {
  let dragging = false;

  function start(event) {
    dragging = true;
    target.cursor = 'grabbing';
    onStart?.(event.global.clone());
  }

  function move(event) {
    if (dragging) onDrag?.(event.global.clone());
  }

  function end() {
    if (!dragging) return;
    dragging = false;
    target.cursor = 'grab';
    onEnd?.();
  }

  target.eventMode = 'static';
  target.cursor = 'grab';
  target.on('pointerdown', start);
  target.on('globalpointermove', move);
  target.on('pointerup', end);
  target.on('pointerupoutside', end);

  return () => {
    target.off('pointerdown', start);
    target.off('globalpointermove', move);
    target.off('pointerup', end);
    target.off('pointerupoutside', end);
  };
}
