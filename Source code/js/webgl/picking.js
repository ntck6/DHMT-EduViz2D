// Chọn đối tượng bằng GPU (color picking).
//
// Ý tưởng: vẽ lại cảnh thêm một lần vào một framebuffer ẩn (không hiện ra màn hình),
// mỗi đối tượng tô bằng một "màu mã" riêng mã hóa số thứ tự của nó. Đọc màu tại vị
// trí chuột bằng gl.readPixels rồi giải mã ra số thứ tự. Cách này đúng với mọi hình
// dạng (kể cả hình lõm, hình xoay, hàng chục nghìn bản sao instancing) vì GPU đã
// tô sẵn từng điểm ảnh; CPU không phải kiểm tra từng đối tượng.
//
//   const picker = createPicker(gl);
//   picker.resize(width, height);                 // theo kích thước khung vẽ (CSS px)
//   const id = picker.pick(x, y, () => { ...vẽ cảnh bằng màu mã... });  // -1 nếu trúng nền

// Số thứ tự id (0, 1, 2…) → màu RGB 24 bit. Cộng 1 để màu đen (0) nghĩa là "nền".
export function idToColor(id) {
  const code = id + 1;
  return [(code & 255) / 255, ((code >> 8) & 255) / 255, ((code >> 16) & 255) / 255, 1];
}

// Màu đọc được (byte 0..255) → số thứ tự, hoặc -1 nếu là nền.
export function colorToId(r, g, b) {
  return (r | (g << 8) | (b << 16)) - 1;
}

export function createPicker(gl) {
  const framebuffer = gl.createFramebuffer();
  const texture = gl.createTexture();
  const pixel = new Uint8Array(4);
  let width = 1;
  let height = 1;
  let ratio = 1;

  return {
    resize(cssWidth, cssHeight, pixelRatio = window.devicePixelRatio || 1) {
      ratio = pixelRatio;
      width = Math.max(1, Math.round(cssWidth * ratio));
      height = Math.max(1, Math.round(cssHeight * ratio));
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },

    // x, y: tọa độ CSS px tính từ góc trên trái khung vẽ.
    pick(x, y, drawIds) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, width, height);
      gl.disable(gl.BLEND); // màu mã phải giữ nguyên, không được trộn
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      drawIds();
      // readPixels tính gốc ở góc DƯỚI trái nên phải lật trục y.
      const px = Math.floor(x * ratio);
      const py = height - 1 - Math.floor(y * ratio);
      gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      return colorToId(pixel[0], pixel[1], pixel[2]);
    },
  };
}
