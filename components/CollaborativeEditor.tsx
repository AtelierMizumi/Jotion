"use client";

import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Liveblocks } from "@liveblocks/node";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import React, { useCallback, useEffect, useState } from "react";
import { Avatars } from "@/components/Avatars";
import styles from "./CollaborativeEditor.module.css";
import { Button } from "@mantine/core";
import { SunMedium, Moon } from "lucide-react";
import { NextRequest } from "next/server";
import { useUser } from "@clerk/clerk-react";
import { useEdgeStore } from "@/lib/edgestore";

// Collaborative text editor with simple rich text, live cursors, and live avatars
export function CollaborativeEditor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  // Set up Liveblocks Yjs provider
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return <BlockNote doc={doc} provider={provider} />;
}

type EditorProps = {
  doc: Y.Doc;
  provider: any;
};

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

const userColor = COLORS[Math.floor(Math.random() * COLORS.length)];

const handleUpload = async (file: File) => {
  const response = await useEdgeStore().edgestore.publicFiles.upload({
    file
  });
  return response.url;
}

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

function BlockNote({ doc, provider }: EditorProps) {
  // Get user info from Liveblocks authentication endpoint
  const userInfo = useSelf((me) => me.info);

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-store"),

      // Information for this user
      // This is used to display the user's cursor and avatar
      user: {
        name: useUser().user?.fullName || "Anonymous",
        // random color that work for both light and dark themes
        color: userColor,
      },
    },
  });

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const changeTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  }, [theme]);

  return (
    <div className={styles.container}>
      <div className={styles.editorHeader}>
        <Button
          className={styles.button}
          variant="subtle"
          onClick={changeTheme}
          aria-label="Switch Theme"
        >
          {theme === "dark" ? (
            <SunMedium size={20} />
          ) : (
            <Moon size={20} />
          )}
        </Button>
        <Avatars />
      </div>
      <div className={styles.editorPanel}>
        <BlockNoteView
          editor={editor}
          className={styles.editorContainer}
          theme={theme}
        />
      </div>
    </div>
  );
}



export async function POST(request: NextRequest) {
  // Get the current user's unique id from your database
  const userId = useUser().user?.id;

  // Create a session for the current user
  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
  const session = liveblocks.prepareSession(`user-${userId}`, {
    userInfo: {
      name: useUser().user?.fullName || "Anonymous",
      // random color that work for both light and dark themes
      color: userColor,
    },
  });

  session.allow(`documents:*`, session.READ_ACCESS);

  // Authorize the user and return the result
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
