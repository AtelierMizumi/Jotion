"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { api } from "@/convex/_generated/api";

/**
 * A component that implements a search command dialog for documents.
 * Một component thực hiện hộp thoại lệnh tìm kiếm cho tài liệu.
 * 
 * Features/Tính năng:
 * - Keyboard shortcut (Ctrl/Cmd + K) to open search/Phím tắt (Ctrl/Cmd + K) để mở tìm kiếm
 * - Displays user's documents with icons/Hiển thị tài liệu của người dùng với biểu tượng
 * - Navigates to selected document/Điều hướng đến tài liệu được chọn
 * 
 * @component
 * @example
 * ```tsx
 * <SearchCommand />
 * ```
 * 
 * @remarks
 * - Uses CommandDialog from a UI component library/Sử dụng CommandDialog từ thư viện UI
 * - Integrates with user authentication/Tích hợp với xác thực người dùng
 * - Implements client-side routing/Thực hiện định tuyến phía client
 * - Handles mounted state to prevent hydration issues/Xử lý trạng thái mounted để ngăn vấn đề hydration
 * 
 * @returns A search command dialog component or null if not mounted
 * @returns Một component hộp thoại lệnh tìm kiếm hoặc null nếu chưa được mounted
 */
export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearch);
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    }

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Search ${user?.fullName}'s Jotion...`}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(document._id)}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">
                  {document.icon}
                </p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>
                {document.title}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}