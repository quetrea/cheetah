"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export const LanguageSwitcher = () => {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-x-2.5 p-1">
        <Globe className="size-4" />
        <span>
          {languages.find((lang) => lang.value === i18n.language)?.label}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => i18n.changeLanguage(language.value)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-x-2">
              <span className="text-base">{language.flag}</span>
              <span>{language.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
