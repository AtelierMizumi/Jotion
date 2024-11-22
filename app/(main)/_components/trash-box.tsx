"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";

/**
 * @fileoverview This file defines the TrashBox component, which displays a list of trashed documents
 * and provides functionality to restore or permanently delete them. It includes a search input to filter
 * the displayed documents by title.
 */

/**
 * TrashBox component displays a list of trashed documents with options to restore or delete them.
 *
 * @component
 * @returns {JSX.Element} The rendered TrashBox component.
 *
 * @example
 * <TrashBox />
 *
 * @remarks
 * This component uses the following hooks:
 * - `useRouter` for navigation.
 * - `useParams` to access route parameters.
 * - `useQuery` to fetch trashed documents.
 * - `useMutation` to handle restore and delete operations.
 *
 * The component also includes a search input to filter documents by title.
 *
 * @function
 * @name TrashBox
 */
/**
 * A component that displays and manages documents in the trash.
 * Một component hiển thị và quản lý các tài liệu trong thùng rác.
 * 
 * @returns A trash box interface with search functionality and document management options
 * @returns Giao diện thùng rác với chức năng tìm kiếm và các tùy chọn quản lý tài liệu
 * 
 * Features/Tính năng:
 * - Search/filter documents by title / Tìm kiếm/lọc tài liệu theo tiêu đề
 * - Restore documents from trash / Khôi phục tài liệu từ thùng rác
 * - Permanently delete documents / Xóa vĩnh viễn tài liệu
 * - Navigate to document details / Điều hướng đến chi tiết tài liệu
 * 
 * @component
 * 
 * @example
 * ```tsx
 * <TrashBox />
 * ```
 */
export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">,
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error:" Failed to restore note."
    });
  };

  const onRemove = (
    documentId: Id<"documents">,
  ) => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error:" Failed to delete note."
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">
              {document.title}
            </span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, document._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
