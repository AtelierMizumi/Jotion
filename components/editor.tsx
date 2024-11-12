"use client";

import { useTheme } from "next-themes";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor, PartialBlock, Block, BlockNoteSchema, defaultBlockSpecs, StyleSchema, InlineContentSchema, BlockSchema } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BlockTypeSelectItem,
  blockTypeSelectItems,
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
  useCreateBlockNote,
 } from "@blocknote/react";
import { FloatingToolbarAi } from "./FloatingToolbarAi";
import { AIButton } from "./ai-button";
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
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      editable={editable}
    >
    <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <AIButton key={"customButton"} />
            <BlockTypeSelect key={"blockTypeSelect"} items={blockTypeSelectItems(editor.dictionary)} />
            <FileCaptionButton key={"fileCaptionButton"} />
            <FileReplaceButton key={"replaceFileButton"} />
 
            <BasicTextStyleButton
              basicTextStyle={"bold"}
              key={"boldStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"italic"}
              key={"italicStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"underline"}
              key={"underlineStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"strike"}
              key={"strikeStyleButton"}
            />

            <BasicTextStyleButton
              key={"codeStyleButton"}
              basicTextStyle={"code"}
            />
 
            <TextAlignButton
              textAlignment={"left"}
              key={"textAlignLeftButton"}
            />
            <TextAlignButton
              textAlignment={"center"}
              key={"textAlignCenterButton"}
            />
            <TextAlignButton
              textAlignment={"right"}
              key={"textAlignRightButton"}
            />
 
            <ColorStyleButton key={"colorStyleButton"} />
 
            <NestBlockButton key={"nestBlockButton"} />
            <UnnestBlockButton key={"unnestBlockButton"} />
 
            <CreateLinkButton key={"createLinkButton"} />
          </FormattingToolbar>
        )}
     />
    </BlockNoteView>
  );
});

Editor.displayName = "Editor";

export default Editor;
