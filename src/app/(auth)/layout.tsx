"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AdBanner from "@/components/adsense/AdBanner";
import { PageList } from "./page-list";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/toggle/theme-toggle";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";

  return (
    <main className="bg-neutral-100 min-h-screen dark:bg-neutral-900">
      <div className="mx-auto w-full ">
        <nav className="flex justify-between border-b p-4 items-center">
          <div className="flex-1">
            <div className="hidden dark:block">
              <Image src="/DarkLogo.svg" height={64} width={162} alt="Logo" />
            </div>
            <div className="block dark:hidden">
              <Image src="/LightLogo.svg" height={64} width={162} alt="Logo" />
            </div>
          </div>

          <div className="flex items-center justify-end mr-5 min-w-[300px]">
            <ThemeToggle />
            <PageList />
            <Button
              asChild
              variant={"secondary"}
              size={"lg"}
              className="text-md"
            >
              <Link href={`${isSignIn ? "sign-up" : "sign-in"}`}>
                {isSignIn ? "Sign Up" : "Login"}
              </Link>
            </Button>
          </div>
        </nav>
        <div
          className={cn(
            "flex p-4 flex-col items-center justify-center pt-4 md:pt-14",
            pathname === "/home" && "items-start",
            pathname === "/about" && "items-start",
            pathname === "/privacy" && "items-start"
          )}
        >
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
