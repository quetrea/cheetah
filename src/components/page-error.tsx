import { AlertTriangle, Loader2 } from "lucide-react";

interface ErrorPageProps {
  message?: string;
}

export const PageError = ({
  message = "Something went wrong",
}: ErrorPageProps) => {
  return (
    <div className="flex flex-col items-center gap-y-4 justify-center h-screen">
      <AlertTriangle className="size-6 animate-spin text-muted-foreground" />
      <p className="text-sm  font-medium text-muted-foreground">{message}</p>
    </div>
  );
};
