import { differenceInDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { tr, enUS } from "date-fns/locale";

interface TaskDateProps {
  value: string;
  className?: string;
  completed?: boolean;
}

export const TaskDate = ({ value, className, completed }: TaskDateProps) => {
  const { i18n } = useTranslation();
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";

  if (diffInDays <= 3) {
    textColor = "text-red-500";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-500";
  }

  if (completed) {
    textColor = "text-green-400";
  }

  const locale = i18n.language === "en" ? enUS : tr;

  return (
    <div className={`${textColor} pl-2`}>
      <span className={cn("truncate", className)}>
        {format(value, "PPP", { locale })}
      </span>
    </div>
  );
};
