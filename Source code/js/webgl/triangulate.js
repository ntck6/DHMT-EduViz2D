// Chia đa giác đơn (lồi hoặc lõm, không tự cắt) thành tam giác bằng phương pháp
// cắt tai (ear clipping). GPU chỉ vẽ được tam giác, nên mọi hình 2D đều phải qua
// bước này (công đoạn "xử lý hình học" trong framework Ch.1).
//
// Ý tưởng: đỉnh i là "tai" nếu tam giác (i-1, i, i+1) quay cùng chiều với đa giác
// và không chứa đỉnh nào khác. Cắt tai đó ra, lặp lại đến khi còn 3 đỉnh.
// Độ phức tạp O(n²) với n đỉnh; đủ nhanh cho vài trăm đỉnh.
//
// points: [{ x, y }, ...]  →  mảng chỉ số, mỗi 3 số là một tam giác.

export function signedArea(points) {
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    area += points[j].x * points[i].y - points[i].x * points[j].y;
  }
  return area / 2;
}

function cross(o, a, b) {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function insideTriangle(p, a, b, c) {
  const d1 = cross(a, b, p);
  const d2 = cross(b, c, p);
  const d3 = cross(c, a, p);
  const hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPositive = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNegative && hasPositive);
}

export function triangulate(points) {
  const n = points.length;
  if (n < 3) return [];

  const orientation = Math.sign(signedArea(points)) || 1;
  const remaining = [...Array(n).keys()];
  const triangles = [];
  let guard = 0;

  while (remaining.length > 3 && guard++ < n * n) {
    let clipped = false;
    for (let k = 0; k < remaining.length; k++) {
      const prev = remaining[(k - 1 + remaining.length) % remaining.length];
      const curr = remaining[k];
      const next = remaining[(k + 1) % remaining.length];
      const a = points[prev];
      const b = points[curr];
      const c = points[next];

      // Góc tại b phải lồi (cùng chiều với đa giác).
      if (cross(a, b, c) * orientation <= 0) continue;

      // Không đỉnh nào khác nằm trong tam giác.
      const blocked = remaining.some(
        (index) => index !== prev && index !== curr && index !== next && insideTriangle(points[index], a, b, c),
      );
      if (blocked) continue;

      triangles.push(prev, curr, next);
      remaining.splice(k, 1);
      clipped = true;
      break;
    }
    if (!clipped) break; // đa giác tự cắt: dừng, trả phần đã chia được
  }

  if (remaining.length === 3) triangles.push(...remaining);
  return triangles;
}
