"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";

const CheetahLogo = () => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center gap-0.5"
  >
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col  gap-0.5"
    >
      <span className="text-xl font-bold  bg-gradient-to-bl from-gray-100 to-gray-800/80 bg-clip-text text-transparent">
        Cheetah
      </span>
      <span className="text-xs font-medium text-muted-foreground text-center whitespace-nowrap">
        Lightning-Fast Project Management
      </span>
    </motion.div>
  </motion.div>
);

export const Sidebar = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.aside
      className="h-screen bg-gray-100 dark:bg-neutral-900 p-4 w-full flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Link href={"/"} className="block">
          <CheetahLogo />
        </Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DottedSeparator className="my-4" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <WorkspaceSwitcher />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DottedSeparator className="my-4" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Navigation />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DottedSeparator className="my-4" />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent"
      >
        <Projects />
      </motion.div>
    </motion.aside>
  );
};
