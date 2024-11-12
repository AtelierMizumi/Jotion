import { ReactNode } from "react";
import { Wand, SpellCheck2, Scissors, Expand, Languages, Type, List, Info, WandIcon } from "lucide-react";

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
export const optionsGroups: OptionGroup[] = [
  {
    text: "Modify selection",
    options: [
      {
        text: "Improve writing",
        prompt: "Improve the quality of the text",
        icon: <Wand className="h-3.5" />,
      },
      {
        text: "Fix mistakes",
        prompt: "Fix any typos or general errors in the text",
        icon: <SpellCheck2 className="h-full -ml-0.5" />,
      },
      {
        text: "Simplify",
        prompt: "Shorten the text, simplifying it",
        icon: <Scissors className="h-full" />,
      },
      {
        text: "Add more detail",
        prompt: "Lengthen the text, going into more detail",
        icon: <Expand className="h-full" />,
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
        icon: <Type className="h-full" />,
      },
      {
        text: "Explain",
        prompt: "Explain what the text is about",
        icon: <Info className="h-full" />,
      },
    ],
  },
];
