"use client";

import { 
  ChevronDown, 
  ChevronRight, 
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash
} from "lucide-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
};

/**
 * @fileoverview This file defines the `Item` component, which represents an item in a list with various interactive features such as expanding, creating, and archiving documents.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.id - The unique identifier for the item.
 * @param {string} props.label - The label text for the item.
 * @param {function} props.onClick - The function to call when the item is clicked.
 * @param {React.ComponentType} props.icon - The icon component to display for the item.
 * @param {boolean} props.active - Indicates if the item is active.
 * @param {React.ReactNode} props.documentIcon - The document icon to display for the item.
 * @param {boolean} props.isSearch - Indicates if the item is part of a search result.
 * @param {number} [props.level=0] - The nesting level of the item.
 * @param {function} props.onExpand - The function to call when the item is expanded.
 * @param {boolean} props.expanded - Indicates if the item is expanded.
 * 
 * @returns {JSX.Element} The rendered `Item` component.
 * 
 * @description
 * The `Item` component is a versatile list item that supports various interactions such as expanding/collapsing, creating new items, and archiving existing items. It uses hooks for user data, routing, and mutations for creating and archiving documents. The component also includes UI elements like icons, dropdown menus, and keyboard shortcuts.
 */
/**
 * Component Item - Hiển thị một mục trong danh sách tài liệu
 * @param {Object} props - Props của component
 * @param {string} props.id - ID của tài liệu
 * @param {string} props.label - Nhãn hiển thị của mục
 * @param {Function} props.onClick - Hàm xử lý khi click vào mục
 * @param {ComponentType} props.icon - Component icon mặc định
 * @param {boolean} props.active - Trạng thái active của mục
 * @param {ReactNode} props.documentIcon - Icon tùy chỉnh cho tài liệu
 * @param {boolean} props.isSearch - Xác định nếu đây là mục tìm kiếm
 * @param {number} props.level - Cấp độ thụt lề của mục (mặc định: 0)
 * @param {Function} props.onExpand - Hàm xử lý khi mở rộng mục
 * @param {boolean} props.expanded - Trạng thái mở rộng của mục
 * @returns {JSX.Element} Item component
 * 
 * @description
 * Component này hiển thị một mục trong danh sách tài liệu với các chức năng:
 * - Hiển thị icon và nhãn
 * - Thụt lề theo cấp độ
 * - Tạo tài liệu mới (con)
 * - Xóa tài liệu
 * - Mở rộng/thu gọn danh sách con
 * - Hiển thị phím tắt tìm kiếm (nếu là mục tìm kiếm)
 * - Menu thả xuống với thông tin bổ sung
 */
export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const onArchive = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id })
      .then(() => router.push("/documents"))

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note."
    });
  };

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onCreate = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;
    const promise = create({ title: "Untitled", parentDocument: id })
      .then((documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/documents/${documentId}`);
      });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ 
        paddingLeft: level ? `${(level * 12) + 12}px` : "12px"
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon
            className="h-4 w-4 shrink-0 text-muted-foreground/50"
          />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">
          {documentIcon}
        </div>
      ) : (
        <Icon 
          className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"
        />
      )}
      <span className="truncate">
        {label}
      </span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              asChild
            >
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}