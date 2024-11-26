"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

/**
 * DocumentsPage Component
 * 
 * @description A component that renders the empty state documents page with options to create new notes
 * Thành phần hiển thị trang tài liệu trống với các tùy chọn để tạo ghi chú mới
 * 
 * @component
 * 
 * @uses useRouter - For navigation between pages | Dùng để điều hướng giữa các trang
 * @uses useUser - To get current user information | Để lấy thông tin người dùng hiện tại
 * @uses useMutation - For creating new documents | Để tạo tài liệu mới
 * 
 * @returns A centered layout with:
 * - Empty state images (light/dark mode)
 * - Welcome message with user's first name
 * - Create note button
 * 
 * Trả về một bố cục căn giữa với:
 * - Hình ảnh trạng thái trống (chế độ sáng/tối)
 * - Thông điệp chào mừng với tên của người dùng
 * - Nút tạo ghi chú
 */
const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" })
      .then((documentId) => router.push(`/documents/${documentId}`))

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  return ( 
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Jotion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
   );
}
 
export default DocumentsPage;