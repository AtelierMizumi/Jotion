"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Item } from "./item";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

/**
 * Component hiển thị danh sách tài liệu dưới dạng cây thư mục
 * 
 * @component
 * @param {Object} props - Props của component
 * @param {string} [props.parentDocumentId] - ID của tài liệu cha
 * @param {number} [props.level=0] - Cấp độ của tài liệu trong cây (mặc định là 0)
 * 
 * @returns {JSX.Element} Component render danh sách tài liệu
 * 
 * @example
 * ```tsx
 * <DocumentList 
 *   parentDocumentId="123"
 *   level={1}
 * />
 * ```
 * 
 * @description
 * Component này:
 * - Hiển thị danh sách tài liệu dưới dạng cây thư mục có thể mở rộng
 * - Quản lý trạng thái mở rộng của từng tài liệu
 * - Hiển thị skeleton loading khi đang tải dữ liệu 
 * - Cho phép điều hướng khi click vào tài liệu
 * - Hỗ trợ hiển thị icon và trạng thái active của tài liệu
 * - Có thể lồng nhau với các cấp độ khác nhau
 */
export const DocumentList = ({
  parentDocumentId,
  level = 0
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }));
  };

  // Gọi hàm getSidebar trong cơ sở dữ liệu để lấy danh sách tài liệu con
  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${(level * 12) + 25}px` : undefined
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>

{/* What is React Map?
The standard JavaScript function is a map, which is a kind of data collection. 
Pairs of data are saved in this place. A distinct key is mapped to each value kept in the map. 
Because a duplicate pair is not permitted in a map, quick data searching is possible. */}
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList
              parentDocumentId={document._id}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};
