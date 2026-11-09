// Xuất khung vẽ hiện tại ra file PNG (tác vụ 2D tĩnh), dùng các API của HTML5:
// Canvas 2D để ghép lớp, canvas.toBlob để mã hóa PNG, URL.createObjectURL + thẻ <a download> để tải về.
//
// Ghép theo đúng thứ tự hiển thị: nền trắng → các lớp WebGL thuần → canvas PixiJS.
// Cả hai loại canvas đều bật preserveDrawingBuffer nên đọc lại được hình đã vẽ.
export async function exportPNG(host, fileName) {
  const layers = [...host.querySelectorAll('canvas')];
  const top = layers.at(-1);
  const out = document.createElement('canvas');
  out.width = top.width;
  out.height = top.height;

  const ctx = out.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, out.width, out.height);
  for (const layer of layers) ctx.drawImage(layer, 0, 0, out.width, out.height);

  const blob = await new Promise((resolve) => out.toBlob(resolve, 'image/png'));
  downloadBlob(blob, fileName);
  return blob;
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
