"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CheetahLogoProps {
  variant?: "default" | "blog" | "privacy" | "compact";
  className?: string;
  subtitleClassName?: string;
}

export const CheetahLogo = ({
  variant = "default",
  className,
  subtitleClassName,
}: CheetahLogoProps) => {
  const subtitles = {
    default: "Lightning-Fast Project Management",
    blog: "Blog & News",
    privacy: "Privacy Policy",
    compact: "",
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("flex items-center gap-3", className)}
    >
      <div className="relative h-10 w-10">
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
        >
          <Image
            src="/cheetah-logo.svg"
            alt="Cheetah Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </motion.div>
      </div>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-0.5"
      >
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Cheetah
        </span>
        {subtitles[variant] && (
          <span
            className={cn(
              "text-xs font-medium text-muted-foreground whitespace-nowrap",
              subtitleClassName
            )}
          >
            {subtitles[variant]}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};
