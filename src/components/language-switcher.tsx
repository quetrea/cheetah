"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const languages = [
    { value: "tr", label: "Türkçe", flag: "🇹🇷" },
    { value: "en", label: "English", flag: "🇬🇧" },
  ];

  const currentLanguage = languages.find(
    (lang) => lang.value === i18n.language
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("w-full justify-start p-2.5", "font-medium", className)}
        >
          <Globe className="size-5 mr-2" />
          {currentLanguage?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => i18n.changeLanguage(language.value)}
            className={cn(
              "cursor-pointer flex items-center gap-x-2",
              i18n.language === language.value && "bg-accent/50"
            )}
          >
            <span className="text-base">{language.flag}</span>
            <span className="font-medium">{language.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
