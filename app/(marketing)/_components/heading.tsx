/**
 * A component that renders the heading section of the marketing page
 * Một component hiển thị phần heading của trang marketing
 * 
 * @component
 * 
 * @remarks
 * This component uses Convex authentication and Clerk for sign-in functionality
 * Component này sử dụng xác thực Convex và Clerk cho chức năng đăng nhập
 * 
 * @returns JSX element containing:
 * - Title and subtitle text
 * - Loading spinner while authentication state is being determined
 * - "Head to Jotion" and "See sample" buttons for authenticated users
 * - "Get Started" sign-in button and "See sample" button for unauthenticated users
 * - Hero illustration video
 * 
 * @returns JSX element bao gồm:
 * - Văn bản tiêu đề và phụ đề
 * - Hiển thị spinner trong khi đang xác định trạng thái xác thực
 * - Nút "Head to Jotion" và "See sample" cho người dùng đã xác thực
 * - Nút đăng nhập "Get Started" và nút "See sample" cho người dùng chưa xác thực
 * - Video minh họa hero
 */
"use client";

import { useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-7xl" style= {{minHeight:"90vh"}}>
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex flex-col w-full md:w-5/12 p-4">
          <div className="text-left">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold py-6">
              Your Ideas, Documents & Plans. Unified
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium pb-8">
              Jotion is the connected workspace<br/> 
              where better, faster work happens.
            </h3>
            {isLoading && (
              <div className="w-full flex">
                <Spinner size="lg" />
              </div>
            )}
            {isAuthenticated && !isLoading && (
              <div className="flex space-x-4">
                <Button asChild variant="default" style={{fontWeight:"bold"}}>
                  <Link href="/documents">
                    Head to Jotion
                  </Link>
                </Button>
                <Button asChild variant="ghost" style={{background: "#0582ff", color:"white", fontWeight:"bold"}}>
                  <Link href="/preview/j57005j5q4vh43gzy29s6m6rg5737a8b">
                    See sample
                  </Link>
                </Button>
              </div>
            )}
            {!isAuthenticated && !isLoading && (
              <div className="flex space-x-4">
                <SignInButton mode="modal">
                  <Button style={{fontWeight:"bold"}}>
                    Get Started
                  </Button>
                </SignInButton>
                <Button asChild variant="secondary" style={{background: "#0582ff", color:"white", fontWeight:"bold"}}>
                  <Link href="/preview/j57005j5q4vh43gzy29s6m6rg5737a8b">
                    See sample
                  </Link>
                </Button>
              </div>
            )}
          </div>
          </div>
          
          {/* Right Column for Video */}
          <div className="flex w-full md:w-7/12 p-4">
            <video className="w-full h-auto" autoPlay muted>
              <source src="/hero-illustration.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
       </div>
    </div>
  )
}