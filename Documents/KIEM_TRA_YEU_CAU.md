# Đối chiếu với yêu cầu của thầy

Rà ngày 09/11, sau khi làm xong phần WebGL thuần. Ký hiệu: ✅ đạt · 🟡 có kế hoạch hoặc làm một phần · ❌ chưa có.

**Tóm tắt:** dàn ý và code đã khớp phần lớn yêu cầu. Cái còn thiếu chủ yếu là **nội dung thật**:
- chưa viết chữ nào của báo cáo;
- chưa có số liệu đo trên máy thật;
- chưa có slide, video, bài tập lớp-nhà;
- chưa có luận văn trong danh mục tài liệu.

## 1. TUTORIAL.md – các bước làm đồ án
| Mục | Yêu cầu | Trạng thái | Bằng chứng / còn thiếu |
|---|---|---|---|
| 1 | Chỉ cần đọc, hiểu, cài đặt lại | ✅ | Hướng báo cáo khảo sát + cài lại (`DAN_Y_BAO_CAO.md`, mục "Báo cáo này thuộc kiểu gì?") |
| 2.1 | Đọc kỹ tên đề tài | ✅ | `PROJECT_NAME.md` |
| 2.2 | Xác định từ khóa | ✅ | `PLAN_PHAN_CONG.md` mục 4 |
| 2.3 | Tài liệu từ hội nghị/tạp chí uy tín | ✅ | 12 bài có DOI đã đối chiếu: ACM TOG/SIGGRAPH, Science, Phys. Rev. PER, ACM TOCE, Computational Geometry… |
| 2.3 | Tài liệu từ **luận văn Thạc sĩ / luận án Tiến sĩ** | ❌ | Chưa có luận văn nào. **Cần tìm ít nhất 1–2 luận văn** về vẽ đồ họa trên web / WebGL, hoặc mô phỏng giáo dục |
| 2.3 | Ưu tiên tài liệu dạng Survey / Overview | 🟡 | Có survey phía giáo dục (Hundhausen, Shaffer, Banda, Wang). Phía kỹ thuật vẽ 2D trên GPU chưa có survey |
| 2.4 | Phát biểu bài toán: Input, Output, tác vụ | ✅ | Dàn ý mục 1.3 |
| 2.4 | Tập dữ liệu thử nghiệm (standard dataset) | 🟡 | Bài toán này không có dataset chuẩn; dàn ý 4.3 đã giải thích và mô tả bộ kịch bản tự xây. Chưa có file dữ liệu trong thư mục Data |
| 2.5 | Khảo sát trả lời "người ta đã làm gì / mình làm gì" | 🟡 | Khung và câu kết mẫu có ở dàn ý 2.5; Bảng 2.2 đã điền đủ 16 dòng, còn vài ô [cần kiểm chứng] |
| 2.6 | Chọn phương pháp tiên tiến **đã công bố** để trình bày lại | ✅ | **Loop & Blinn 2005** (ACM TOG, SIGGRAPH 2005), cài lại phần Bézier bậc 2 trên WebGL (`js/webgl/loop-blinn.js`). **Đã đối chiếu toàn văn ngày 13/11** (dàn ý mục 3.3.5): giống ở cách gán (u, v), phương trình ẩn, khoảng cách, vẽ nét; khác ở hình bao và phần cắt đầu mút |
| 2.6 | Trình tự Nguyên lý → Phương pháp → Giải thuật → Chương trình minh họa | ✅ | Dàn ý mục 3.3; chương trình minh họa: bài Ném xiên + `benchmark/curve.html` |
| 2.7 | Môi trường phần cứng, phần mềm | ✅ | Trang benchmark tự ghi GPU, trình duyệt, devicePixelRatio, kích thước khung vẽ |
| 2.7 | Bảng kết quả và đánh giá | ❌ | Trang benchmark đã chạy được nhưng **chưa đo trên máy thật**. Thử nghiệm (b), (c), (d) còn chờ bài của B, C |
| 2.8 | Viết báo cáo (Doc, Slide) | ❌ | Mới có dàn ý |
| 2.9 | Bảng phân công có mốc thời gian | ✅ | `PLAN_PHAN_CONG.md` mục 3 và 5. Lúc nộp chép vào thư mục Personal Information |

## 2. FORMAT_PRESENTATION.md – dàn ý 5 chương
| Mục | Yêu cầu | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.1 | Bối cảnh chung | ✅ dàn ý | Chưa viết |
| 1.2 | Động lực: ý nghĩa khoa học **và** thực tiễn | ✅ dàn ý | Có đủ cả hai ý |
| 1.3 | Input/Output; framework chưa gắn phương pháp | ✅ dàn ý | Bảng 6 công đoạn |
| 1.4 | Đóng góp | ✅ dàn ý | 4 đóng góp, không tự nhận "tốt hơn" |
| Ch.2 | Chọn lọc công trình liên quan | ✅ | 2.1, 2.2 |
| Ch.2 | **Quá trình phát triển** của các giải pháp | ✅ dàn ý | Mục 2.3; mốc năm WebGL đã đối chiếu (1.0: 2011, 2.0: 2017) |
| Ch.2 | Bảng so sánh theo tiêu chí | 🟡 | Đã điền 16 dòng (Bảng 2.2a–c), có ghi nguồn từng ô; còn GeoGebra và vài ô [cần kiểm chứng] |
| Ch.2 | Trả lời 2 câu hỏi cốt lõi | ✅ dàn ý | 2.5 |
| Ch.3 | Chọn một giải pháp tiên tiến | ✅ | Xem TUTORIAL 2.6 |
| Ch.3 | Sơ đồ chung, nguyên lý, phương pháp, giải thuật, minh họa | ✅ dàn ý | Hình chụp lấy từ bài Pipeline WebGL; có bảng kiến thức ↔ file code |
| Ch.4 | Tận dụng code có sẵn + tự viết | ✅ | PixiJS (có sẵn) + `js/webgl/` (tự viết) |
| Ch.4 | Mục đích, kết quả, bàn luận thử nghiệm | 🟡 | Đã ghi mục đích từng thử nghiệm (4.3); chưa có kết quả |
| Ch.5 | Kết luận, hướng phát triển | ✅ dàn ý | Có ghi hạn chế |

## 3. MANUAL_FAULT.md – 8 lỗi thường gặp
| Mục | Yêu cầu | Trạng thái | Ở đâu |
|---|---|---|---|
| 1 | Framework chỉ nêu công đoạn, không gắn phương pháp | ✅ | 1.3, Bảng 1.2. Ngày 13/11 đã sửa ví dụ công đoạn 2 (trước đây gắn sẵn "chia đoạn thẳng") và viết lại Input/Output bằng tham số HTML5/WebGL |
| 2 | Ẩn số của từng công đoạn | ✅ | 1.3, cột "Ẩn số cần tìm" |
| 3 | SOTA so sánh trên cùng cột tiêu chí, theo công đoạn | ✅ | Bảng 2.2a–c dùng chung một bộ cột theo công đoạn, đã điền |
| 4 | Giai đoạn huấn luyện, groundtruth, loss | ✅ (không áp dụng) | Ghi rõ ở Ch.4; groundtruth = nghiệm giải tích, ảnh tham chiếu |
| 5 | Tiến trình hoạt động của hệ thống | ✅ | Ch.3 mục 5 + bài Pipeline WebGL từng bước |
| 6 | Độ đo độ chính xác **và** độ phức tạp tính toán | ✅ dàn ý | 4.4; benchmark đo thời gian khung hình, thời gian CPU, số lệnh vẽ |
| 7 | Mô tả tập dữ liệu: số mẫu, độ đa dạng, tiêu chí, thách thức | ✅ dàn ý | 4.3 ghi số mẫu, tiêu chí, thách thức cho từng thử nghiệm |
| 8 | Khuyết điểm của related works; cải tiến độ chính xác hay độ phức tạp | ✅ | Cột "Khuyết điểm" đã điền (Bảng 2.2); Bảng 2.3 ghi loại vấn đề (độ chính xác / độ phức tạp) và cách đồ án xử lý |

## 4. REGULATION.md – cách nộp
| Thư mục / việc | Yêu cầu | Trạng thái | Còn thiếu |
|---|---|---|---|
| Doc | Báo cáo **.doc + .pdf** | ❌ | Chưa viết. Đề ghi `.doc`, trong khi Word mặc định lưu `.docx`: nên hỏi thầy, hoặc lưu thêm bản Word 97–2003 (`.doc`) cho chắc |
| BTLopNha | Bài tập lớp-nhà **.doc + .pdf** | ❌ | **Chưa có trong kế hoạch.** Cần xác định đề bài tập lớp-nhà là gì và ai làm |
| Slide | **.ppt + .pdf**, kèm video và font chữ | ❌ | Chưa làm; nhớ chép kèm font nếu dùng font ngoài |
| Reference | PDF các tài liệu đã dùng + đường link | 🟡 | Có danh sách và DOI; **đã có PDF Loop & Blinn** (`Documents/p1000-loop.pdf`); các bài khác chưa tải |
| Data | Dữ liệu mẫu, ảnh kết quả | ❌ | Sẽ có CSV benchmark, ảnh chụp các bước pipeline, bộ kịch bản thử nghiệm |
| Source code | Mã nguồn có chú thích, link, chương trình chạy được | ✅ | `Source code/` có comment tiếng Việt, README, test; chạy offline bằng Live Server |
| Video clip | Video liên quan | ❌ | C làm video demo |
| Personal Information | Thông tin nhóm + bảng phân công | ❌ | Chép bảng phân công từ `PLAN_PHAN_CONG.md`, thêm họ tên, MSSV |
| Nộp | Upload Google Drive, gửi link qua email | ❌ | Đúng **ngày thi lý thuyết**, không trước, không sau |
| Tiêu đề email | `[K2024-CLC-DHMT-TEN NHOM]` | ❌ | **Cần chốt tên nhóm** |

## 5. Việc cần làm thêm (theo thứ tự ưu tiên)
1. **Đo benchmark trên máy thật** (A): CSV vào thư mục Data, làm bảng và biểu đồ cho Ch.4(a); lấy thêm số liệu instancing từ bài Pipeline (thử nghiệm e).
2. **Điền bảng so sánh Ch.2** (cả nhóm), kể cả cột "Khuyết điểm".
3. **Tìm 1–2 luận văn Thạc sĩ/Tiến sĩ** (TUTORIAL 2.3). Gợi ý từ khóa: `master thesis WebGL rendering performance`, `thesis web-based 2D visualization GPU`, `thesis interactive physics simulation education web`.
4. **Xác định bài tập lớp-nhà (BTLopNha)** và người làm.
5. **Chốt tên nhóm** cho tiêu đề email.
6. Bắt đầu viết Ch.1–2 ngay trong tuần 8, không để dồn sang tuần 10.
7. Đối chiếu nguồn Carucci 2005; kiểm chứng cách vẽ của GeoGebra và các ô ghi [cần kiểm chứng] trong Bảng 2.2.
8. Tải PDF tài liệu vào thư mục Reference ngay khi đọc.
