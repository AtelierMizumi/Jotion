# Jotion - Webapp viết tài liệu FullStack: Next.js 14, React, Convex, Tailwind

Web App quản lí và ghi chú tài liệu.

Tính năng chính:

- Cơ sở dữ liệu thời gian thực 🔗
- Trình soạn thảo kiểu Notion 📝
- Tính năng tạo văn bản bằng AI ✨
- Chế độ Sáng và Tối 🌓
- Tài liệu con không giới hạn 🌲
- Thùng rác & xóa mềm 🗑️
- Xác thực người dùng 🔐
- Tải lên tập tin ☁️
- Xóa tập tin 🗑️
- Thay thế tập tin 🔧
- Biểu tượng cho mỗi tài liệu (thay đổi theo thời gian thực) 🌠
- Thanh bên có thể mở rộng ➡️🔀⬅️
- Hoàn toàn tương thích với thiết bị di động 📱
- Xuất bản ghi chú lên web 🌐
- Thanh bên có thể thu gọn hoàn toàn ↕️
- Trang đích 🛬
- Ảnh bìa cho mỗi tài liệu 🖼️
- Khôi phục tập tin đã xóa 🔄📄

Thử ngay tại [đây](https://jotion-steel.vercel.app)

## Yêu cầu

### Node phiên bản 23.x.x trở lên

## Sao chép repository

```shell
git clone https://github.com/AtelierMizumi/Jotion
```

### Cài đặt các thư viện cần thiết

```shell
npm install
```

### Thiết lập file môi trườn .env

### Bạn cần tạo tài khoản Convex, Clerk và Edge-Store để lấy các API key cần thiết

### Bạn cũng cần tạo JWT Template trong Clerk và cập nhật /convex/auth.config.js theo tài liệu hướng dẫn, Convex sẽ là nơi lưu trữ và liên kết các tài liệu với người dùng.

### Bạn nên để trống CONVEX_DEPLOYMENT và NEXT_PUBLIC_CONVEX_URL vì hai trường này sẽ được tạo ra khi chạy

### Nếu muốn nút AI chạy thì bạn cần thêm OpenAPI key

```js
# Đọc .env.sample.local để biết hướng dẫn
# Điều này sẽ được sử dụng cho `npx convex dev`
CONVEX_DEPLOYMENT=
CONVEX_DEPLOY_KEY=
NEXT_PUBLIC_CONVEX_URL=

AUTH_DOMAIN=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=

OPENAI_API_KEY=
```

### Thiết lập Convex để tạo sơ đồ NoSQL

```shell
npx convex dev
```

### Khởi động ứng dụng

```shell
npm run dev
```
