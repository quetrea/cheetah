"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsIcon, UsersIcon, Timer, TimerOff } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export const Navigation = () => {
  const { t } = useTranslation();
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  const routes = [
    {
      label: `${t("sidebar.navigations.Home.title")}`,
      href: "",
      icon: GoHome,
      activeIcon: GoHomeFill,
    },
    {
      label: `${t("sidebar.navigations.MyTasks.title")}`,
      href: "/tasks",
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill,
    },
    {
      label: `${t("sidebar.navigations.Pomodoro.title")}`,
      href: "/pomodoro",
      icon: Timer,
      activeIcon: TimerOff,
    },
    {
      label: `${t("sidebar.navigations.Settings.title")}`,
      href: "/settings",
      icon: SettingsIcon,
      activeIcon: SettingsIcon,
    },
    {
      label: `${t("sidebar.navigations.Members.title")}`,
      href: "/members",
      icon: UsersIcon,
      activeIcon: UsersIcon,
    },
  ];
  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500 group",
                isActive &&
                  "bg-white dark:bg-neutral-950 shadow-sm hover:opacity-100 text-primary "
              )}
            >
              <Icon className="size-5 text-neutral-500 group-hover:text-primary" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
