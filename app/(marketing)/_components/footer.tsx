import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Github, Facebook } from "lucide-react"

/**
 * Footer component containing social media links and a decorative image.
 * Component chân trang chứa các liên kết mạng xã hội và hình ảnh trang trí.
 * 
 * @component
 * @returns {JSX.Element} A footer with social media buttons and an image
 * @returns {JSX.Element} Phần chân trang với các nút mạng xã hội và hình ảnh
 * 
 * @example
 * ```tsx
 * <Footer />
 * ```
 * 
 * Features / Tính năng:
 * - Social media buttons (Github, Facebook) / Các nút mạng xã hội (Github, Facebook)
 * - Decorative image on the right / Hình ảnh trang trí ở bên phải
 * - Dark mode support / Hỗ trợ chế độ tối
 * - Responsive layout / Bố cục tương thích
 */
export const Footer = () => {
  return (
    <div className="flex items-center w-full p-2 bg-background z-32 dark:bg-[#1F1F1F] relative">
      <div className="flex justify-start items-center gap-x-2 w-full text-muted-foreground"> {/* Ensure buttons are on the left */}
        <a href="https://github.com/AtelierMizumi/Jotion"> 
          <Button variant="ghost" size="icon">
            <Github></Github>
          </Button>
        </a>
        <a href="https://www.facebook.com/2f5436fa4fvbc9/">
        <Button variant="ghost" size="icon">
          
          <Facebook></Facebook>
        </Button>
        </a>
      </div>  
      <Image
        src="/shao-sitting.png"
        loading="lazy"
        width="260"
        height="200"
        alt="Shaolin having a rest"
        className="object-contain absolute bottom-0 right-0" // Add scaling properties
      />
    </div>

  )
}