// Tính FPS trung bình theo cửa sổ 0.5 giây để số hiển thị không nhảy liên tục.
export function createFpsMeter(windowMs = 500) {
  let elapsed = 0;
  let frames = 0;
  let value = 0;

  return {
    tick(deltaMs) {
      elapsed += deltaMs;
      frames += 1;
      if (elapsed >= windowMs) {
        value = Math.round((frames * 1000) / elapsed);
        elapsed = 0;
        frames = 0;
      }
      return value;
    },
  };
}
