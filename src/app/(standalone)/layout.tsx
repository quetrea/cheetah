import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@/features/auth/components/user-button";
import { ThemeToggle } from "@/components/themes/theme-toggle";
import { motion } from "framer-motion";

const CheetahLogo = () => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-3"
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
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        Lightning-Fast Project Management
      </span>
    </motion.div>
  </motion.div>
);

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <main className="bg-neutral-100 min-h-screen dark:bg-neutral-900">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href={"/"}>
            <CheetahLogo />
          </Link>
          <div className="flex items-center gap-x-4">
            <ThemeToggle />
            <UserButton />
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
