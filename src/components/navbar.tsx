"use client";
import { motion } from "framer-motion";
import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./themes/theme-toggle";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here.",
  },
  projects: {
    title: "My Project",
    description: "View all of your project here.",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.nav
      className="pt-4 px-6 flex items-center justify-between backdrop-blur-sm bg-background/80 sticky top-0 z-50 "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-x-4">
        <motion.div variants={itemVariants} className="lg:hidden">
          <MobileSidebar />
        </motion.div>

        <motion.div className="flex-col hidden lg:flex" variants={itemVariants}>
          <motion.h1
            className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {description}
          </motion.p>
        </motion.div>
      </div>

      <motion.div className="flex items-center gap-x-4" variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ThemeToggle />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <UserButton />
        </motion.div>
      </motion.div>
    </motion.nav>
  );
};
