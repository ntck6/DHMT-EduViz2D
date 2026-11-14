# Đối chiếu với yêu cầu của thầy

Rà ngày 09/11, cập nhật 13/11 sau khi chọn file Chương 2 của nhóm làm chuẩn, và 14/11 sau khi có bản viết đủ 5 chương trong `../bao-cao/` (khung C1–C5, giải pháp nền pipeline WebGL 2 + instancing, phương pháp cải tiến Loop & Blinn, 7 thử nghiệm (a)–(g)). Ký hiệu: ✅ đạt · 🟡 có kế hoạch hoặc làm một phần · ❌ chưa có.

**Tóm tắt:** bản viết 5 chương và code lõi đã khớp phần lớn yêu cầu. Cái còn thiếu là **bằng chứng**:
- chưa có số đo trên máy thật (Bảng 4.2, 4.5–4.11 còn số chạy thử hoặc ô trống);
- chưa có hình nào trong 23 hình (1.1, 3.1–3.11, 4.1–4.11);
- Ch.3 mục 3.4, 3.5 và Ch.4 mục 4.2 đã mô tả các bài Đồ thị, A*, Con lắc, Giao thoa sóng và thuật toán sắp xếp như đã có, nhưng code mới là khung;
- chưa có file Word, slide, video, bài tập lớp-nhà;
- chưa có luận văn trong danh mục tài liệu.

## 1. TUTORIAL.md – các bước làm đồ án
| Mục | Yêu cầu | Trạng thái | Bằng chứng / còn thiếu |
|---|---|---|---|
| 1 | Chỉ cần đọc, hiểu, cài đặt lại | ✅ | Hướng báo cáo khảo sát + cài lại (`DAN_Y_BAO_CAO.md`, mục "Báo cáo này thuộc kiểu gì?") |
| 2.1 | Đọc kỹ tên đề tài | ✅ | `../yeu-cau/PROJECT_NAME.md` |
| 2.2 | Xác định từ khóa | ✅ | `PLAN_PHAN_CONG.md` mục 4 |
| 2.3 | Tài liệu từ hội nghị/tạp chí uy tín | ✅ | Danh mục 25 tài liệu ở `../bao-cao/Tai lieu tham khao.md`, mọi DOI đã đối chiếu với Crossref ngày 14/11: ACM TOG/SIGGRAPH, Science, Phys. Rev. PER, ACM TOCE, JVLC… Đã bỏ Eder 2018 vì không dùng |
| 2.3 | Tài liệu từ **luận văn Thạc sĩ / luận án Tiến sĩ** | ❌ | Chưa có luận văn nào. **Cần tìm ít nhất 1–2 luận văn** về vẽ đồ họa trên web / WebGL, hoặc mô phỏng giáo dục |
| 2.3 | Ưu tiên tài liệu dạng Survey / Overview | 🟡 | Có survey phía giáo dục (Hundhausen, Shaffer, Banda, Wang). Phía kỹ thuật vẽ 2D trên GPU chưa có survey |
| 2.4 | Phát biểu bài toán: Input, Output, tác vụ | ✅ | `../bao-cao/Ch1. Gioi thieu.md`, mục 1.3 (Bảng 1.1–1.3) |
| 2.4 | Tập dữ liệu thử nghiệm (standard dataset) | 🟡 | Bài toán này không có dataset chuẩn; `../bao-cao/Ch4. Cai dat va thu nghiem.md` mục 4.3 (Bảng 4.4) đã giải thích và mô tả bộ kịch bản tự xây. Chưa có file dữ liệu trong thư mục Data |
| 2.5 | Khảo sát trả lời "người ta đã làm gì / mình làm gì" | ✅ | File Ch2: mục 2.4 (đã có / còn thiếu theo C1–C5), 2.5 (7 khuyết điểm), 2.6 (mục tiêu, bảng khuyết điểm → thử nghiệm). Còn vài việc kiểm lại ghi ở cuối file Ch2 |
| 2.6 | Chọn phương pháp tiên tiến **đã công bố** để trình bày lại | ✅ | Giải pháp nền là pipeline WebGL 2 + instancing (theo đặc tả, không phải bài báo). Phương pháp tiên tiến đã công bố là **Loop & Blinn 2005** (ACM TOG, SIGGRAPH 2005), đóng vai phương pháp cải tiến; cài lại phần Bézier bậc 2 trên WebGL (`js/webgl/loop-blinn.js`). **Đã đối chiếu toàn văn ngày 13/11** (Ch3 mục 3.3.5, Bảng 3.3): giống ở cách gán (u, v), phương trình ẩn, khoảng cách, vẽ nét; khác ở hình bao và phần cắt đầu mút |
| 2.6 | Trình tự Nguyên lý → Phương pháp → Giải thuật → Chương trình minh họa | ✅ | `../bao-cao/Ch3. Phuong phap.md` mục 3.2 (nền), 3.3 (cải tiến); chương trình minh họa: bài Ném xiên + `benchmark/curve.html` |
| 2.7 | Môi trường phần cứng, phần mềm | ✅ | Trang benchmark tự ghi GPU, trình duyệt, devicePixelRatio, kích thước khung vẽ |
| 2.7 | Bảng kết quả và đánh giá | ❌ | Có công cụ cho (a), (d), (f) nhưng **chưa đo trên máy thật**. (b), (c), (e) chưa có code (bài con lắc, A*, sóng của B, C); (g) tùy chọn |
| 2.8 | Viết báo cáo (Doc, Slide) | 🟡 | Bản viết Markdown đủ 5 chương (`../bao-cao/`, 14/11); chưa có số đo thật, hình, file Word; chưa có Slide |
| 2.9 | Bảng phân công có mốc thời gian | ✅ | `PLAN_PHAN_CONG.md` mục 3 và 5. Lúc nộp chép vào thư mục Personal Information |

## 2. FORMAT_PRESENTATION.md – dàn ý 5 chương
| Mục | Yêu cầu | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.1 | Bối cảnh chung | ✅ | Ch1 mục 1.1 |
| 1.2 | Động lực: ý nghĩa khoa học **và** thực tiễn | ✅ | Ch1 mục 1.2, hai đoạn tách riêng |
| 1.3 | Input/Output; framework chưa gắn phương pháp | 🟡 | Bảng 1.1–1.3 đã viết; Bảng 1.2: 5 công đoạn C1–C5, có cột HTML5/WebGL tham gia. Còn vẽ Hình 1.1 |
| 1.4 | Đóng góp | ✅ | Bảng 1.4: 6 đóng góp kèm nơi chứng minh, không tự nhận "tốt hơn" |
| Ch.2 | Chọn lọc công trình liên quan | ✅ | **File chính `../bao-cao/Ch2. Cac cong trinh nghien cuu lien quan.md`**: 15 công trình, 3 nhóm (công nghệ render, ứng dụng giáo dục, kỹ thuật GPU) + nghiên cứu giáo dục |
| Ch.2 | **Quá trình phát triển** của các giải pháp | ✅ | File Ch2 mục 2.2: 5 giai đoạn, bảng tóm tắt hai trục; mốc WebGL 1.0 (2011), 2.0 (2017), Safari 15 (2021), WebGPU (web.dev 25/11/2025) đã đối chiếu |
| Ch.2 | Bảng so sánh theo tiêu chí | ✅ | File Ch2 Bảng 2.1–2.3 theo mẫu của thầy, cột Pipeline là C1–C5: mọi ô có nội dung, công đoạn có đóng góp in đậm, hiệu suất lấy từ bài gốc. Bỏ GeoGebra, Desmos (Toán, chưa kiểm chứng); Horak 2018 làm cột Hiệu suất nhóm A. Ngày 14/11 đã kiểm chứng lại: 10 DOI qua Crossref, poster Horak (toàn văn), Green 2007 (toàn văn), mã nguồn Falstad, tóm tắt Li 2016; không còn ô trống hay dấu (\*) |
| Ch.2 | Trả lời 2 câu hỏi cốt lõi | ✅ | File Ch2 mục 2.5, 2.6 |
| Ch.3 | Chọn một giải pháp tiên tiến | ✅ | Loop & Blinn 2005 (3.3), trên nền pipeline WebGL 2 + instancing (3.2) |
| Ch.3 | Sơ đồ chung, nguyên lý, phương pháp, giải thuật, minh họa | 🟡 | 3.2 và 3.3 đều viết theo 4 bước, có giả mã và shader; có bảng kiến thức ↔ file code. Còn 11 hình (3.1–3.11); 3.4, 3.5 viết trước khi có code |
| Ch.4 | Tận dụng code có sẵn + tự viết | ✅ | `../bao-cao/Ch4. Cai dat va thu nghiem.md` 4.1.1, Bảng 4.1: PixiJS, API trình duyệt (có sẵn) và `js/webgl/`, Loop & Blinn, `benchmark/` (tự viết) |
| Ch.4 | Mục đích, kết quả, bàn luận thử nghiệm | 🟡 | Đã ghi mục đích, bộ kịch bản, đáp án của 7 thử nghiệm (4.3); chưa có kết quả |
| Ch.5 | Kết luận, hướng phát triển | 🟡 | Đã viết, có hạn chế; các con số [x] chờ Ch.4 |

## 3. MANUAL_FAULT.md – 8 lỗi thường gặp
| Mục | Yêu cầu | Trạng thái | Ở đâu |
|---|---|---|---|
| 1 | Framework chỉ nêu công đoạn, không gắn phương pháp | ✅ | 1.3, Bảng 1.2 (C1–C5). C3 để mở: "xấp xỉ bằng đoạn thẳng hay tính tại điểm ảnh?", "N lệnh vẽ hay 1 lệnh?". Input/Output viết bằng tham số HTML5/WebGL |
| 2 | Ẩn số của từng công đoạn | ✅ | 1.3, cột "Ẩn số cần tìm" |
| 3 | SOTA so sánh trên cùng cột tiêu chí, theo công đoạn | ✅ | File Ch2 Bảng 2.1–2.3, cột Pipeline là C1–C5; có 5 bài báo kỹ thuật (Loop & Blinn, Green, Kilgard & Bolz, Ganacim, Li) |
| 4 | Giai đoạn huấn luyện, groundtruth, loss | ✅ (không áp dụng) | Ghi rõ ở 4.5; groundtruth = phương trình đường cong (f), nghiệm giải tích (b), đường ngắn nhất của Dijkstra (c), ảnh CPU (e) |
| 5 | Tiến trình hoạt động của hệ thống | ✅ | `../bao-cao/Ch3. Phuong phap.md` 3.7 (một khung hình qua C1–C5) + bài Pipeline WebGL từng bước |
| 6 | Độ đo độ chính xác **và** độ phức tạp tính toán | ✅ | 4.4; benchmark đo thời gian khung hình, thời gian CPU, số lệnh vẽ |
| 7 | Mô tả tập dữ liệu: số mẫu, độ đa dạng, tiêu chí, thách thức | ✅ | 4.3, Bảng 4.4 ghi số mẫu, tiêu chí, thách thức cho từng thử nghiệm |
| 8 | Khuyết điểm của related works; cải tiến độ chính xác hay độ phức tạp | ✅ | Cột "Giới hạn" các bảng file Ch2; mục 2.5 ghi 7 khuyết điểm kèm công đoạn và loại vấn đề; mục 2.6 nối mỗi khuyết điểm với thử nghiệm |

## 4. REGULATION.md – cách nộp
| Thư mục / việc | Yêu cầu | Trạng thái | Còn thiếu |
|---|---|---|---|
| Doc | Báo cáo **.doc + .pdf** | 🟡 | Thư mục `Doc/` đã tạo; bản viết Markdown ở `../bao-cao/`, chưa ghép Word. Đề ghi `.doc`, trong khi Word mặc định lưu `.docx`: nên hỏi thầy, hoặc lưu thêm bản Word 97–2003 (`.doc`) cho chắc |
| BTLopNha | Bài tập lớp-nhà **.doc + .pdf** | ❌ | **Chưa có trong kế hoạch.** Cần xác định đề bài tập lớp-nhà là gì và ai làm |
| Slide | **.ppt + .pdf**, kèm video và font chữ | ❌ | Chưa làm; nhớ chép kèm font nếu dùng font ngoài |
| Reference | PDF các tài liệu đã dùng + đường link | 🟡 | Thư mục `Reference/` đã tạo; **đã có PDF Loop & Blinn** (`Reference/Loop-Blinn-2005.pdf`); các bài khác chưa tải |
| Data | Dữ liệu mẫu, ảnh kết quả | ❌ | Thư mục `Data/` đã tạo. Sẽ có CSV của 7 thử nghiệm, ảnh chụp các bước pipeline, bộ kịch bản thử nghiệm |
| Source code | Mã nguồn có chú thích, link, chương trình chạy được | ✅ | `Source code/` có comment tiếng Việt, README, test; chạy offline bằng Live Server |
| Video clip | Video liên quan | ❌ | C làm video demo |
| Personal Information | Thông tin nhóm + bảng phân công | ❌ | Chép bảng phân công từ `PLAN_PHAN_CONG.md`, thêm họ tên, MSSV |
| Nộp | Upload Google Drive, gửi link qua email | ❌ | Đúng **ngày thi lý thuyết**, không trước, không sau |
| Tiêu đề email | `[K2024-CLC-DHMT-TEN NHOM]` | ❌ | **Cần chốt tên nhóm** |

## 5. Việc cần làm thêm (theo thứ tự ưu tiên)
1. **Đo benchmark trên máy thật** (A): CSV vào thư mục Data, làm bảng và biểu đồ cho Ch.4(a); lấy thêm số liệu instancing từ bài Pipeline (thử nghiệm d); đo cả (f).
2. **Làm các mục "Việc còn lại trước khi nộp" ở cuối file Ch2** (Li 2016 toàn văn; ảnh chụp bằng chứng cho PhET, VisuAlgo, algorithm-visualizer).
3. **Tìm 1–2 luận văn Thạc sĩ/Tiến sĩ** (TUTORIAL 2.3). Gợi ý từ khóa: `master thesis WebGL rendering performance`, `thesis web-based 2D visualization GPU`, `thesis interactive physics simulation education web`.
4. **Xác định bài tập lớp-nhà (BTLopNha)** và người làm.
5. **Chốt tên nhóm** cho tiêu đề email.
6. **Vẽ và chụp 23 hình** (1.1, 3.1–3.11, 4.1–4.11); xóa hết ký hiệu [số chạy thử], [cần số đo], [x] trước khi ghép Word.
7. Đối chiếu nguồn Carucci 2005 (dẫn ở mục 3.2).
8. Tải PDF tài liệu vào thư mục Reference ngay khi đọc.
9. **Code cho thử nghiệm (b), (c), (e)** (C, B): hiện bài con lắc, A*, sóng mới là khung.
