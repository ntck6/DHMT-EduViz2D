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
//
// Phím tắt (sự kiện bàn phím của HTML5): Space = Play/Pause, → = Step, R = Reset.
export function createPlayback(controls, { onPlay, onReset, onStep, speed } = {}) {
  let playing = false;
  let speedValue = 1;

  function play() {
    onPlay?.();
    setPlaying(true);
  }

  function reset() {
    setPlaying(false);
    onReset?.();
  }

  function step() {
    setPlaying(false);
    onStep?.();
  }

  controls.heading('Điều khiển');
  const playButton = controls.button('Play', play);
  const pauseButton = controls.button('Pause', () => setPlaying(false));
  controls.button('Reset', reset);
  controls.button('Step', step);

  if (speed) {
    controls.slider({
      label: 'Tốc độ', min: speed.min ?? 0.25, max: speed.max ?? 4, step: speed.step ?? 0.25,
      value: 1, unit: '×', onInput: (value) => { speedValue = value; },
    });
  }
  controls.note('Phím tắt: Space = Play/Pause, → = Step, R = Reset');

  addEventListener('keydown', (event) => {
    // Bỏ qua khi đang thao tác trên ô nhập, nút bấm, hoặc giữ Ctrl/Alt/Cmd.
    if (event.target.closest?.('input, select, textarea, button') || event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.code === 'Space') {
      event.preventDefault(); // không cuộn trang
      if (playing) setPlaying(false);
      else play();
    } else if (event.code === 'ArrowRight') {
      event.preventDefault();
      step();
    } else if (event.code === 'KeyR') {
      reset();
    }
  }, { signal: controls.signal });

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
