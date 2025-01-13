"use client";

import * as React from "react";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";
import { tr, enUS } from "date-fns/locale";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
}

export const DatePicker = ({
  value,
  onChange,
  className,
  placeholder = "Select date",
}: DatePickerProps) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const day = value ? format(value, "d") : "";
  const monthName = value
    ? format(value, "MMMM", { locale: i18n.language === "en" ? enUS : tr })
    : "";
  const year = value ? format(value, "yyyy") : "";

  const locale = i18n.language === "en" ? enUS : tr;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={"outline"}
            size={"lg"}
            className={cn(
              "w-full justify-start text-left font-normal px-3",
              !value && "text-muted-foreground",
              className
            )}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              `${day} ${monthName} ${year}`
            ) : (
              <span>{t(placeholder)}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="center"
          sideOffset={4}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={() => setOpen(false)}
          style={{
            position: "relative",
            pointerEvents: "auto",
          }}
        >
          <div
            className="p-3 bg-popover/95 backdrop-blur-sm rounded-lg ring-1 ring-border/5"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleSelect}
              locale={locale}
              className="border-none"
              classNames={{
                months:
                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption:
                  "flex justify-center pt-1 relative items-center text-sm font-medium",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                  "h-7 w-7 bg-transparent p-0 hover:opacity-100 hover:bg-muted/50 transition-colors",
                  "rounded-md inline-flex items-center justify-center"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                  "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: cn(
                  "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                ),
                day: cn(
                  "h-8 w-8 p-0 font-normal rounded-md transition-colors hover:bg-muted/50",
                  "aria-selected:opacity-100 aria-selected:bg-primary aria-selected:text-primary-foreground"
                ),
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                  "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
