import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface OverviewPropertyProps {
  label: string;
  type?: "time" | "default";
  children: React.ReactNode;
}

export const OverviewProperty = ({
  label,
  children,
  type = "default",
}: OverviewPropertyProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-x-2 group"
    >
      <motion.div
        className="min-w-[100px]"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <p className="text-sm text-muted-foreground">
          <div className="flex items-center">
            {type === "time" && (
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Calendar className="size-4 mr-2 transition-colors group-hover:text-primary" />
              </motion.div>
            )}
            <motion.span
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="group-hover:text-foreground transition-colors"
            >
              {label}
            </motion.span>
          </div>
        </p>
      </motion.div>
      <motion.div
        className="flex items-center gap-x-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
