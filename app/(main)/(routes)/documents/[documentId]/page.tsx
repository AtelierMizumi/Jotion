"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

/**
 * A component that displays and manages a document page with an editor.
 * Một component hiển thị và quản lý trang tài liệu với trình soạn thảo.
 *
 * @param {Object} props - Component props | Props của component
 * @param {Object} props.params - URL parameters | Tham số URL
 * @param {string} props.params.documentId - The ID of the document to display | ID của tài liệu cần hiển thị
 *
 * @returns {JSX.Element} A document page with editor, cover image, and toolbar
 *                       Một trang tài liệu với trình soạn thảo, ảnh bìa và thanh công cụ
 *
 * @description
 * This component handles:
 * - Dynamic loading of the editor | Tải động trình soạn thảo
 * - Document data fetching | Lấy dữ liệu tài liệu
 * - Content updates | Cập nhật nội dung
 * - Loading states | Trạng thái đang tải
 * - Not found states | Trạng thái không tìm thấy
 *
 * @example
 * ```tsx
 * <DocumentIdPage params={{ documentId: "123" }} />
 * ```
 */
const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { documentId } = params; // Directly destructure documentId from params
  const [id, setId] = useState<Id<"documents"> | null>(documentId || null);

  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

  const document = useQuery(
    api.documents.getById,
    id ? { documentId: id } : "skip" // Use "skip" instead of null
  );

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    if (id) {
      update({
        id,
        content
      });
    }
  };

  if (id === null || document === undefined) {
    // Render loading skeleton while params or document data are still loading
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
