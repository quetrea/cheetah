import { Calendar } from "lucide-react";

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
    <div className="flex items-start gap-x-2">
      <div className="min-w-[100px]">
        <p className="text-sm text-muted-foreground">
          <div className="flex items-center">
            {type === "time" && <Calendar className="size-4 mr-2" />}
            {label}
          </div>
        </p>
      </div>
      <div className="flex items-center gap-x-2">{children}</div>
    </div>
  );
};
