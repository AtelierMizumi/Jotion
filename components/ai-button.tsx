import "@blocknote/mantine/style.css";
import { useState } from "react";
import { FloatingToolbarAi } from "./FloatingToolbarAi";
import { SparkleIcon } from "lucide-react";
  
  // Custom Formatting Toolbar Button to toggle blue text & background color.
  export function AIButton() {
    const [toolbarState, setToolbarState] = useState<"default" | "ai" | "closed">("closed");
  
    const handleButtonClick = () => {
      setToolbarState("ai");
    };
  
    const handleClose = () => {
      setToolbarState("closed");
    };
  
    return (
    <div className="relative group">
      <button
        onClick={handleButtonClick}
        className="px-2 inline-flex relative items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 data-[active]:bg-accent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse"
      >
        <SparkleIcon size={18} className="flex items-center text-white font-semibold" />
      </button>
      {toolbarState !== "closed" && (
        <FloatingToolbarAi state={toolbarState} setState={setToolbarState} onClose={handleClose} />
      )}
    </div>
    );
  }