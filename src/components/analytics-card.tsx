import { Card, CardHeader, CardDescription, CardTitle } from "./ui/card";

import { cn } from "@/lib/utils";

import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}
export const AnalyticsCard = ({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticsCardProps) => {
  const iconColor = variant === "up" ? "text-emerald-500" : "text-red-500";
  const increaseValueColor =
    variant === "up" ? "text-emerald-500" : "text-red-500";
  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, increaseValue, {
      duration: 1,
      ease: "easeOut",
    });

    return animation.stop;
  }, [increaseValue, count]);

  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1 min-w-[50px]">
            <Icon className={cn(iconColor, "size-4")} />
            <motion.span
              className={cn(
                increaseValueColor,
                "truncate text-base font-medium text-right"
              )}
            >
              {rounded}
            </motion.span>
          </div>
        </div>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};
