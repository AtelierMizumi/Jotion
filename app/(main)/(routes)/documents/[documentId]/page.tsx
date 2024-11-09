"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { Suspense, useMemo, useState } from "react";

import { CollaborativeEditorProps } from "@/types";
import { Providers } from "@/components/providers/liveblocks-provider";
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

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { documentId } = params;
  const [id] = useState<Id<"documents"> | null>(documentId || null);

  const CollaborativeEditor = useMemo(
    () =>
      dynamic<CollaborativeEditorProps>(
        () => import("@/components/CollaborativeEditor"),
        { ssr: false },
      ),
    [],
  );

  const document = useQuery(
    api.documents.getById,
    id ? { documentId: id } : "skip",
  );

  const update = useMutation(api.documents.update);

  const onChange = useMemo(() => {
    let timeout: NodeJS.Timeout | null = null;
    return (content: string) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        if (id) {
          update({
            id,
            content,
          });
        }
      }, 1500);
    };
  }, [id, update]);

  if (id === null || document === undefined) {
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
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <CollaborativeEditor
              roomId={documentId}
              initialContent={document.content}
              onChange={onChange}
            />
          </Suspense>
        </Providers>
      </div>
    </div>
  );
};

export default DocumentIdPage;
