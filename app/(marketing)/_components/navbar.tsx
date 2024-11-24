"use client";

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";

/**
 * Navbar component for the application's marketing page
 * @component Thanh điều hướng cho trang marketing của ứng dụng
 * 
 * @description
 * English:
 * Renders a navigation bar that includes:
 * - Logo
 * - Authentication status-based content:
 *   - Loading spinner while authenticating
 *   - Login button for unauthenticated users
 *   - "Enter Jotion" link and UserButton for authenticated users
 * - Dark/Light mode toggle
 * - Applies styling based on scroll position
 * 
 * Tiếng Việt:
 * Hiển thị thanh điều hướng bao gồm:
 * - Logo
 * - Nội dung dựa trên trạng thái xác thực:
 *   - Hiển thị spinner khi đang xác thực
 *   - Nút đăng nhập cho người dùng chưa xác thực
 *   - Link "Enter Jotion" và UserButton cho người dùng đã xác thực
 * - Nút chuyển đổi chế độ sáng/tối
 * - Áp dụng kiểu dáng dựa trên vị trí cuộn
 * 
 * @returns {JSX.Element} A navigation bar component
 * @returns {JSX.Element} Thành phần thanh điều hướng
 */
export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div className={cn(
      "z-32 bg-background dark:bg-[#1F1F1F] fixed flex items-center w-full p-4",
      scrolled && "border-b shadow-sm"
    )}>
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && (
          <Spinner />
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">
                Enter Jotion
              </Link>
            </Button>
            <UserButton />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  )
}