"use client";

import { LifeBuoyIcon, Loader, LogOut, UserCog2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DottedSeparator } from "@/components/dotted-separator";

import { useLogout } from "../api/use-logout";
import { useCurrent } from "../api/use-current";
import Link from "next/link";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useGetPlan } from "@/features/plans/api/use-get-user-plan";
import { PlanType } from "@/features/plans/types";

export const UserButton = () => {
  const { data: data, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();

  if (!data) {
    return null;
  }
  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const avatarFallback = data.user.name
    ? data.user.name.charAt(0).toUpperCase()
    : data.user.email.charAt(0) ?? "U";
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="size-10 hover:opacity-75 transition border  border-neutral-300">
          <AvatarFallback className="bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 text-xl font-medium text-neutral-500  flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {data.user.name || "User"}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              {data.user.email}
            </p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <div className="flex flex-col w-full  ">
          <DropdownMenuItem
            asChild
            className="w-full p-2.5 flex items-center dark:hover:bg-white/10 dark:text-neutral-300 hover:bg-neutral-200 text-neutral-900 font-medium cursor-pointer"
          >
            <Link href={`/account`}>
              <UserCog2 className="size-5 mr-2" />
              Account Settings
            </Link>
          </DropdownMenuItem>
          {data.plan.planType === PlanType.FREE && (
            <DropdownMenuItem
              asChild
              className="w-full p-2.5 hover:bg-neutral-200 dark:hover:bg-white/10 dark:text-neutral-300  text-neutral-900 font-medium cursor-pointer"
            >
              <Link href={`/account/upgrade`}>
                <LightningBoltIcon className="size-5 mr-2" />
                Upgrade to Plus
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="w-full p-2.5 hover:bg-neutral-200 dark:hover:bg-white/10 dark:text-neutral-300  text-neutral-900 font-medium cursor-pointer">
            <LifeBuoyIcon className="size-5 mr-2" />
            Help Center
          </DropdownMenuItem>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="h-10 flex items-center justify-center text-amber-700 dark:hover:bg-white/10 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
