"use client";

import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState, useCallback } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";

import { UserItem } from "./user-item";
import { Item } from "./item";
import { DocumentList } from "./document-list";
import { TrashBox } from "./trash-box";
import { Navbar } from "./navbar";

/**
 * Navigation component for the application's main layout
 * Component điều hướng cho bố cục chính của ứng dụng
 * 
 * @component
 * 
 * Features/Tính năng:
 * - Resizable sidebar/Thanh bên có thể điều chỉnh kích thước
 * - Collapsible navigation/Điều hướng có thể thu gọn
 * - Responsive design for mobile/Thiết kế đáp ứng cho thiết bị di động
 * - Document management interface/Giao diện quản lý tài liệu
 * 
 * States/Trạng thái:
 * @state {boolean} isResetting - Controls transition animation/Điều khiển hoạt ảnh chuyển đổi
 * @state {boolean} isCollapsed - Controls sidebar collapse state/Điều khiển trạng thái thu gọn của thanh bên
 * 
 * Refs/Tham chiếu:
 * @ref {ElementRef<"aside">} sidebarRef - Reference to sidebar element/Tham chiếu đến phần tử thanh bên
 * @ref {ElementRef<"div">} navbarRef - Reference to navbar element/Tham chiếu đến phần tử thanh điều hướng
 * @ref {boolean} isResizingRef - Tracks resize operation state/Theo dõi trạng thái thao tác điều chỉnh kích thước
 * 
 * Callbacks/Hàm gọi lại:
 * - resetWidth(): Resets sidebar to default width/Đặt lại chiều rộng thanh bên về mặc định
 * - collapse(): Collapses the sidebar/Thu gọn thanh bên
 * - handleCreate(): Creates new document/Tạo tài liệu mới
 * - handleMouseDown(): Initiates resize operation/Khởi tạo thao tác điều chỉnh kích thước
 * - handleMouseMove(): Handles resize dragging/Xử lý kéo điều chỉnh kích thước
 * - handleMouseUp(): Finalizes resize operation/Hoàn tất thao tác điều chỉnh kích thước
 * 
 * @returns {JSX.Element} Navigation component with sidebar and navbar/Component điều hướng với thanh bên và thanh điều hướng
 */
export const Navigation = () => {
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const create = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const resetWidth = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
  
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : "240px"
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  }, [isMobile]);  

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile, resetWidth]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  }

  const handleCreate = () => {
    const promise = create({ title: "Untitled" })
      .then((documentId) => router.push(`/documents/${documentId}`))

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[1000]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item
            label="Search"
            icon={Search}
            isSearch
            onClick={search.onOpen}
          />
          <Item
            label="Settings"
            icon={Settings}
            onClick={settings.onOpen}
          />
          <Item
            onClick={handleCreate}
            label="New page"
            icon={PlusCircle}
          />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item
            onClick={handleCreate}
            icon={Plus}
            label="Add a page"
          />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[2000] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
          />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
          </nav>
        )}
      </div>
    </>
  )
}