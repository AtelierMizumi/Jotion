"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Error component that displays when something goes wrong in the application
 * Component lỗi được hiển thị khi có sự cố xảy ra trong ứng dụng
 * 
 * @component
 * 
 * @returns {JSX.Element} Returns an error page with:
 * - Error images (light/dark mode)
 * - Error message
 * - "Go back" button linking to documents page
 * 
 * @trả_về {JSX.Element} Trả về trang lỗi với:
 * - Hình ảnh lỗi (chế độ sáng/tối)
 * - Thông báo lỗi
 * - Nút "Quay lại" liên kết đến trang tài liệu
 */
const Error = () => {
  return ( 
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/error.png"
        height="300"
        width="300"
        alt="Error"
        className="dark:hidden"
      />
      <Image
        src="/error-dark.png"
        height="300"
        width="300"
        alt="Error"
        className="hidden dark:block"
      />
      <h2 className="text-xl font-medium">
        Something went wrong!
      </h2>
      <Button asChild>
        <Link href="/documents">
          Go back
        </Link>
      </Button>
    </div>
  );
}
 
export default Error;