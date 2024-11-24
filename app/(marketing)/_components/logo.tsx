import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"]
});

/**
 * Logo component that displays the application logo and name
 * Component hiển thị logo và tên của ứng dụng
 * 
 * @returns JSX element containing the logo and application name
 * @returns JSX element chứa logo và tên ứng dụng
 * 
 * @remarks
 * - Hidden on mobile devices (visible only on md breakpoint and above)
 * - Ẩn trên thiết bị di động (chỉ hiển thị từ breakpoint md trở lên)
 * 
 * - Includes two versions of the logo:
 *   + Light mode logo (/logo.svg)
 *   + Dark mode logo (/logo-dark.svg)
 * - Bao gồm hai phiên bản của logo:
 *   + Logo cho chế độ sáng (/logo.svg)
 *   + Logo cho chế độ tối (/logo-dark.svg)
 * 
 * - Displays "Jotion" text with custom font styling
 * - Hiển thị chữ "Jotion" với kiểu font tùy chỉnh
 */
export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo.svg"
        height="40"
        width="40"
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        height="40"
        width="40"
        alt="Logo"
        className="hidden dark:block"
      />
      <p className={cn("font-semibold", font.className)}>
        Jotion
      </p>
    </div>
  )
}