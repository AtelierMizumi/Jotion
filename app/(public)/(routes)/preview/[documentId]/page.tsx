"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
};

/**
 * Renders a preview page for a document with the specified ID.
 * Hiển thị trang xem trước cho một tài liệu với ID được chỉ định.
 * 
 * @param {Object} props - Component props / Props của component
 * @param {Object} props.params - Route parameters / Tham số đường dẫn
 * @param {string} props.params.documentId - ID of the document to display / ID của tài liệu cần hiển thị
 * 
 * @returns {JSX.Element} A page component that displays:
 * - Loading skeleton when document is undefined / Hiển thị skeleton loading khi tài liệu chưa được tải
 * - "Not found" message when document is null / Hiển thị thông báo "Not found" khi không tìm thấy tài liệu
 * - Document preview with cover image, toolbar and non-editable content when document is loaded
 *   / Xem trước tài liệu với ảnh bìa, thanh công cụ và nội dung không thể chỉnh sửa khi tài liệu đã được tải
 * 
 * @example
 * <DocumentIdPage params={{ documentId: "123" }} />
 */
const DocumentIdPage = ({
  params
}: DocumentIdPageProps) => {
  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }) ,[]);

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  });

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content
    });
  };

  if (document === undefined) {
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
    return <div>Not found</div>
  }

  return ( 
    <div className="pb-40 dark:bg-[#1F1F1F]">
      <Cover preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview initialData={document} />
        <Editor
          editable={false}
          onChange={onChange}
          initialContent={document.content}
        />
      </div>
    </div>
  );
}
 
export default DocumentIdPage;
