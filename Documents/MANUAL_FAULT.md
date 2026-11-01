# Các Yêu Cầu Và Lỗi Thường Gặp Trong Trình Bày Bài Toán Nghiên Cứu

**1. Khung hệ thống (Framework) trong phát biểu bài toán**
*   **Yêu cầu:** Cần xác định framework chung cho hệ thống, gồm các công đoạn chính nào (chưa đi vào phương pháp cụ thể).
*   **Lỗi thường gặp:** Xác định luôn phương pháp cụ thể trong framework. Làm như vậy sẽ không thấy được nhiều giải pháp có thể có trong các công đoạn, hạn chế sự sáng tạo.

**2. Xác định ẩn số trong phát biểu bài toán**
*   **Yêu cầu:** Cần xác định được các ẩn số phải tìm trong các công đoạn.
*   **Lỗi thường gặp:** Không xác định được các ẩn số phải tìm trong các công đoạn. Làm như vậy sẽ không hiểu được các giải pháp đã được công bố.

**3. Trình bày các nghiên cứu liên quan (Related Works)**
*   **Yêu cầu:** Cần nêu được các giải pháp SOTA (State-of-the-Art) và so sánh chúng với cùng các cột tiêu chí theo các công đoạn đã nêu trong phát biểu bài toán.
*   **Lỗi thường gặp:** 
    *   Mỗi giải pháp được trình bày với dàn bài khác nhau. Làm như vậy sẽ rất khó so sánh giải pháp này với giải pháp khác.
    *   Không trình bày các giải pháp ứng với các công đoạn ở mục phát biểu bài toán. Làm như vậy sẽ khó nhận biết các giải pháp đã đóng góp thế nào trong các công đoạn.

**4. Giai đoạn huấn luyện (Training Phase)**
*   **Yêu cầu:** Cần nêu rõ input, output xác thực (groundtruth) là gì, được đánh nhãn như thế nào và loss function là gì nhằm tối ưu các thông số của mạng.
*   **Lỗi thường gặp:** Không đả động gì đến output xác thực, và được dùng như thế nào trong giai đoạn học.

**5. Tiến trình hoạt động (Workflow)**
*   **Yêu cầu:** Trong giai đoạn học và giai đoạn kiểm thử, cần trình bày rõ tiến trình hoạt động của hệ thống để ra được kết quả mong muốn.
*   **Lỗi thường gặp:** Không cho thấy được hệ thống hoạt động như thế nào để ra được kết quả.

**6. Đánh giá hiệu suất (Performance Evaluation)**
*   **Yêu cầu:** Cần xác định độ đo đánh giá về độ chính xác và cả độ phức tạp tính toán.
*   **Lỗi thường gặp:** 
    *   Không hiểu về độ đo đánh giá, độ phức tạp tính toán.
    *   Không hiểu loss function có liên quan gì đến độ đo đánh giá. Làm như vậy có thể dẫn đến tình trạng học một đằng, đánh giá một nẻo.

**7. Mô tả tập dữ liệu (Dataset Description)**
*   **Yêu cầu:** Cần chú ý nhiều hơn trong mô tả tập dữ liệu học, tập dữ liệu kiểm thử, công tác đánh nhãn như thế nào. Số lượng mẫu, tính đa dạng của mẫu, tiêu chí xây dựng tập mẫu.
*   **Lỗi thường gặp:** 
    *   Không cho thấy tập dữ liệu chứa các thách thức gì. Nếu tập dữ liệu không chứa các thách thức của bài toán thì dù hệ thống có đạt performance rất cao cũng không thể khẳng định đây là giải pháp tốt được.
    *   Không hiểu được cách đánh nhãn dữ liệu như thế nào.

**8. Xác định khuyết điểm trong Related Works**
*   **Yêu cầu:** Cần nhìn ra các khuyết điểm còn tồn đọng cần giải quyết trong các công đoạn.
*   **Lỗi thường gặp:** 
    *   Chưa nhìn ra được cần cải tiến nội dung gì trong các công đoạn.
    *   Chưa xác định được cần cải tiến độ chính xác hay độ phức tạp tính toán.