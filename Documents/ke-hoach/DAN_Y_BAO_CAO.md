# Dàn ý và bản đồ báo cáo – Xây dựng ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục

Theo `../yeu-cau/FORMAT_PRESENTATION.md` (5 chương) và các lỗi cần tránh trong `../yeu-cau/MANUAL_FAULT.md`. Bảng đối chiếu từng yêu cầu: `KIEM_TRA_YEU_CAU.md`.

**Từ ngày 14/11/2026, mọi chương đã có bản viết dạng văn trong file riêng.** File này không chép lại nội dung, chỉ giữ: cách hiểu báo cáo, bản đồ các file, trạng thái và việc còn lại, và bảng đối chiếu với yêu cầu của thầy. Dàn ý chi tiết cũ (có các đoạn mẫu) vẫn xem được trong lịch sử Git (commit 2340c69).

## 1. Báo cáo này thuộc kiểu gì?
Thầy cần **báo cáo khảo sát và cài đặt lại**: giống một luận văn thu nhỏ, nhưng không cần phát minh gì mới (TUTORIAL: "đọc, hiểu, cài đặt lại; chưa đòi hỏi đề xuất giải pháp mới"). Mạch của cả báo cáo:

> Bài toán là gì → người ta đã giải thế nào (khảo sát) → chọn một cách tiên tiến, giải thích nó hoạt động ra sao → cài lại, đo đạc, nhận xét.

| | Báo cáo khảo sát và cài đặt lại (**thầy cần**) | Báo cáo mô tả phần mềm (**không phải**) |
|---|---|---|
| Câu hỏi chính | Vẽ 2D tĩnh và động bằng HTML5 + WebGL thế nào? Cách nào tốt hơn, vì sao? | App của nhóm có những chức năng gì? |
| Nội dung chính | Bài toán, các giải pháp đã có, nguyên lý, giải thuật, số liệu đo | Yêu cầu, sơ đồ use case, giao diện, hướng dẫn dùng |
| Vai trò của app | Bằng chứng cho Ch.3 và nguồn số liệu cho Ch.4 | Là toàn bộ nội dung báo cáo |
| Ví dụ câu viết | "Fragment shader tính u² − v tại từng điểm ảnh, nên đường cong vẫn mịn ở mọi mức phóng to." | "Người dùng bấm nút Play để bắt đầu mô phỏng." |

**Trọng tâm là đồ họa 2D trên web bằng HTML5 + WebGL;** giáo dục (Tin học, Vật lý) là nơi sinh ra các cảnh cần vẽ. Khung chung là 5 công đoạn C1–C5 (Bảng 1.2). C2 (công thức vật lý, thuật toán) chỉ viết ngắn ở mục 3.4 và thử nghiệm (b), (c); các phần về vẽ và thử nghiệm (a), (d), (e), (f) viết trước và kỹ hơn. Ảnh chụp app chỉ dùng để minh họa một kỹ thuật hay một kết quả đo.

## 2. Bản đồ các file của báo cáo
Các file dưới đây nằm ở `Documents/bao-cao/`. Thứ tự ghép vào Word:

| Thứ tự | File | Nội dung | Người viết |
|---|---|---|---|
| 0 | `Ch0. Phan dau bao cao.md` | Bìa, tóm tắt, từ khóa, danh mục từ viết tắt | A |
| 1 | `Ch1. Gioi thieu.md` | 1.1 Bối cảnh; 1.2 Động lực; 1.3 Phát biểu bài toán (Bảng 1.1–1.3, Hình 1.1); 1.4 Đóng góp (Bảng 1.4); 1.5 Bố cục | A |
| 2 | `Ch2. Cac cong trinh nghien cuu lien quan.md` | 2.1 Cách khảo sát; 2.2 Tiến trình phát triển; 2.3 Ba nhóm công trình (Bảng 2.1–2.3); 2.4 Phân tích theo công đoạn; 2.5 Khuyết điểm; 2.6 Mục tiêu (Bảng 2.4) | A; B (Tin học); C (Vật lý) |
| 3 | `Ch3. Phuong phap.md` | 3.1 Sơ đồ; 3.2 Giải pháp nền; 3.3 Loop và Blinn; 3.4 Tính toán; 3.5 Tính theo điểm ảnh; 3.6 Tương tác; 3.7 Tiến trình; 3.8 Kiến thức ↔ code (Bảng 3.1–3.5, Hình 3.1–3.11) | A (3.1–3.3, 3.7, 3.8); B (3.4 thuật toán, 3.6); C (3.4 vật lý, 3.5) |
| 4 | `Ch4. Cai dat va thu nghiem.md` | 4.1 Môi trường và cài đặt; 4.2 Bài minh họa; 4.3 Bộ thử nghiệm; 4.4 Kết quả 7 thử nghiệm; 4.5 Bàn luận (Bảng 4.1–4.11, Hình 4.1–4.11) | A tổng hợp; (f), (a), (d) – A; (b), (e) – C; (c), (g) – B |
| 5 | `Ch5. Ket luan va huong phat trien.md` | 5.1 Kết quả; 5.2 Hạn chế; 5.3 Hướng phát triển | A |
| 6 | `Tai lieu tham khao.md` | Danh mục chung [1]–[25], DOI đã đối chiếu | A |

**Quy ước dùng chung giữa các file:** khung C1–C5 và ẩn số (Bảng 1.2); nhãn thử nghiệm (a)–(g) (Bảng 2.4 cuối mục 2.6 và Bảng 4.4); số trích dẫn [1]–[25]; bảng và hình đánh số theo chương. Sửa một quy ước thì sửa ở mọi file.

**Ký hiệu chỗ chưa xong:** *[Hình …]* chỗ chèn ảnh; **[số chạy thử]** số tạm, thay trước khi nộp; **[cần số đo]**, [x], [y] chưa có số; [cần kiểm chứng] khẳng định chưa có nguồn. Báo cáo nộp không còn ký hiệu nào.

## 3. Trạng thái và việc còn lại (cập nhật 14/11/2026)
| Phần | Đã có | Còn lại | Người |
|---|---|---|---|
| Phần đầu | Tóm tắt, viết tắt, khung bìa | Tên nhóm, họ tên, MSSV; một câu kết quả trong tóm tắt | A |
| Ch.1 | **Đã viết dạng văn** đủ 5 mục, 4 bảng | Vẽ Hình 1.1 | A |
| Ch.2 | **Đã viết dạng văn**, 4 bảng theo mẫu của thầy, nguồn đã kiểm chứng | Ảnh chụp bằng chứng cho PhET, VisuAlgo, algorithm-visualizer; 1–2 luận văn ThS/TS | A, B, C |
| Ch.3 | **Đã viết dạng văn** đủ 8 mục, giả mã, shader, đối chiếu bài báo | 11 hình; code của 3.4 (integrator, A*) và 3.5 (sóng) để khớp với phần đã viết | A, B, C |
| Ch.4 | **Đã viết dạng văn**: cài đặt, bài minh họa, bộ thử nghiệm, khung 11 bảng, bàn luận cho cả 7 thử nghiệm | Số đo thật cho mọi bảng; công cụ đo (b), (c), (e), (g); kiểm chứng nhận xét về PixiJS ở (a) bằng profiler | Cả nhóm |
| Ch.5 | **Đã viết dạng văn** | Điền số [x] từ Ch.4 | A |
| Tài liệu | 25 mục, DOI đã đối chiếu | Luận văn ThS/TS [26]; tải PDF vào `Reference/` | B, C |

## 4. Đối chiếu nhanh với FORMAT_PRESENTATION
| Yêu cầu của thầy | Ở đâu |
|---|---|
| 1.1 Bối cảnh chung | Ch1, 1.1 |
| 1.2 Động lực: ý nghĩa khoa học **và** thực tiễn | Ch1, 1.2, hai đoạn tách riêng |
| 1.3 Input, Output; framework các công đoạn chính, chưa gắn phương pháp | Ch1, 1.3: Bảng 1.1 (Input/Output/tiêu chí), Bảng 1.2 (C1–C5 kèm ẩn số), Bảng 1.3 (bài toán con) |
| 1.4 Đóng góp | Ch1, 1.4, Bảng 1.4 (mỗi đóng góp có chỗ chứng minh) |
| Ch.2 Chọn lọc công trình liên quan | Ch2, 2.3: 15 công trình, 3 nhóm + nghiên cứu giáo dục |
| Ch.2 Quá trình phát triển | Ch2, 2.2: 5 giai đoạn + bảng tóm tắt |
| Ch.2 Bảng so sánh theo tiêu chí tự chọn | Ch2, Bảng 2.1–2.3 (mẫu của thầy, cột C1–C5) |
| Ch.2 Trả lời "người ta đã làm gì, mình muốn làm gì" | Ch2, 2.4–2.6 và đoạn kết chương |
| Ch.3 Chọn một giải pháp tiên tiến | Ch3, 3.3 Loop và Blinn 2005, trên nền 3.2 |
| Ch.3 Sơ đồ chung → nguyên lý → phương pháp → giải thuật → minh họa | Ch3: 3.1 sơ đồ; 3.2 và 3.3 đều có đủ 4 mục con nguyên lý, phương pháp, giải thuật, minh họa; 3.7 tiến trình |
| Ch.4 Tận dụng code có sẵn + tự viết | Ch4, 4.1.1, Bảng 4.1 |
| Ch.4 Mục đích, kết quả, bàn luận thử nghiệm | Ch4: 4.3 (mục đích, bộ kịch bản), 4.4 (kết quả), 4.5 (bàn luận từng thử nghiệm) |
| Ch.5 Tóm tắt kết quả, hướng cải tiến | Ch5: 5.1 kết quả kèm số, 5.2 hạn chế, 5.3 hướng phát triển |

## 5. Đối chiếu nhanh với MANUAL_FAULT
| Mục | Xử lý ở đâu |
|---|---|
| 1. Framework chung, không gắn phương pháp | Ch1, Bảng 1.2: C3 để mở ("xấp xỉ hay tính trực tiếp?", "N lệnh vẽ hay 1 lệnh?") |
| 2. Ẩn số | Ch1, Bảng 1.2 cột "Ẩn số cần tìm"; Bảng 1.3; Ch2, 2.1 |
| 3. Related works cùng tiêu chí | Ch2, Bảng 2.1–2.3 theo mẫu của thầy (Nguyên lý, Pipeline C1–C5, Hiệu suất: Data / Độ đo / Kết quả, Đóng góp, Giới hạn) |
| 4. Giai đoạn huấn luyện | Không áp dụng; ghi rõ trong Ch4, 4.3 và nêu "đáp án đúng" thay thế |
| 5. Tiến trình hoạt động | Ch3, 3.7 (một khung hình đi qua C1–C5) |
| 6. Độ đo độ chính xác và độ phức tạp | Ch4, 4.4, lấy từ tiêu chí ở Bảng 1.1 |
| 7. Tập dữ liệu: số mẫu, tiêu chí, thách thức | Ch4, 4.3, Bảng 4.4 |
| 8. Khuyết điểm related works | Ch2: cột "Giới hạn / Hướng phát triển", 2.5 (7 khuyết điểm kèm công đoạn và loại vấn đề) |
