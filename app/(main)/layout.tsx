"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

import { Spinner } from "@/components/spinner";
import { SearchCommand } from "@/components/search-command";

import { Navigation } from "./_components/navigation";

/**
 * MainLayout component - A layout wrapper for the main application content
 * Component bố cục chính - Một wrapper cho nội dung chính của ứng dụng
 * 
 * @component
 * @param {Object} props - Component properties / Các thuộc tính của component
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout
 *                                          Các component con được render trong bố cục
 * 
 * @returns {JSX.Element} A layout structure with:
 *                        Một cấu trúc bố cục bao gồm:
 *                        - Loading spinner while authenticating / Hiển thị spinner khi đang xác thực
 *                        - Redirect to home if not authenticated / Chuyển hướng về trang chủ nếu chưa xác thực
 *                        - Navigation sidebar / Thanh điều hướng
 *                        - Main content area with search command / Khu vực nội dung chính với thanh tìm kiếm
 * 
 * @requires useConvexAuth - Authentication hook / Hook xác thực
 * @requires Navigation - Navigation component / Component điều hướng
 * @requires SearchCommand - Search component / Component tìm kiếm
 * @requires Spinner - Loading spinner component / Component hiển thị trạng thái loading
 */
const MainLayout = ({
  children
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return ( 
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
   );
}
 
export default MainLayout;