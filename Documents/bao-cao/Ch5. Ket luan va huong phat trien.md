# Chương 5. Kết luận và hướng phát triển

> Bản viết dạng văn của Chương 5. Ô [x] lấy từ số đo cuối cùng ở Chương 4.

## 5.1. Kết quả đạt được

Báo cáo đã khảo sát cách sử dụng HTML5 và WebGL cho các tác vụ đồ họa 2D tĩnh và động, áp dụng trong ứng dụng trực quan hóa kiến thức Tin học và Vật lý.

**Người ta đã làm gì.** Chương 2 so sánh 15 công trình theo cùng một khung 5 công đoạn. Các ứng dụng giáo dục như PhET và VisuAlgo đã giải tốt bài toán trực quan hóa đúng và dễ hiểu, nhưng phần lớn vẽ bằng SVG hoặc phần tử trang và không công bố số liệu hiệu năng. Các kỹ thuật vẽ 2D tiên tiến trên GPU (Kilgard và Bolz, Ganacim và cộng sự, Li và cộng sự) cần những tính năng chưa có trong WebGL. Phương pháp của Loop và Blinn chỉ cần fragment shader nên chạy được trên trình duyệt, nhưng bài báo không công bố số đo.

**Báo cáo đã làm được gì.**
1. **Phương pháp cải tiến.** Trình bày và cài đặt lại phương pháp vẽ đường cong độc lập độ phân giải của Loop và Blinn (2005) [1] trên WebGL cho đường cong Bézier bậc 2, áp dụng vẽ quỹ đạo ném xiên; đối chiếu từng bước với bài báo (Bảng 3.3). Ở mức phóng to 64×, phương pháp giữ sai số dưới [x] điểm ảnh với 4 đỉnh, trong khi đường gấp khúc 120 đoạn lệch [y] điểm ảnh với 720 đỉnh (thử nghiệm f).
2. **Giải pháp nền.** Xây dựng ứng dụng EduViz2D trên pipeline WebGL 2 kết hợp instancing. Ở [N] hình, WebGL thuần cần [z] ms thời gian CPU mỗi khung hình so với [w] ms của Canvas 2D (thử nghiệm a); instancing giảm chi phí vẽ 10.000 bản sao từ [p] ms xuống [q] ms (thử nghiệm d); tính màu từng điểm ảnh trên GPU nhanh hơn CPU khoảng [r] lần ở 1920 × 1080 (thử nghiệm e).
3. **Dữ liệu đầu vào cho phần vẽ.** Velocity Verlet và RK4 giữ năng lượng ổn định hơn Euler hiện ([s] % so với [t] % sau 10 chu kỳ, thử nghiệm b); A* duyệt ít ô hơn Dijkstra khoảng [u] % mà vẫn cho đường ngắn nhất (thử nghiệm c).
4. **Khảo sát.** Hệ thống hóa 15 công trình theo mẫu bảng so sánh, xác định 7 khuyết điểm còn tồn đọng và cách đồ án xử lý từng khuyết điểm (mục 2.5, 2.6).

## 5.2. Hạn chế

- Loop và Blinn mới được cài cho đường cong Bézier bậc 2; hình bao là hộp chữ nhật nên GPU xử lý thừa một số điểm ảnh so với tam giác điều khiển của bài báo.
- Mô phỏng chỉ dùng các phương pháp tích phân cơ bản; lưới tìm đường ở cỡ vừa (tối đa 100 × 100).
- Lớp WebGL thuần chưa vẽ chữ; chữ vẫn do PixiJS vẽ dạng bitmap.
- Số liệu đo trên ít loại máy và trình duyệt.
- Báo cáo chưa đánh giá hiệu quả học tập với người học thật.

## 5.3. Hướng phát triển

- **Loop và Blinn cho đường cong Bézier bậc 3:** phân loại đường cong, kiểm tra hướng và chia nhỏ các đường có vòng như mục 4 của bài báo [1]; thay hộp chữ nhật bằng tam giác điều khiển cộng một dải lề để giảm số điểm ảnh thừa.
- **Vẽ chữ bằng trường khoảng cách** theo Green (2007) [2], dùng hai kênh để giữ góc nhọn, thay cho chữ bitmap.
- **Chuyển sang WebGPU** [15] khi mức hỗ trợ đồng đều hơn, để dùng compute shader: tính mô phỏng trực tiếp trên GPU và mở đường cài đặt các kỹ thuật như Ganacim và cộng sự (2014) [4], Li và cộng sự (2016) [5].
- **Thử nghiệm với người học:** bài kiểm tra trước và sau khi dùng ứng dụng, để đánh giá hiệu quả học tập như các nghiên cứu về PhET [20].
