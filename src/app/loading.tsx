import { Loader, Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center ">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingPage;
