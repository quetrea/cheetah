"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/themes/theme-toggle";
import { useCurrent } from "@/features/auth/api/use-current";
import { motion, AnimatePresence } from "framer-motion";
import { PageList } from "../(auth)/page-list";
import { CheetahLogo } from "@/components/logo/cheetah-logo";

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  const { data, isPending } = useCurrent();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-neutral-100 min-h-screen dark:bg-neutral-900"
    >
      <div className="mx-auto w-full flex flex-col h-full">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between border-b p-4 items-center relative"
        >
          {/* Logo ve PageList Container */}
          <div className="flex items-center gap-x-8 flex-1">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden xs:hidden sm:block md:block lg:block"
            >
              <div className="hidden dark:block">
                <CheetahLogo variant="blog" />
              </div>
              <div className="block dark:hidden">
                <CheetahLogo variant="blog" />
              </div>
            </motion.div>

            <PageList />
          </div>

          {/* Auth Buttons and Theme Toggle */}
          <div className="flex-1 hidden md:flex items-center justify-end gap-4">
            {!data?.user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2"
              >
                <Button
                  asChild
                  variant={isSignIn ? "primary" : "outline"}
                  size="sm"
                  className={cn(
                    isSignIn &&
                      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0",
                    !isSignIn && "hover:text-purple-600 hover:border-purple-600"
                  )}
                >
                  <Link href="/sign-in">Login</Link>
                </Button>
                <Button
                  asChild
                  variant={!isSignIn ? "primary" : "outline"}
                  size="sm"
                  className={cn(
                    !isSignIn &&
                      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0",
                    isSignIn && "hover:text-purple-600 hover:border-purple-600"
                  )}
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="sm"
                >
                  <Link href="/">Go to Dashboard</Link>
                </Button>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "flex-1 p-4 flex-col items-center justify-center pt-4 md:pt-6",
            "pb-32 md:pb-4"
          )}
        >
          {children}
        </motion.div>

        {/* Mobile Auth Switch */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 md:hidden z-50"
        >
          <div className="bg-background/80 backdrop-blur-sm border-t p-4">
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <ThemeToggle type="auth" />

              {/* Auth Switch */}
              {!data?.user && (
                <div className="w-full max-w-xs relative">
                  <div className="bg-muted rounded-full p-1">
                    <div className="relative z-0 flex">
                      <motion.div
                        className="absolute inset-0 z-0"
                        initial={false}
                        animate={{
                          x: isSignIn ? "0%" : "50%",
                        }}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      >
                        <motion.div
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-full w-1/2 rounded-full shadow-sm opacity-90"
                          layout
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      </motion.div>

                      <Link
                        href="/sign-in"
                        className={cn(
                          "flex-1 relative z-10 px-4 py-2.5 text-sm font-medium text-center transition-colors duration-200",
                          "hover:text-foreground",
                          isSignIn ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        Login
                      </Link>
                      <Link
                        href="/sign-up"
                        className={cn(
                          "flex-1 relative z-10 px-4 py-2.5 text-sm font-medium text-center transition-colors duration-200",
                          "hover:text-foreground",
                          !isSignIn
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Dashboard Button */}
              {data?.user && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-xs"
                >
                  <Button asChild className="w-full">
                    <Link href="/">Go to Dashboard</Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default BlogLayout;
