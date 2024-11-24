"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
};

/**
 * Navigation bar component that displays document title, publish status, and menu.
 * Thanh điều hướng hiển thị tiêu đề tài liệu, trạng thái xuất bản và menu.
 * 
 * @component
 * 
 * @param {Object} props - Component props / Các props của component
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed
 *                                     Xác định xem thanh bên có bị thu gọn hay không
 * @param {() => void} props.onResetWidth - Callback to reset sidebar width
 *                                         Hàm callback để đặt lại độ rộng của thanh bên
 * 
 * @returns {JSX.Element | null} 
 * - Returns skeleton loading state when document is undefined
 * - Returns null when document is not found
 * - Returns navigation bar with document controls when document exists
 * 
 * - Trả về trạng thái loading khi tài liệu chưa được tải
 * - Trả về null khi không tìm thấy tài liệu
 * - Trả về thanh điều hướng với các điều khiển tài liệu khi tài liệu tồn tại
 */
/**
 * Navbar component for document navigation and actions
 * Component điều hướng và hành động cho tài liệu
 * 
 * @component
 * 
 * @param {Object} props - Component properties / Thuộc tính của component
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed / Trạng thái thu gọn của thanh bên
 * @param {() => void} props.onResetWidth - Function to reset sidebar width / Hàm để đặt lại chiều rộng thanh bên
 * 
 * @returns {JSX.Element} Navigation bar with document title and actions / Thanh điều hướng với tiêu đề và các hành động của tài liệu
 * 
 * @description
 * Renders a navigation bar that shows:
 * Hiển thị thanh điều hướng bao gồm:
 * - Document title / Tiêu đề tài liệu
 * - Publish button / Nút xuất bản
 * - Menu actions / Menu hành động
 * - Archive banner (if document is archived) / Banner lưu trữ (nếu tài liệu đã được lưu trữ)
 * 
 * Shows loading skeleton when document is loading
 * Hiển thị khung loading khi tài liệu đang tải
 */
export const Navbar = ({
  isCollapsed,
  onResetWidth
}: NavbarProps) => {
  const params = useParams();

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }

  if (document === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && (
        <Banner documentId={document._id} />
      )}
    </>
  )
}