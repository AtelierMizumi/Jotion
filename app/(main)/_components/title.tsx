"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleProps {
  initialData: Doc<"documents">;
};

/**
 * A component that renders an editable title with an optional icon
 * Một component hiển thị tiêu đề có thể chỉnh sửa với biểu tượng tùy chọn
 * 
 * @param {Object} props - Component props / Các props của component
 * @param {Object} props.initialData - Initial data for the title / Dữ liệu ban đầu cho tiêu đề
 * @param {string} props.initialData._id - Document ID / ID của tài liệu
 * @param {string} props.initialData.title - Initial title text / Văn bản tiêu đề ban đầu
 * @param {string} props.initialData.icon - Optional icon for the title / Biểu tượng tùy chọn cho tiêu đề
 * 
 * @returns {JSX.Element} A title component that can be edited inline
 *                       Một component tiêu đề có thể chỉnh sửa trực tiếp
 *
 * @example
 * <Title initialData={{
 *   _id: "123",
 *   title: "My Document",
 *   icon: "📄"
 * }} />
 */
export const Title = ({
  initialData
}: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useMutation(api.documents.update);

  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event.target.value);

    const timeoutId = setTimeout(() => {
      update({
        id: initialData._id,
        title: event.target.value || "Untitled"
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">
            {initialData?.title}
          </span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="h-9 w-20 rounded-md" />
  );
};
