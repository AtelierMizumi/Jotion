"use client";

import { ReactNode, useMemo } from "react";
import { RoomProvider } from "@liveblocks/react/suspense";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ClientSideSuspense } from "@liveblocks/react";
import { Loading } from "@/components/Loading";
import { useState } from "react";


interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

export function Room({ children }: { children: ReactNode }) {

  // get documentId and create a Room
  const params = useSearchParams();
  const documentId = params.get("documentId");

  const [id] = useState<Id<"documents"> | null>(documentId as Id<"documents"> | null);
  const document = useQuery(
    api.documents.getById,
    id ? { documentId: id } : "skip"
  );

  if (id === null || document === undefined) {
    return <Loading />;
  }

  const roomId = id;

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
}
