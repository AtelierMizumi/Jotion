"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom, RoomProvider } from "@liveblocks/react";
import React, { useCallback, useEffect, useState } from "react";
import { Avatars } from "@/components/Avatars";
import styles from "./CollaborativeEditor.module.css";
import { Button } from "@mantine/core";
import { SunMedium, Moon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useEdgeStore } from "@/lib/edgestore";
import { useTheme } from "next-themes";
import { ClientSideSuspense } from "@liveblocks/react";

const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#FFF176",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];

type BlockNoteProps = {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  doc: Y.Doc;
  provider: any;
};

const BlockNote: React.FC<BlockNoteProps> = ({
  onChange,
  initialContent,
  editable = true,
  doc,
  provider,
}) => {
  const { user } = useUser();
  const { edgestore } = useEdgeStore();
  const { resolvedTheme } = useTheme();
  const userRandomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });
    return response.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: user?.fullName || "Anonymous",
        color: userRandomColor,
      },
    },
  });

  const changeTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  }, [theme]);

  useEffect(() => {
    if (editable && onChange) {
      let debounceTimeout: NodeJS.Timeout;

      const handleChange = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const documentJSON = JSON.stringify(editor.document);
          onChange(documentJSON);
        }, 1500);
      };

      editor.onChange(handleChange);
      return () => {
        clearTimeout(debounceTimeout);
      };
    }
  }, [editor, onChange, editable]);

  return (
    <div className={styles.container}>
      <div className={styles.editorHeader}>
        <Button
          className={styles.button}
          variant="subtle"
          onClick={changeTheme}
          aria-label="Switch Theme"
        >
          {theme === "dark" ? <SunMedium size={20} /> : <Moon size={20} />}
        </Button>
        <Avatars />
      </div>
      <div className={styles.editorPanel}>
        <BlockNoteView
          className={styles.editorContainer}
          editor={editor}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
      </div>
    </div>
  );
};

interface CollaborativeEditorProps {
  onChange: (content: string) => void;
  initialContent?: string;
  roomId: string;
}

const Editor = ({
  onChange,
  initialContent,
}: Omit<CollaborativeEditorProps, "roomId">) => {
  const room = useRoom();
  const { user } = useUser();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    room.updatePresence({
      cursor: null,
    });

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return (
    <BlockNote
      doc={doc}
      provider={provider}
      onChange={onChange}
      initialContent={initialContent}
    />
  );
};

const CollaborativeEditor = ({
  onChange,
  initialContent,
  roomId,
}: CollaborativeEditorProps) => {
  const { user } = useUser();
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {() => <Editor onChange={onChange} initialContent={initialContent} />}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeEditor;
