import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Priority, TaskStatus } from "@/features/tasks/types";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        overview:
          "py-2 px-4 text-sm font-medium cursor-pointer border-border/50 " +
          "bg-gradient-to-r from-background to-muted " +
          "dark:from-card/40 dark:to-muted/30 " +
          "hover:from-accent/20 hover:to-accent/30 " +
          "dark:hover:from-accent/20 dark:hover:to-accent/10 " +
          "text-foreground/90 dark:text-foreground/80 " +
          "shadow-sm hover:shadow " +
          "transition-all duration-200 ease-in-out " +
          "hover:scale-[1.02] active:scale-[0.98] " +
          "border dark:border-border/30",
        [TaskStatus.TODO]:
          "border-transparent bg-red-400 dark:text-neutral-900 text-primary hover:bg-red-400/80",
        [TaskStatus.IN_PROGRESS]:
          "border-transparent bg-yellow-400 dark:text-neutral-900 text-primary hover:bg-yellow-400/80",
        [TaskStatus.IN_REVIEW]:
          "border-transparent bg-blue-400 dark:text-neutral-900 text-primary hover:bg-blue-400/80",
        [TaskStatus.DONE]:
          "border-transparent bg-emerald-400 dark:text-neutral-900 text-primary hover:bg-emerald-400/80",
        [TaskStatus.BACKLOG]:
          "border-transparent bg-pink-400 text-primary dark:text-neutral-900 hover:bg-pink-400/80",

        [Priority.HIGH]:
          "border-transparent bg-red-600 text-primary dark:text-neutral-900 hover:bg-red-600/80",
        [Priority.MEDIUM]:
          "border-transparent bg-green-600 text-primary dark:text-neutral-900 hover:bg-green-600/80",
        [Priority.LOW]:
          "border-transparent bg-yellow-800 text-primary dark:text-neutral-900 hover:bg-yellow-800/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
