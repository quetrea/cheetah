"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { label: "Home", path: "/home", deActive: false },
  { label: "Guide", path: "/guides", deActive: false },
  { label: "Privacy Policy", path: "/privacy", deActive: false },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export const PageList = () => {
  const pathname = usePathname();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="list-none flex items-center flex-col lg:flex-row justify-center gap-2 lg:gap-3"
    >
      {links.map((link) => {
        const isActive = link.path === pathname;
        if (link.deActive) return null;

        return (
          <motion.div
            key={link.path}
            variants={item}
            whileHover={{ y: -2 }}
            className="relative"
          >
            <Link href={link.path}>
              <motion.span
                className={cn(
                  "relative py-2.5 px-4 text-[15px] font-medium transition-colors",
                  "hover:text-foreground/80",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-purple-600"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 to-pink-600 bottom-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </motion.span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// İsteğe bağlı: Hover efekti için özel komponent
const HoverCard = motion(motion.div);

// İsteğe bağlı: Alternatif tasarım için bu komponenti kullanabilirsiniz
const AlternativeLink = ({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) => (
  <Link href={href}>
    <HoverCard
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-4 py-2 rounded-full",
        "hover:bg-primary/10",
        isActive ? "bg-primary/10" : "bg-transparent"
      )}
    >
      {children}
    </HoverCard>
  </Link>
);
