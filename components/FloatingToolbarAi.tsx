import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CoreMessage } from "ai";
import { continueConversation } from "@/app/actions/ai";
import { readStreamableValue } from "ai/rsc";
import * as React from "react";
import { Command } from "cmdk";
import { Replace as ReplaceIcon, TextCursor } from "lucide-react";
import { ArrowRightCircle } from "lucide-react";
import { TextCursor as InsertInlineIcon } from "lucide-react";
import { ArrowLeft as BackIcon } from "lucide-react";
import { RefreshCw as RestartIcon } from "lucide-react";
import { Settings as OptionsIcon } from "lucide-react";
import { Trash2 as RubbishIcon } from "lucide-react";
import { Pilcrow as InsertParagraphIcon } from "lucide-react";
import { Sparkles as SparklesIcon } from "lucide-react";
import { optionsGroups } from "@/components/prompts";
import { Copy as CopyIcon } from "lucide-react";
import { motion as FramerMotion } from "framer-motion";
import { BlockNoteEditor } from "@blocknote/core";
const motion = FramerMotion;

/**
 * A floating toolbar component that provides AI-powered text editing capabilities
 * Thanh công cụ nổi cung cấp khả năng chỉnh sửa văn bản được hỗ trợ bởi AI
 *
 * @param editor - The BlockNote editor instance / Phiên bản trình soạn thảo BlockNote
 * @param state - Current state of the toolbar ("default" | "ai" | "closed") / Trạng thái hiện tại của thanh công cụ
 * @param setState - Function to update the toolbar state / Hàm cập nhật trạng thái thanh công cụ
 * @param onClose - Callback function when toolbar is closed / Hàm callback khi thanh công cụ đóng
 * 
 * @component FloatingToolbarAi
 * 
 * @remarks
 * The component manages:
 * - AI text generation and responses / Quản lý việc tạo văn bản và phản hồi từ AI
 * - Command panel for text operations / Bảng điều khiển cho các thao tác văn bản
 * - Text selection and manipulation / Lựa chọn và thao tác văn bản
 * - Message history with AI / Lịch sử tin nhắn với AI
 * 
 * Features include:
 * - Text replacement / Thay thế văn bản
 * - Inline text insertion / Chèn văn bản nội tuyến
 * - Paragraph insertion / Chèn đoạn văn
 * - AI conversation continuation / Tiếp tục hội thoại với AI
 * - Response regeneration / Tạo lại phản hồi
 */
export function FloatingToolbarAi({
  editor,
  state,
  setState,
  onClose,
}: {
  editor: BlockNoteEditor;
  state: "default" | "ai" | "closed";
  setState: (state: "default" | "ai" | "closed") => void;
  onClose: () => void;
}) {
  const textContent = editor?.getSelectedText();
  const [input, setInput] = useState("");

  // Current state of components
  const [aiState, setAiState] = useState<"initial" | "loading" | "complete">(
    "initial"
  );

  // Store all messages to and from AI
  const [messages, setMessages] = useState<CoreMessage[]>([]);

  // Get the last message sent from AI
  const lastAiMessage = useMemo(() => {
    const lastMessage = messages.filter((m) => m.role === "assistant")[0];
    return lastMessage
      ? { role: "assistant", content: `${lastMessage.content}` }
      : null;
  }, [messages]);

  // Store each "page" in the command panel
  const [pages, setPages] = React.useState<string[]>([]);
  const page = pages[pages.length - 1];

  // Get currently selected page
  const selectedOption = useMemo(() => {
    return optionsGroups
      .flatMap((group) => group.options)
      .flatMap((option) =>
        option.children ? [option, ...option.children] : [option]
      )
      .find((option) => option.text === page);
  }, [page]);

  // Remember previous prompt for continuing and regenerating
  const [previousPrompt, setPreviousPrompt] = useState("");

  // Send prompt to AI
  const submitPrompt = useCallback(
    async (prompt: string) => {
      setAiState("loading");
      setInput("");
      setPreviousPrompt(prompt);

      // Send on the user's text
      const systemMessage = `Do not surround your answer in quote marks. Only return the answer, nothing else. The user is selecting this text: 
            
"""
${textContent || ""}
"""
`;

      // Create new messages with selected text and prompt from user or command panel
      const newMessages: CoreMessage[] = [
        ...messages,
        { content: systemMessage, role: "system" },
        { content: prompt, role: "user" },
      ];
      setMessages(newMessages);

      // Stream in results
      const result = await continueConversation(newMessages);
      for await (const content of readStreamableValue(result)) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: content as string,
          },
        ]);
      }
      setAiState("complete");
    },
    [textContent, setAiState, messages]
  );

  // Focus command panel on load and page change
  const commandRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state === "ai" && commandRef.current) {
      commandRef.current.focus();
    }
  }, [state, aiState, page]);

  return (
    <>
      <motion.div
        layoutId="floating-toolbar-main"
        layout="size"
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: "spring",
          duration: 0.25,
        }}
        className="isolate rounded-lg border shadow-xl mt-2 border-gray-300/75 bg-card pointer-events-auto overflow-hidden origin-top-left"
        style={{maxWidth: "calc(100% - 8rem)", minWidth: "280px"}}
      >
        {lastAiMessage ? (
          // If the AI has streamed in content, show it
          <motion.div
            layout="position"
            transition={{ duration: 0 }}
            className="flex items-start border-b border-gray-300 gap-1.5"
          >
            <div className="flex-grow whitespace-pre-wrap max-h-[130px] overflow-y-auto select-none relative px-3 py-2 pr-10">
              <div className="sticky w-full top-1 right-0">
                <button
                  className="opacity-30 transition-opacity hover:opacity-60 absolute top-0 -right-8"
                  onClick={async () => {
                    if (!lastAiMessage.content) {
                      return;
                    }
                    // Copy generated text to clipboard
                    try {
                      await navigator.clipboard.writeText(
                        lastAiMessage.content
                      );
                    } catch (err) {
                      console.error("Failed to copy: ", err);
                    }
                  }}
                >
                  <CopyIcon className="h-4" />
                </button>
              </div>
              {lastAiMessage.content}
            </div>
          </motion.div>
        ) : null}

        <motion.form
          layout="position"
          transition={{ duration: 0 }}
          onSubmit={async (e) => {
            // Submit a custom prompt typed into the input
            e.preventDefault();
            submitPrompt(input);
            setInput("");

            // Save text editor selection before entering input
            editor
          }}
          className="w-full w-max-75 relative"
        >
          <input
            className="block w-full p-2 pl-3 rounded-lg outline-none disabled:transition-colors"
            value={input}
            placeholder={aiState === "loading" ? "Writing…" : "Custom prompt…"}
            onMouseDown={() => {
                // Save text editor selection before entering input
                const selection = editor?.getSelectedText();
                if (selection) {
                  localStorage.setItem("savedSelection", JSON.stringify(selection));
                }
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiState === "loading"}
          />
          <button
            className="absolute right-0 px-2 top-0 bottom-0 disabled:opacity-50 hover:enabled:bg-gray-100 disabled:transition-opacity"
            disabled={aiState === "loading" || !input}
          >
            <SparklesIcon
              style={aiState === "loading" ? { opacity: 0.6 } : {}}
              className="h-4 text-indigo-500  pointer-events-none disabled:transition-opacity"
            />
          </button>
        </motion.form>
      </motion.div>

      {aiState !== "loading" ? (
        // Don't show command panel when a result is streaming in
        <motion.div
          layoutId="floating-toolbar-command-panel"
          layout="size"
          className="origin-top-left"
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{
            opacity: 1,
            scale: 1,
            width: "initial",
          }}
          transition={{
            type: "spring",
            duration: 0.25,
          }}
        >
          <Command
            ref={commandRef}
            tabIndex={0}
            shouldFilter={false}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Backspace") {
                e.preventDefault();

                if (page) {
                  // Escape and backspace go back to previous page
                  setPages((pages) => pages.slice(0, -1));
                } else {
                  // or exit if at top level
                  setPages([]);
                  setState("default");
                  onClose();
                }
              }
            }}
            onMouseDown={(e) => {
              // Prevent clicks outside of items from removing selection
              e.preventDefault();
            }}
            className="z-10 relative mt-1 rounded-lg border shadow-2xl border-gray-300/75 bg-card max-w-[210px] max-h-[400px] overflow-y-auto pointer-events-auto"
          >
            <Command.List tabIndex={0} className="rounded-lg">
              {lastAiMessage && !page ? (
                // Commands to be shown after a prompt has been completed one time
                <>
                  <CommandItem
                    icon={<ReplaceIcon className="h-full" />}
                    onSelect={() => {
                      if (!lastAiMessage?.content) {
                        return;
                      }
                    
                      // Replace currently selected block content
                      const selection = editor?.getSelection()?.blocks.map(block => block.id);
                      if (selection && editor != undefined) {
                        const selectedBlock = editor.getSelection();
                          
                        if (selectedBlock) {
                          const blocksToReplace = selectedBlock.blocks;
                          const blockIdentifiers = blocksToReplace.map(block => block.id);
                          
                          const newBlock = {
                              ...selectedBlock,
                              content: lastAiMessage.content
                          };

                          editor.replaceBlocks(blockIdentifiers, [newBlock]);
                        }
                      }
                    
                      setPages([]);
                      setState("default");
                      onClose();
                    }}
                  >
                    Replace selection
                  </CommandItem>
                  <CommandItem
                    icon={<InsertInlineIcon className="h-full" />}
                    onSelect={() => {
                      if (!lastAiMessage?.content) {
                        return;
                      }

                      // Insert directly after the current text, inline
                      editor?.insertInlineContent(lastAiMessage.content);

                      setPages([]);
                      setState("default");
                      onClose();
                    }}
                  >
                    Add text inline
                  </CommandItem>
                  <CommandItem
                    icon={<InsertParagraphIcon className="h-full" />}
                    onSelect={() => {
                      if (!lastAiMessage?.content) {
                        return;
                      }

                      // Insert into a new paragraph after the current one
                      if (editor != undefined) {
                        const selectedBlock = editor.getSelection();
                        if (selectedBlock != undefined) {
                          const blockId = selectedBlock.blocks[0].id;
                          editor?.insertBlocks([
                            {
                              type: "paragraph",
                              content: lastAiMessage.content,
                            },
                          ], blockId, "after");
                      }

                      setPages([]);
                      setState("default");
                      setAiState("initial");
                      onClose();
                    }}}
                  >
                    Add below
                  </CommandItem>

                  <Command.Separator />

                  {aiState === "complete" ? (
                    // Commands to be shown on the completed prompt page
                    <>
                      <Command.Group heading="Modify further">
                        <CommandItem
                          icon={<ArrowRightCircle className="h-full" />}
                          onSelect={() => {
                            submitPrompt(`Start with this text and continue. Output this text at the start: 

"""
${lastAiMessage.content}
"""
                          `);
                          }}
                        >
                          Continue writing
                        </CommandItem>
                        <CommandItem
                          icon={<RestartIcon className="h-full" />}
                          onSelect={() => {
                            submitPrompt(previousPrompt);
                          }}
                        >
                          Regenerate
                        </CommandItem>
                        <CommandItem
                          icon={<OptionsIcon className="h-full" />}
                          onSelect={() => {
                            setAiState("initial");
                          }}
                        >
                          Other options
                        </CommandItem>
                      </Command.Group>
                      <Command.Separator />
                      <CommandItem
                        icon={<RubbishIcon className="h-full text-gray-500" />}
                        onSelect={() => {
                          onClose();
                        }}
                      >
                        Discard
                      </CommandItem>
                    </>
                  ) : null}
                </>
              ) : null}

              {aiState === "initial" ? (
                // Commands to be shown when awaiting prompt
                <>
                  {page ? (
                    // Show back button if page selected
                    <CommandItem
                      icon={<BackIcon className="h-full" />}
                      onSelect={() => setPages([])}
                    >
                      Back
                    </CommandItem>
                  ) : (
                    optionsGroups.map((optionGroup, index) => (
                      // Otherwise, show home page
                      <Fragment key={optionGroup.text}>
                        {index !== 0 ? <Command.Separator /> : null}
                        <Command.Group heading={optionGroup.text}>
                          {optionGroup.options.map((option) =>
                            option.prompt ? (
                              // An item with a prompt
                              <CommandItem
                                key={option.text}
                                icon={option.icon}
                                onSelect={() => {
                                  submitPrompt(option.prompt);
                                  setPages([]);
                                }}
                              >
                                {option.text}
                              </CommandItem>
                            ) : (
                              // An item that opens another page
                              <CommandItem
                                key={option.text}
                                icon={option.icon}
                                onSelect={() => {
                                  setPages([...pages, option.text]);
                                }}
                              >
                                {option.text}
                              </CommandItem>
                            )
                          )}
                        </Command.Group>
                      </Fragment>
                    ))
                  )}

                  {selectedOption?.children
                    ? selectedOption.children.map((option) => (
                        // If a page is selected, render child items on that page
                        <CommandItem
                          key={option.text}
                          icon={option.icon}
                          onSelect={() => {
                            submitPrompt(option.prompt);
                            setPages([]);
                          }}
                        >
                          {option.text}
                        </CommandItem>
                      ))
                    : null}
                </>
              ) : null}
            </Command.List>
          </Command>
        </motion.div>
      ) : null}
    </>
  );
}

function CommandItem({
  children,
  icon,
  onSelect,
}: {
  children: ReactNode;
  icon?: ReactNode;
  onSelect: ((value: string) => void) | undefined;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      onMouseDown={(e) => {
        // Preserve text editor selection
        e.preventDefault();
      }}
    >
      <motion.div className="flex justify-between items-center" layout={false}>
        <div className="flex items-center gap-1">
          {icon ? (
            <div className="w-5 h-[16px] text-indigo-500 flex items-center justify-center -ml-1">
              {icon}
            </div>
          ) : null}
          {children}
        </div>
        <div></div>
      </motion.div>
    </Command.Item>
  );
}
