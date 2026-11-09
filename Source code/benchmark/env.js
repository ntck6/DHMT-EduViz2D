// Thông tin máy ghi kèm mọi số liệu đo (mục 4.1 Môi trường của báo cáo).
export function environment(canvasSize) {
  const probe = document.createElement('canvas').getContext('webgl2');
  const info = probe?.getExtension('WEBGL_debug_renderer_info');
  const gpu = info ? probe.getParameter(info.UNMASKED_RENDERER_WEBGL) : probe?.getParameter(probe.RENDERER) ?? 'không rõ';
  probe?.getExtension('WEBGL_lose_context')?.loseContext();
  return {
    browser: navigator.userAgent,
    gpu,
    dpr: window.devicePixelRatio || 1,
    canvas: canvasSize,
  };
}
