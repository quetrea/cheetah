"use client";
import { motion, useScroll } from "framer-motion";
import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./themes/theme-toggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "./language-switcher";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here.",
  },
  "tasks/[taskId]": {
    title: "Task Overview",
    description: "Manage your task details, subtasks, and progress",
  },
  projects: {
    title: "My Projects",
    description: "View all of your projects here.",
  },
  "projects/[projectId]": {
    title: "Project Overview",
    description: "Manage your project details, tasks, and team members",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  let pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  if (pathnameParts[3] === "tasks" && pathnameParts.length > 4) {
    pathnameKey = "tasks/[taskId]";
  } else if (pathnameParts[3] === "projects" && pathnameParts.length > 4) {
    pathnameKey = "projects/[projectId]";
  }

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.2,
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.3,
      },
    },
  };

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 10);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      className={cn(
        "p-4 px-6 flex items-center justify-between select-none backdrop-blur-sm sticky top-0 z-50 transition-all duration-200",
        "border-b",
        isScrolled
          ? "bg-background/95 border-border/40 shadow-sm"
          : "bg-background/50 border-transparent"
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-x-4">
        <motion.div
          variants={itemVariants}
          className={cn(
            "lg:hidden",
            "hover:bg-accent hover:text-accent-foreground rounded-md p-2 transition-colors"
          )}
        >
          <MobileSidebar />
        </motion.div>

        <motion.div
          className="flex-col hidden lg:flex px-4 py-2"
          variants={itemVariants}
        >
          <motion.h1
            className={cn(
              "text-2xl font-bold",
              "bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70",
              "bg-clip-text text-transparent",
              "tracking-tight"
            )}
            variants={titleVariants}
          >
            {title}
          </motion.h1>
          <motion.p
            className={cn("text-muted-foreground", "text-sm", "tracking-wide")}
            variants={descriptionVariants}
          >
            {description}
          </motion.p>
        </motion.div>
      </div>

      <motion.div className="flex items-center gap-x-2" variants={itemVariants}>
        <motion.div>
          <LanguageSwitcher />
        </motion.div>
        <motion.div
          className="hover:bg-accent hover:text-accent-foreground rounded-md p-2 transition-colors"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <ThemeToggle />
        </motion.div>

        <motion.div
          className={cn(
            "cursor-pointer",
            "hover:bg-accent hover:text-accent-foreground rounded-md p-2 transition-colors"
          )}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <UserButton />
        </motion.div>
      </motion.div>
    </motion.nav>
  );
};
