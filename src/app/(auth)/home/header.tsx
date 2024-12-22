"use client";

import { CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { t } = useTranslation();
  return (
    <header>
      <div className="flex items-center justify-center flex-col gap-y-4">
        <div className="flex flex-col gap-y-2 items-center">
          <h1 className="font-bold text-5xl text-center">
            {t("home.header.title")}
          </h1>
          <p className="font-normal text-center">{t("home.header.subtitle")}</p>
        </div>

        <p className="text-neutral-500 flex items-center border p-2 rounded-md">
          <CalendarIcon className="size-5 mr-2" />
          {t("home.header.createdAt", { date: "2024/23/10" })}
        </p>
      </div>
    </header>
  );
};
