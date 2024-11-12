"use client";

import { useTheme } from "next-themes";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor, PartialBlock, Block, BlockNoteSchema, defaultBlockSpecs, StyleSchema, InlineContentSchema, BlockSchema } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BlockTypeSelectItem,
  FormattingToolbar,
  FormattingToolbarController,
  blockTypeSelectItems,
  useCreateBlockNote,
 } from "@blocknote/react";
import { FloatingToolbarAi } from "./FloatingToolbarAi";
import { AlertCircleIcon } from "lucide-react";
import { Alert } from "./alert";
import { useEdgeStore } from "@/lib/edgestore";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Alert block.
    alert: Alert,
    ai: Ai
  },
});

const Editor = forwardRef<{
  getEditor: () => BlockNoteEditor;
}, EditorProps>(({
  initialContent,
  onChange,
  editable = true,
}, ref) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const [blocks, setBlocks] = useState<Block[]>([]);

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });
    return response.url;
  }

  const editor = useCreateBlockNote({
    schema,
    initialContent: initialContent 
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
    <BlockNoteView
      editor={editor}
      formattingToolbar={false}
      sideMenu={false}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      editable={editable}
    >
    <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar
            blockTypeSelectItems={[
              ...blockTypeSelectItems(editor.dictionary),
              {
                name: "Alert",
                type: "alert",
                icon: () => <AlertCircleIcon size={16}/>,
                isSelected: (block) => block.type === "alert",
              } satisfies BlockTypeSelectItem,
            ]}
          />
        )}
     />
    </BlockNoteView>
  );
});

Editor.displayName = "Editor";


export default Editor;
