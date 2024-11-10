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
  editable = true,
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
    if (editable) {
      let debounceTimeout: NodeJS.Timeout;

      const handleChange = () => {
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
          const documentJSON = JSON.stringify(editor.document);
          onChange(documentJSON);
        }, 1500); // 1.5-second debounce delay
      };

      editor.onChange(handleChange);
      // Clean up timeout and unsubscribe from changes
      return () => {
        clearTimeout(debounceTimeout);
      };
    }
  }, [editor, onChange, editable]);

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable}
      />
    </div>
  );
}

export default Editor;
