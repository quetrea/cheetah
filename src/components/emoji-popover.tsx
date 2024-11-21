import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

interface EmojiPopoverProps {
  children: React.ReactNode;
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPopover = ({
  children,
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const { theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-full border-none p-0 shadow-xl"
        side="top"
        align="start"
      >
        <Picker
          theme={theme as "light" | "dark"}
          data={data}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onEmojiSelect={(emoji: any) => onEmojiSelect(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
