"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/themes/theme-toggle";
import { useCurrent } from "@/features/auth/api/use-current";

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  const { data, isPending } = useCurrent();

  return (
    <main className="bg-neutral-100 h-full dark:bg-neutral-900">
      <div className="mx-auto w-full flex flex-col h-full">
        <nav className="flex justify-between  border-b p-4 items-center">
          <div className="flex-1 hidden xs:hidden sm:block md:block lg:block">
            <div className="hidden dark:block">
              <Image src="/DarkLogo.svg" height={64} width={162} alt="Logo" />
            </div>
            <div className="block dark:hidden">
              <Image src="/LightLogo.svg" height={64} width={162} alt="Logo" />
            </div>
          </div>

          <div className="flex items-center justify-end w-full  lg:mr-5 min-w-[300px] sm:min-w-[100px]">
            <Button
              asChild
              variant={"secondary"}
              size={"lg"}
              className="text-md"
            >
              {data && data.user ? (
                <Link href={`/`}>Go to Dashboard</Link>
              ) : (
                <Link href={`${isSignIn ? "sign-up" : "sign-in"}`}>
                  {isSignIn ? "Sign Up" : "Login"}
                </Link>
              )}
            </Button>
            <div className="ml-2">
              <ThemeToggle type={"auth"} />
            </div>
          </div>
        </nav>

        <div
          className={cn(
            "flex-1 p-4 flex-col  items-center justify-center pt-4 md:pt-6"
          )}
        >
          {children}
        </div>
      </div>
    </main>
  );
};

export default BlogLayout;
