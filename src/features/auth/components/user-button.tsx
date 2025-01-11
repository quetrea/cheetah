"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LifeBuoyIcon, Loader, LogOut, UserCog2, UserPlus } from "lucide-react";
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
import { PlanType } from "@/features/plans/types";
import { useTranslation } from "react-i18next";

export const UserButton = () => {
  const { t } = useTranslation();
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

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      height: 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: -5,
      height: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -5,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      </DropdownMenuTrigger>
      <AnimatePresence>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className="w-60 overflow-hidden"
          sideOffset={10}
          asChild
        >
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-2 px-2.5 py-4"
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Avatar className="size-[52px] border border-neutral-300">
                  <AvatarFallback className="bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 text-xl font-medium text-neutral-500 flex items-center justify-center">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center"
              >
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {data.user.name || `${t("userButton.user")}`}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  {data.user.email}
                </p>
              </motion.div>
            </motion.div>
            <DottedSeparator className="py-1" />
            <motion.div
              variants={itemVariants}
              className="flex flex-col w-full"
            >
              {/* <motion.div
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <DropdownMenuItem
                  asChild
                  className="w-full p-2.5 flex items-center dark:hover:bg-white/10 dark:text-neutral-300 hover:bg-neutral-200 text-neutral-900 font-medium cursor-pointer"
                >
                  <Link href={`/create-profile`}>
                    <UserPlus className="size-5 mr-2" />
                    {t("userButton.tabs.createProfile")}
                  </Link>
                </DropdownMenuItem>
              </motion.div> */}

              <motion.div>
                <DropdownMenuItem
                  asChild
                  className="w-full p-2.5 flex items-center dark:hover:bg-white/10 dark:text-neutral-300 hover:bg-neutral-200 text-neutral-900 font-medium cursor-pointer"
                >
                  <Link href={`/account`}>
                    <UserCog2 className="size-5 mr-2" />
                    {t("userButton.tabs.account")}
                  </Link>
                </DropdownMenuItem>
              </motion.div>
              {/* 
              {data.plan.planType === PlanType.FREE && (
                <motion.div whileHover={{ scale: 1.02, x: 5 }}>
                  <DropdownMenuItem
                    asChild
                    className="w-full p-2.5 hover:bg-neutral-200 dark:hover:bg-white/10 dark:text-neutral-300 text-neutral-900 font-medium cursor-pointer"
                  >
                    <Link href={`/account/upgrade`}>
                      <LightningBoltIcon className="size-5 mr-2" />
                      {t("userButton.tabs.upgrade")}
                    </Link>
                  </DropdownMenuItem>
                </motion.div>
              )} */}

              {/* 
              <motion.div whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                <DropdownMenuItem className="w-full p-2.5 hover:bg-neutral-200 dark:hover:bg-white/10 dark:text-neutral-300 text-neutral-900 font-medium cursor-pointer">
                  <LifeBuoyIcon className="size-5 mr-2" />
                  {t("userButton.tabs.help-center")}
                </DropdownMenuItem>
              </motion.div>
              */}
            </motion.div>
            <DottedSeparator className="py-1" />
            <motion.div whileHover={{ scale: 1.02 }} variants={itemVariants}>
              <DropdownMenuItem
                onClick={() => logout()}
                className="h-10 flex items-center justify-center text-amber-700 dark:hover:bg-white/10 font-medium cursor-pointer"
              >
                <LogOut className="size-4 mr-2" />
                {t("userButton.tabs.log-out")}
              </DropdownMenuItem>
            </motion.div>
          </motion.div>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  );
};
