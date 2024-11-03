"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<"documents">;
  }>;
};

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const [documentId, setDocumentId] = useState<Id<"documents"> | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params; // Unwrap the params Promise
      setDocumentId(resolvedParams.documentId);
    };
    fetchParams();
  }, [params]);

  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

  const document = useQuery(
    api.documents.getById,
    documentId ? { documentId } : "skip" // Use "skip" instead of null
  );

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    if (documentId) {
      update({
        id: documentId,
        content
      });
    }
  };

  if (documentId === null || document === undefined) {
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
