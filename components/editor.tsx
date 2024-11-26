"use client";

import { useTheme } from "next-themes";
import ReactDOM from 'react-dom/client';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { AnimatePresence, motion } from "framer-motion";
import { AIButton } from "./ai-button";
import { useEdgeStore } from "@/lib/edgestore";
import { useEffect } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

/**
 * A rich text editor component with AI assistance capabilities.
 * Một trình soạn thảo văn bản với khả năng hỗ trợ AI.
 * 
 * @component
 * 
 * @param {Object} props - Component props / Các props của component
 * @param {string} [props.initialContent] - Initial content in JSON string format / Nội dung ban đầu ở dạng chuỗi JSON
 * @param {function} props.onChange - Callback function triggered when content changes / Hàm callback được gọi khi nội dung thay đổi
 * @param {boolean} [props.editable=true] - Whether the editor is editable / Xác định xem trình soạn thảo có thể chỉnh sửa hay không
 * 
 * @returns {JSX.Element} BlockNoteView component / Component BlockNoteView
 * 
 * @features
 * - Debounced content updates (1.5s) / Cập nhật nội dung với debounce (1.5s)
 * - Image upload support / Hỗ trợ tải lên hình ảnh
 * - AI assistance button on text selection / Nút hỗ trợ AI khi chọn văn bản
 * - Dark/Light theme support / Hỗ trợ giao diện tối/sáng
 * 
 * @example
 * ```tsx
 * <Editor
 *   initialContent={savedContent}
 *   onChange={(content) => handleContentChange(content)}
 *   editable={true}
 * />
 * ```
 */
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
    let root = (window as any).__AI_BUTTON_ROOT__;
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'ai-button-container';
      document.body.appendChild(container);
      root = ReactDOM.createRoot(container);
      (window as any).__AI_BUTTON_ROOT__ = root;
    }

    container.style.position = 'absolute';
    container.style.left = `${Math.min(rect.left + window.scrollX - 40, 240)}px`;
    container.style.top = `${Math.min(rect.top + window.scrollY, 140)}px`;
    container.style.zIndex = '1000';

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
