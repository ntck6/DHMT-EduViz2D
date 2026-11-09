# DHMT – EduViz2D

Đồ án môn Đồ họa máy tính: xây dựng ứng dụng 2D (tĩnh và động) dựa vào HTML5 + WebGL hỗ trợ giáo dục.

| Thư mục | Nội dung |
|---|---|
| `Documents/` | Yêu cầu của thầy, kế hoạch (`PLAN_PHAN_CONG.md`), dàn ý báo cáo (`DAN_Y_BAO_CAO.md`) |
| `Source code/` | Web app minh họa; hướng dẫn code ở `Source code/README.md` |

## Bắt đầu (cho thành viên mới)
1. Cài **Git**, **VS Code** + tiện ích **Live Server**. Cài thêm **Node.js** nếu muốn chạy test.
2. Clone repo:

```bash
git clone https://github.com/ntck6/DHMT-EduViz2D.git
```

3. Mở thư mục `Source code` bằng VS Code → nhấp phải `index.html` → *Open with Live Server*.
4. Đọc `Source code/README.md`, rồi mở trang với `?dev#template` để xem bài mẫu.
5. Tìm file bài của mình (ghi trong `Documents/PLAN_PHAN_CONG.md`, mục Phân công): phần đầu file có danh sách việc cần làm.

## Quy trình làm việc với Git
Mỗi bài làm trên một nhánh riêng, không commit thẳng vào `main`.

1. Lấy bản mới nhất và tạo nhánh:

```bash
git switch main
```

```bash
git pull
```

```bash
git switch -c ten-bai-hoc
```

2. Code, chạy thử, chạy `node --test` trong thư mục `Source code`.
3. Commit và đẩy nhánh lên GitHub:

```bash
git add -A
```

```bash
git commit -m "Mô tả ngắn việc đã làm"
```

```bash
git push -u origin ten-bai-hoc
```

4. Trên GitHub, mở **Pull Request** vào `main` và nhờ A review. Sau khi gộp, quay lại bước 1 cho việc tiếp theo.

**Tránh xung đột:** mỗi người chỉ sửa file bài của mình. Cần sửa file dùng chung (`js/core/`, `js/main.js`, `js/lessons.js`, `css/`) thì báo nhóm trước. Riêng dòng `status` của bài mình trong `js/lessons.js` thì tự sửa được.
