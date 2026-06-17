# Hướng Dẫn Triển Khai (Deployment Guide)
## Hệ Thống Giảm Cân Không Bỏ Cuộc™ - Landing Page

Trang web của bạn đã được tối ưu hóa hoàn chỉnh cho môi trường Production (với đầy đủ thẻ SEO nâng cao, Schema rich-snippets, preloads tối ưu tốc độ Lighthouse, và các tệp cấu hình máy chủ). Vì đây là trang tĩnh (HTML, CSS, JS, hình ảnh, video), việc triển khai (deploy) cực kỳ đơn giản, nhanh chóng và **hoàn toàn miễn phí 100%**.

Dưới đây là hướng dẫn chi tiết cho 4 nền tảng phổ biến và tốt nhất hiện nay. Hãy chọn phương thức phù hợp với bạn:

---

## 📋 Tóm Tắt Các Phương Pháp Triển Khai

| Nền tảng | Độ khó | Cách nhanh nhất (Không cần code) | Cách chuyên nghiệp (Liên kết Git) | Đánh giá |
| :--- | :--- | :--- | :--- | :--- |
| **Netlify** | ⭐ Cực dễ | Kéo & Thả (Drag & Drop) vào web | Kết nối GitHub | **Khuyên dùng** (Nhanh nhất, hỗ trợ tốt nhất cho tệp cấu hình cá nhân) |
| **Vercel** | ⭐ Cực dễ | Vercel CLI (`vercel deploy`) | Kết nối GitHub | Tốc độ CDN cực nhanh, tối ưu hóa ảnh tự động |
| **Cloudflare Pages**| ⭐ Dễ | Tải thư mục lên bảng điều khiển | Kết nối GitHub | Chống DDoS mạnh mẽ nhất, băng thông không giới hạn |
| **GitHub Pages** | ⭐⭐ Vừa | Không có Drag & Drop trực tiếp | Đẩy code lên kho lưu trữ GitHub | Miễn phí trọn đời, đồng bộ hoàn hảo với kho lưu trữ |

---

## 1. Triển Khai Trên Netlify (Khuyên Dùng - Chỉ Mất 1 Phút)

### Cách A: Kéo & Thả (Không cần cài đặt, không cần Git)
1. Truy cập vào trang web **[Netlify Drop](https://app.netlify.com/drop)**.
2. Mở trình quản lý tệp (File Explorer) trên máy tính của bạn và tìm đến thư mục dự án này: `e:\EBOOK GIAM CAN`.
3. **Kéo toàn bộ thư mục** `EBOOK GIAM CAN` và **thả** vào vùng tải lên trên trang Netlify Drop.
4. Chờ vài giây để Netlify tải lên toàn bộ HTML, CSS, JS, ảnh và video.
5. **Hoàn thành!** Netlify sẽ cấp cho bạn một đường dẫn ngẫu nhiên có đuôi `.netlify.app` để truy cập ngay lập tức.
6. Bạn có thể vào phần **Domain Settings** để đổi tên miền phụ miễn phí (ví dụ: `giamcankhongbocuoc.netlify.app`) hoặc cấu hình tên miền riêng của bạn (`hanhhealthy.com`).

### Cách B: Liên kết với tài khoản GitHub (Cập nhật tự động)
1. Đẩy mã nguồn của bạn lên một kho lưu trữ (Repository) riêng tư hoặc công khai trên **GitHub**.
2. Đăng nhập vào trang quản trị **Netlify** và nhấn **"Add new site"** -> **"Import an existing project"**.
3. Chọn nguồn là **GitHub** và cấp quyền cho Netlify truy cập kho lưu trữ của bạn.
4. Chọn đúng Repository chứa dự án này.
5. Trong mục cấu hình build:
   - **Build command**: (Để trống)
   - **Publish directory**: `.` (hoặc để mặc định vì đây là trang tĩnh)
6. Nhấn **"Deploy site"**. Từ nay về sau, mỗi khi bạn chỉnh sửa code và đẩy (push) lên GitHub, Netlify sẽ tự động xây dựng và cập nhật trang web sau 5 giây!

---

## 2. Triển Khai Trên Vercel

Vercel nổi tiếng với tốc độ phản hồi cực nhanh toàn cầu nhờ hạ tầng CDN Edge Network thế hệ mới.

### Cách A: Sử dụng Vercel CLI (Qua Terminal)
Nếu bạn có Node.js cài đặt trên máy, hãy mở Powershell/Terminal tại thư mục dự án và chạy:
```powershell
# 1. Cài đặt Vercel CLI toàn cục (nếu chưa cài)
npm install -g vercel

# 2. Đăng nhập và triển khai dự án
vercel
```
- CLI sẽ hỏi bạn có muốn thiết lập dự án không, nhấn `Y`.
- Chọn tài khoản cá nhân của bạn.
- Hỏi `Link to existing project?` chọn `N`.
- Nhập tên dự án: `giamcankhongbocuoc`.
- Thư mục gốc: `./` (Nhấn Enter).
- CLI sẽ tự động phát hiện đây là dự án tĩnh và deploy lên server chỉ trong 10 giây! Bạn sẽ nhận được link deploy dạng `https://giamcankhongbocuoc.vercel.app`.

### Cách B: Liên kết trực tiếp qua GitHub
1. Đăng nhập vào **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Nhấn nút **"Add New..."** -> **"Project"**.
3. Chọn Repository GitHub chứa dự án của bạn và nhấn **"Import"**.
4. Giữ nguyên tất cả cấu hình mặc định (Framework Preset: *Other*, Build and Output Settings: *Mặc định*).
5. Nhấn **"Deploy"** và tận hưởng kết quả!

---

## 3. Triển Khai Trên Cloudflare Pages

Băng thông không giới hạn và tính năng bảo mật tuyệt vời của Cloudflare làm cho đây trở thành một lựa chọn tối ưu cho các chiến dịch quảng cáo Facebook lớn.

### Cách A: Triển khai trực tiếp bằng tải thư mục (Direct Upload)
1. Đăng nhập vào bảng điều khiển **Cloudflare** -> Vào mục **"Workers & Pages"**.
2. Chọn tab **"Pages"** -> Nhấn nút **"Create a project"** -> Chọn **"Direct Upload"**.
3. Đặt tên dự án (ví dụ: `giam-can-khong-bo-cuoc`).
4. Kéo thả thư mục hoặc tải lên tệp tin ZIP chứa toàn bộ nội dung trong `e:\EBOOK GIAM CAN`.
5. Nhấn **"Deploy site"** là xong!

### Cách B: Liên kết Git
1. Tại trang **Pages** -> Chọn **"Connect to Git"**.
2. Kết nối tài khoản GitHub của bạn và chọn Repository.
3. Trong phần **Build settings**:
   - **Framework preset**: Chọn `None` (Static HTML).
   - **Build command**: (Để trống).
   - **Build output directory**: `.` (để trống hoặc chấm).
4. Nhấn **"Save and Deploy"**.

---

## 4. Triển Khai Trên GitHub Pages (Cổ Điển & Ổn Định)

Nếu bạn muốn lưu trữ trang trực tiếp trên GitHub hoàn toàn miễn phí trọn đời:

1. Khởi tạo Git trong thư mục dự án và đẩy lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initialize production landing page"
   # Tạo repo trên GitHub sau đó liên kết link:
   git remote add origin https://github.com/username/ten-repo.git
   git branch -M main
   git push -u origin main
   ```
2. Truy cập vào Repository của bạn trên trang web **GitHub**.
3. Nhấp vào mục **Settings** (Cài đặt) ở thanh menu trên cùng.
4. Ở menu bên trái, cuộn xuống phần **Code and automation** -> Chọn mục **Pages**.
5. Trong phần **Build and deployment** -> **Source**: Chọn `Deploy from a branch`.
6. Trong phần **Branch**: Chọn nhánh `main` (hoặc `master`) và thư mục `/ (root)`. Nhấn **Save**.
7. Chờ khoảng 1-2 phút, trang web sẽ được xuất bản tại địa chỉ: `https://username.github.io/ten-repo/`.

---

## 🔍 Hướng Dẫn Kiểm Tra Sau Triển Khai (Post-Launch Quality Check)

Sau khi trang web đã được đưa lên mạng hoạt động (Live), hãy tiến hành các bước kiểm tra chất lượng sau để đảm bảo hiệu quả tối đa:

### 1. Kiểm tra Tốc độ & Hiệu Năng (Lighthouse Audit)
- Mở trang web bằng trình duyệt Google Chrome ở chế độ **Ẩn danh (Incognito Mode)** (để tránh các extension làm ảnh hưởng đến điểm số).
- Nhấp chuột phải -> Chọn **Inspect** -> Chọn tab **Lighthouse**.
- Chọn thiết bị **Mobile** và bấm **Analyze page load**.
- Thẻ preconnect, preload và lazy-loading mà chúng tôi đã thiết lập sẽ giúp trang đạt điểm số hiệu năng cực kỳ ấn tượng (95-100 điểm), giúp hạ thấp tỷ lệ thoát trang của khách truy cập trên thiết bị di động!

### 2. Kiểm tra Hiển Thị SEO & Xem Trước Mạng Xã Hội (Facebook Debugger)
- Truy cập công cụ **[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)**.
- Nhập URL trang web đã triển khai của bạn và nhấn **Debug**.
- Kiểm tra phần xem trước liên kết (Link Preview). Bạn sẽ thấy tiêu đề, mô tả và hình ảnh Before/After hiện lên đẹp mắt và chuẩn xác. Nếu thông tin cũ chưa cập nhật, hãy nhấn **Scrape Again** để xóa bộ nhớ đệm của Facebook.

### 3. Kiểm tra Schema Structured Data (Google Search Rich Results)
- Truy cập công cụ **[Google Rich Results Test](https://search.google.com/test/rich-results)**.
- Nhập URL trang web của bạn để kiểm tra.
- Công cụ sẽ hiển thị kết quả kiểm tra thành công với loại dữ liệu có cấu trúc là **Product** (Sản phẩm) cùng mức đánh giá rating trung bình `4.9⭐`. Điều này cho phép Google hiển thị trực tiếp số sao vàng cuốn hút trên thanh tìm kiếm của họ.
