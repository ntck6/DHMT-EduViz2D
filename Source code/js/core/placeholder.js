// Màn hình tạm cho bài chưa làm xong: hiện tên người phụ trách và việc cần làm.
// Khi bắt đầu code thật, xóa lời gọi showPlaceholder() trong file bài học.
import { Text } from '../pixi.js';
import { COLOR } from './theme.js';

export function showPlaceholder({ root, controls, width, height }, { owner, todo }) {
  const message = new Text({
    text: `Bài này đang làm – phụ trách: ${owner}`,
    style: { fontFamily: 'system-ui, "Segoe UI", sans-serif', fontSize: 16, fill: COLOR.axis },
  });
  message.anchor.set(0.5);
  root.addChild(message);

  controls.heading('Việc cần làm');
  for (const item of todo) controls.note(`• ${item}`);

  function center(w, h) {
    message.position.set(w / 2, h / 2);
  }
  center(width, height);
  return { resize: center };
}
