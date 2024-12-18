"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export type LogoVariant =
  | "default"
  | "blog"
  | "compact"
  | "home"
  | "privacy"
  | "guide";

interface CheetahLogoProps {
  variant?: LogoVariant;
  className?: string;
  subtitleClassName?: string;
}

export const CheetahLogo = ({
  variant,
  className,
  subtitleClassName,
}: CheetahLogoProps) => {
  const pathname = usePathname();

  // Determine variant based on pathname if not explicitly provided
  const getVariantFromPath = (): LogoVariant => {
    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    switch (lastSegment) {
      case "privacy":
        return "privacy";
      case "guides":
        return "blog";
      case "blogs":
        return "blog";
      case "home":
        return "default";
      default:
        return "default";
    }
  };

  const subtitles: Record<LogoVariant, string> = {
    default: "Lightning-Fast Project Management",
    blog: "Blog & News",
    home: "Lightning-Fast Project Management",
    compact: "",
    privacy: "Privacy Policy",
    guide: "Guide & Documentation",
  };

  const currentVariant = getVariantFromPath();

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
        {subtitles[currentVariant] && (
          <span
            className={cn(
              "text-xs font-medium text-muted-foreground whitespace-nowrap",
              subtitleClassName
            )}
          >
            {subtitles[currentVariant]}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};
