# Ứng Dụng Flashcard - PWA

## Tính Năng

- **Chế độ kiểm tra** với thẻ ngẫu nhiên và tính điểm
- **Thiết kế responsive** - Tương thích mọi thiết bị
- **Lưu trữ cục bộ** - Dữ liệu được lưu trong trình duyệt
- **PWA Support** - Hoạt động offline
- **Service Worker** - Tự động cache các file JS, CSS và trang chính để tăng tốc độ tải

## Cài Đặt & Chạy

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy development server:**
   ```bash
   npm run dev
   ```

3. **Build production:**
   ```bash
   npm run build
   ```

## Cách Sử Dụng

### Thêm Thẻ Mới
1. Nhấn nút "Thêm thẻ mới"
2. Nhập câu hỏi/từ vựng ở mặt trước
3. Nhập câu trả lời/nghĩa ở mặt sau
4. Nhấn "Thêm" để lưu

### Chế độ Học
- Nhấn vào thẻ để lật và xem đáp án
- Sử dụng nút Biết/Đang học để phân loại từ vựng
- Sử dụng nút edit/delete để quản lý thẻ

### Chế độ Quiz (Trắc nghiệm)
1. Nhấn "Trắc nghiệm" (cần ít nhất 2 thẻ)
2. Câu hỏi được xáo trộn ngẫu nhiên
3. Chọn đáp án đúng trong 4 phương án
4. Xem điểm số cuối cùng


## Công Nghệ Sử Dụng

- **React 19** - Thư viện UI
- **Vite** - Build tool
- **Tailwind CSS** - CSS framework
- **Service Worker** - Hỗ trợ offline
