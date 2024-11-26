"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { use } from "react";
import { notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<"documents">;
  }>;
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const documentId = resolvedParams.documentId;

  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

  const document = useQuery(api.documents.getById, {
    documentId: documentId as Id<"documents">
  });

  const update = useMutation(api.documents.update);

  // Handle loading state
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

  // Handle not found case
  if (document === null) {
    notFound();
  }

  const onChange = (content: string) => {
    if (documentId) {
      update({
        id: documentId,
        content
      }).catch(console.error);
    }
  };

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
};

export default DocumentIdPage;