"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export const Content = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <DottedSeparator className="my-7" />
      <div className="p-7 relative">
        <Card className="p-4 group cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {t('home.card.title')}
            </CardTitle>
            <CardDescription>{t('home.card.description')}</CardDescription>
          </CardHeader>
          <CardContent className="w-full relative">
            <div className="border h-full rounded-md flex">
              <div className="flex-3 md:flex border-r hidden flex-col gap-y-4 p-4">
                <div className="flex flex-col items-center gap-y-2">
                  <div className="text-sm">{t('home.sections.workspace.title')}</div>
                  <DottedSeparator />
                  <div className="flex flex-col">
                    <div className="text-xs flex items-center justify-center border rounded-md p-2">
                      {t('home.sections.workspace.myWorkspace')}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                  <div className="text-sm">{t('home.sections.projects.title')}</div>
                  <DottedSeparator />
                  <div className="flex flex-col">
                    <div className="text-xs flex items-center justify-center border rounded-md p-2">
                      {t('home.sections.projects.myProject')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-y-2 p-4">
                <div className="text-sm">{t('home.sections.tasks.title')}</div>
                <div className="flex border rounded-md flex-col p-2 gap-y-2">
                  <div className="px-2 py-1">{t('home.sections.tasks.subtitle')}</div>
                  <div className="p-2 border rounded-md gap-y-4 flex flex-col text-xs py-3">
                    <li>{t('home.sections.tasks.task1')}</li>
                    <DottedSeparator />
                    <li>{t('home.sections.tasks.task2')}</li>
                    <DottedSeparator />
                    <li>{t('home.sections.tasks.task3')}</li>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-lg flex gap-x-2">
            {t('home.card.author.label')}:
            <span className="group-hover:underline text-neutral-500">
              {t('home.card.author.name')}
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
