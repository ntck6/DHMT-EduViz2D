// Nhóm nút Play / Pause / Reset / Step (+ thanh tốc độ nếu cần) dùng chung.
//
//   const playback = createPlayback(controls, {
//     onPlay: () => { ... },          // tùy chọn, ví dụ chạy lại từ đầu khi đã hết
//     onReset: () => { ... },
//     onStep: () => { ... },          // tiến một bước khi bấm Step
//     speed: { min: 0.25, max: 4 },   // tùy chọn: hiện thanh trượt tốc độ
//   });
//
//   update(dt) { if (playback.playing) simulate(dt * playback.speed); }
//
// Gọi playback.pause() khi mô phỏng tự kết thúc.
export function createPlayback(controls, { onPlay, onReset, onStep, speed } = {}) {
  let playing = false;
  let speedValue = 1;

  controls.heading('Điều khiển');
  const playButton = controls.button('Play', () => {
    onPlay?.();
    setPlaying(true);
  });
  const pauseButton = controls.button('Pause', () => setPlaying(false));
  controls.button('Reset', () => {
    setPlaying(false);
    onReset?.();
  });
  controls.button('Step', () => {
    setPlaying(false);
    onStep?.();
  });

  if (speed) {
    controls.slider({
      label: 'Tốc độ', min: speed.min ?? 0.25, max: speed.max ?? 4, step: speed.step ?? 0.25,
      value: 1, unit: '×', onInput: (value) => { speedValue = value; },
    });
  }

  function setPlaying(next) {
    playing = next;
    playButton.disabled = playing;
    pauseButton.disabled = !playing;
  }

  setPlaying(false);

  return {
    get playing() { return playing; },
    get speed() { return speedValue; },
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
  };
}
