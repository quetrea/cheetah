"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <Select
      value={i18n.language}
      onValueChange={(value) => i18n.changeLanguage(value)}
    >
      <SelectTrigger className="w-[140px] dark:bg-neutral-900">
        <SelectValue>
          <div className="flex items-center gap-x-2">
            <span className="text-base">
              {languages.find((lang) => lang.value === i18n.language)?.flag}
            </span>
            <span>
              {languages.find((lang) => lang.value === i18n.language)?.label}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem
            key={language.value}
            value={language.value}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-x-2">
              <span className="text-base">{language.flag}</span>
              <span>{language.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
