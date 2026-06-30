# KẾ HOẠCH GIAO DIỆN TRANG QUẢN TRỊ (ADMIN DASHBOARD UI PLAN)

## 1. BỐ CỤC CHUNG (GENERAL LAYOUT)

Giao diện được thiết kế theo dạng Admin Dashboard tiêu chuẩn bao gồm 3 phần chính:
* **Sidebar (Trái):** Chứa thanh Menu điều hướng chính. Cố định khi cuộn trang.
* **Header (Trên):** Chứa thanh tìm kiếm toàn cục, thông báo, và Avatar/Thông tin tài khoản Admin (Đăng xuất, Đổi mật khẩu).
* **Main Content (Giữa/Phải):** Khu vực hiển thị nội dung chi tiết của từng mục được chọn từ Menu.

### 1.1 Thành phần chuẩn cho mọi trang quản lý
Để đảm bảo tính nhất quán, **mọi trang quản lý** đều sẽ có cấu trúc UI như sau:
1.  **Tiêu đề trang:** Tên mục đang quản lý (VD: Danh sách Giáo viên).
2.  **Top Action Bar:**
    * Thanh tìm kiếm (theo tên, ID...).
    * Bộ lọc (Filter theo trạng thái, ngày tạo...).
    * **Nút "Thêm mới" (+ Add):** Mở ra một Modal/Popup form để điền thông tin.
3.  **Bảng dữ liệu (Data Table):** Hiển thị danh sách các bản ghi.
4.  **Cột "Hành động" (Action Column) ở mỗi dòng:**
    * **Nút "Sửa" (Edit - icon ✏️):** Mở Modal chứa thông tin cũ để cập nhật.
    * **Nút "Xóa" (Delete - icon 🗑️):** Mở Popup xác nhận (Confirm) trước khi xóa.
5.  **Phân trang (Pagination):** Ở dưới cùng của bảng.

---

## 2. CHI TIẾT MENU VÀ CÁC TRANG

### 2.1 Quản lý User (Người dùng)
*Menu này sẽ là dạng Dropdown (xổ xuống) chứa 2 menu con.*

* **Quản lý giáo viên:**
    * **Bảng dữ liệu gồm:** ID, Ảnh đại diện, Họ và tên, Email, Số điện thoại, Trạng thái (Hoạt động/Khóa), Hành động.
    * **Chức năng:** Thêm giáo viên, Sửa thông tin giáo viên, Xóa giáo viên.
* **Quản lý học sinh:**
    * **Bảng dữ liệu gồm:** ID, Ảnh đại diện, Họ và tên, Email, Lớp/Cấp độ, Điểm/Thành tích, Trạng thái, Hành động.
    * **Chức năng:** Thêm học sinh, Sửa thông tin học sinh, Xóa học sinh.

### 2.2 Quản lý Topic (Chủ điểm bài học)
* **Bảng dữ liệu gồm:** ID, Tên Topic, Mô tả ngắn, Số lượng bài học, Hình ảnh cover, Trạng thái, Hành động.
* **Chức năng:** * **Thêm:** Modal nhập tên topic, upload ảnh, mô tả.
    * **Sửa:** Cập nhật thông tin topic.
    * **Xóa:** Cảnh báo nếu topic đang chứa dữ liệu.

### 2.3 Quản lý Từ vựng
* **Bảng dữ liệu gồm:** ID, Từ vựng, Loại từ (Noun, Verb...), Nghĩa tiếng Việt, Phiên âm, Audio (Nút nghe thử), Hành động.
* **Chức năng:**
    * **Thêm:** Form nhập từ, nghĩa, loại từ, upload file audio/hình ảnh minh họa.
    * **Sửa:** Chỉnh sửa chi tiết từ vựng.
    * **Xóa:** Xóa từ vựng khỏi hệ thống.

### 2.4 Quản lý Chủ đề 
*Menu này sẽ là dạng Dropdown (xổ xuống) chứa 2 menu con.*

* **Quản lý chủ đề (Theme/Category):**
    * **Bảng dữ liệu gồm:** ID, Tên chủ đề (VD: Động vật, Môi trường...), Mô tả, Hình ảnh đại diện, Hành động.
    * **Chức năng:** Thêm, Sửa, Xóa chủ đề.
* **Quản lý thư viện từ (Vocabulary Library):**
    * **Bảng dữ liệu gồm:** ID, Tên thư viện từ, Thuộc chủ đề nào, Tổng số từ vựng, Hành động.
    * **Chức năng:** * **Thêm:** Tạo thư viện mới và map/chọn các từ vựng từ hệ thống vào thư viện.
        * **Sửa:** Thêm/bớt từ vựng trong thư viện, đổi tên thư viện.
        * **Xóa:** Xóa thư viện (không làm mất từ vựng gốc ở mục 2.3).

### 2.5 Quản lý Mini Game
* **Bảng dữ liệu gồm:** ID, Tên Mini Game, Thể loại (Flashcard, Điền từ, Nối từ...), Link/Mã nhúng, Trạng thái (Bật/Tắt), Hành động.
* **Chức năng:**
    * **Thêm:** Khai báo game mới, cấu hình luật chơi hoặc gắn bộ câu hỏi/từ vựng vào game.
    * **Sửa:** Thay đổi cấu hình, cập nhật bộ từ vựng cho game.
    * **Xóa:** Xóa mini game khỏi hệ thống.

### 2.6 Quản lý Phân quyền
* **Bảng dữ liệu gồm:** ID, Tên vai trò (VD: Super Admin, Content Editor, Teacher...), Mô tả vai trò, Hành động.
* **Chức năng:**
    * **Thêm:** Tạo Role mới. Giao diện thêm sẽ có một danh sách các Checkbox để tick chọn quyền (Ví dụ: [x] Thêm giáo viên, [x] Xóa từ vựng, [ ] Xóa mini game).
    * **Sửa:** Cập nhật lại các Checkbox quyền hạn.
    * **Xóa:** Xóa vai trò (Hệ thống sẽ yêu cầu chuyển người dùng thuộc vai trò này sang vai trò khác trước khi xóa).

---

## 3. LƯU Ý VỀ TRẢI NGHIỆM NGƯỜI DÙNG (UX)

* **Xác nhận khi XÓA:** Mọi hành động Xóa (Delete) đều phải hiển thị một Modal cảnh báo (SweetAlert hoặc Dialog): *"Bạn có chắc chắn muốn xóa [Tên đối tượng] không? Hành động này không thể hoàn tác."*
* **Thông báo (Toast Notification):** Sau khi thực hiện Thêm/Sửa/Xóa thành công hoặc thất bại, góc trên cùng bên phải màn hình sẽ hiện popup thông báo nhỏ màu xanh (Thành công) hoặc đỏ (Thất bại) trong 3 giây.
* **Trạng thái (Status):** Dùng Toggle Switch (Công tắc gạt) ngay trên bảng dữ liệu để bật/tắt trạng thái (Ví dụ: Khóa/Mở khóa tài khoản học sinh) một cách nhanh chóng mà không cần vào form Sửa.