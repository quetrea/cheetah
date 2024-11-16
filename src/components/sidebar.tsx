"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";

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
      className="h-full bg-neutral-100 dark:bg-neutral-900 p-4 w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Link href={"/"} className="flex justify-center items-center">
          <div className="hidden dark:block">
            <Image src="/DarkLogo.svg" height={48} width={200} alt="Logo" />
          </div>
          <div className="block dark:hidden">
            <Image src="/LightLogo.svg" height={48} width={200} alt="Logo" />
          </div>
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

      <motion.div variants={itemVariants}>
        <Projects />
      </motion.div>
    </motion.aside>
  );
};
