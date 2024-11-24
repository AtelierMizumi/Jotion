"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
};

/**
 * A component that renders an emoji picker with a popover trigger
 * Một component hiển thị bộ chọn emoji với một popover trigger
 * 
 * @param {Object} props - The component props / Các props của component
 * @param {(emoji: string) => void} props.onChange - Callback function when an emoji is selected
 *                                                  Hàm callback khi một emoji được chọn
 * @param {React.ReactNode} props.children - The trigger element to open the emoji picker
 *                                         Phần tử trigger để mở bộ chọn emoji
 * @param {boolean} props.asChild - When true, the PopoverTrigger will not render a default button element
 *                                 Khi true, PopoverTrigger sẽ không render phần tử button mặc định
 * 
 * @returns {JSX.Element} A Popover component containing the emoji picker
 *                       Một component Popover chứa bộ chọn emoji
 * 
 * @example
 * <IconPicker onChange={(emoji) => console.log(emoji)}>
 *   <button>Open Emoji Picker</button>
 * </IconPicker>
 */
export const IconPicker = ({
  onChange,
  children,
  asChild
}: IconPickerProps) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap

  const themeMap = {
    "dark": Theme.DARK,
    "light": Theme.LIGHT
  };

  const theme = themeMap[currentTheme];

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker
          height={480}
          width={360}
          theme={theme}
          lazyLoadEmojis={true}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
