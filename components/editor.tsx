"use client";

import { useTheme } from "next-themes";
import ReactDOM from 'react-dom/client';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor, PartialBlock, Block } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { AnimatePresence, motion } from "framer-motion";
import { AIButton } from "./ai-button";
import { useEdgeStore } from "@/lib/edgestore";
import { useState, useEffect, forwardRef } from "react";

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

  const editor = useCreateBlockNote({
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

  // Updated spawnAIButton with custom debounce and animations
  function spawnAIButton(editor: BlockNoteEditor): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editable) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length < 2) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    let container = document.getElementById('ai-button-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ai-button-container';
      document.body.appendChild(container);
    }

    container.style.position = 'absolute';
    container.style.left = `${rect.left + window.scrollX}px`;
    container.style.top = `${rect.top + window.scrollY - 80}px`;
    container.style.zIndex = '1000';

    const root = ReactDOM.createRoot(container!);
    root.render(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2, ease: 'easeIn' },
          }}
        >
          <AIButton editor={editor} />
        </motion.div>
      </AnimatePresence>
    );

    const cleanup = (e: Event) => {
      // Get the target element that triggered the event
      const targetElement = e.target as Node;
      
      // Check if container exists and target is not inside container
      if (container && 
          document.body.contains(container) && 
          !container.contains(targetElement)) {
        document.body.removeChild(container);
      }
    };
    
    // Use mousedown event instead of selectionchange for better control
    document.addEventListener('mousedown', cleanup, { once: true });
  }

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      editable={editable}
      onSelect={() => spawnAIButton(editor)}
    />
  );
};

Editor.displayName = "Editor";

export default Editor;
