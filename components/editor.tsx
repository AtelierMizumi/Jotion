"use client";

import { useTheme } from "next-themes";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

import { useEdgeStore } from "@/lib/edgestore";
import { useEffect } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const Editor = ({
  initialContent,
  onChange,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });
    return response.url;
  }

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent:
      initialContent 
      ? JSON.parse(initialContent) as PartialBlock[] 
      : undefined,
    uploadFile: handleUpload
  });

  useEffect(() => {
    const unsubscribe = editor.onChange(() => {
      const documentJSON = JSON.stringify(editor.document);
      onChange(documentJSON);
    });
    return unsubscribe;
  }, [editor, onChange]);

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}

export default Editor;
