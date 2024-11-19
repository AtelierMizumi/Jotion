import "@blocknote/mantine/style.css";
import { useState } from "react";
import { FloatingToolbarAi } from "./FloatingToolbarAi";
import { BlockNoteEditor } from "@blocknote/core";
import { SparklesIcon } from "lucide-react";
  
// Update AIButton component
/**
 * @file AIButton Component
 * 
 * This file defines the AIButton component, which is a button that toggles the state of a floating AI toolbar.
 * The toolbar can be in one of three states: "default", "ai", or "closed".
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {BlockNoteEditor} props.editor - The editor instance to be passed to the FloatingToolbarAi component.
 * 
 * @returns {JSX.Element} The rendered AIButton component.
 */

export function AIButton({ editor }: { editor: BlockNoteEditor }) {
  const [toolbarState, setToolbarState] = useState<"default" | "ai" | "closed">("closed");
  
  const handleButtonClick = () => {
    setToolbarState((prevState) => (prevState === "ai" ? "closed" : "ai"));
  };

  const handleClose = () => {
    setToolbarState("closed");
  };

  return (
    <div className="relative group" style={{}}>
      <button
        onClick={handleButtonClick}
        className="px-2 inline-flex relative items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 data-[active]:bg-accent bg-gradient-to-br from-cyan-500 to-pink-500 to-red-500"
      >
        <SparklesIcon size={18} className="flex items-center text-white font-semibold" />
      </button>
      {toolbarState !== "closed" && (
        <FloatingToolbarAi 
          editor={editor}
          state={toolbarState} 
          setState={setToolbarState} 
          onClose={handleClose} 
        />
      )}
    </div>
  );
}