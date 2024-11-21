"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@/features/auth/components/user-button";
import { ThemeToggle } from "@/components/themes/theme-toggle";
import { motion } from "framer-motion";
import { CheetahLogo } from "@/components/logo/cheetah-logo";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <main className="bg-neutral-100 min-h-screen dark:bg-neutral-900">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href={"/"}>
            <CheetahLogo variant="default" />
          </Link>
          <div className="flex items-center gap-x-4">
            <ThemeToggle />
            <UserButton />
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
