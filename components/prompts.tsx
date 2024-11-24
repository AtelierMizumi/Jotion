import { ReactNode } from "react";
import { Wand2, ArrowDownNarrowWide, ArrowUpWideNarrow, SpellCheck, Languages, ScrollText, List, HelpCircle } from "lucide-react";

type OptionChild = {
  text: string;
  prompt: string;
  icon?: ReactNode;
  children?: never;
};

type OptionParent = {
  text: string;
  children: OptionChild[];
  icon: ReactNode;
  prompt?: never;
};

type OptionGroup = {
  text: string;
  options: (OptionChild | OptionParent)[];
};

const languages = [
  "Arabic",
  "Bengali",
  "Chinese",
  "Dutch",
  "English",
  "French",
  "German",
  "Hindi",
  "Japanese",
  "Korean",
  "Nepali",
  "Portuguese",
  "Spanish",
  "Vietnamese",
];

const styles = [
  "Professional",
  "Straightforward",
  "Friendly",
  "Poetic",
  "Passive aggressive",
  "Pirate",
];
/**
 * Array of option groups for text manipulation and generation features
 * Mảng các nhóm tùy chọn cho các tính năng thao tác và tạo văn bản
 * 
 * @type {OptionGroup[]}
 * 
 * Contains two main groups:
 * Bao gồm hai nhóm chính:
 * 
 * 1. "Modify selection" group includes options for:
 *    Nhóm "Modify selection" bao gồm các tùy chọn:
 *    - Improving writing quality (Cải thiện chất lượng văn bản)
 *    - Fixing mistakes (Sửa lỗi)
 *    - Simplifying text (Đơn giản hóa văn bản)
 *    - Adding more detail (Thêm chi tiết)
 * 
 * 2. "Generate" group includes options for:
 *    Nhóm "Generate" bao gồm các tùy chọn:
 *    - Summarizing text (Tóm tắt văn bản)
 *    - Translating to different languages (Dịch sang các ngôn ngữ khác)
 *    - Changing text style (Thay đổi phong cách văn bản)
 *    - Explaining text content (Giải thích nội dung văn bản)
 * 
 * Each option contains:
 * Mỗi tùy chọn bao gồm:
 * @property {string} text - Display text for the option (Văn bản hiển thị cho tùy chọn)
 * @property {string} prompt - Instruction for text processing (Hướng dẫn xử lý văn bản)
 * @property {JSX.Element} icon - Icon component to display (Biểu tượng hiển thị)
 * @property {Array} [children] - Optional sub-options (Tùy chọn phụ không bắt buộc)
 */
export const optionsGroups: OptionGroup[] = [
  {
    text: "Modify selection",
    options: [
      {
        text: "Improve writing",
        prompt: "Improve the quality of the text",
        icon: <Wand2 className="h-3.5" />,
      },
      {
        text: "Fix mistakes",
        prompt: "Fix any typos or general errors in the text",
        icon: <SpellCheck className="h-full -ml-0.5" />,
      },
      {
        text: "Simplify",
        prompt: "Shorten the text, simplifying it",
        icon: <ArrowUpWideNarrow className="h-full" />,
      },
      {
        text: "Add more detail",
        prompt: "Lengthen the text, going into more detail",
        icon: <ArrowDownNarrowWide className="h-full" />,
      },
    ],
  },
  {
    text: "Generate",
    options: [
      {
        text: "Summarise",
        prompt: "Summarise the text",
        icon: <List className="h-full" />,
      },
      {
        text: "Translate into…",
        children: languages.map((lang) => ({
          text: lang,
          prompt: `Translate text into the ${lang} language`,
        })),
        icon: <Languages className="h-full" />,
      },
      {
        text: "Change style to…",
        children: styles.map((style) => ({
          text: style,
          prompt: `Change text into ${style} style`,
        })),
        icon: <ScrollText className="h-full" />,
      },
      {
        text: "Explain",
        prompt: "Explain what the text is about",
        icon: <HelpCircle className="h-full" />,
      },
    ],
  },
];
