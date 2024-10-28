import { useUpdateTaskModal } from "../../hooks/use-update-task-property-modal";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NameColumnProps {
  name: string;
  taskId: string;
}

export const NameColumn = ({ name, taskId }: NameColumnProps) => {
  const { open, setTaskId } = useUpdateTaskModal();
  const handleOpen = (
    type: "name" | "status" | "projectId" | "dueDate" | "priority"
  ) => {
    setTaskId(taskId);
    open(type);
  };
  return (
    <div
      onClick={() => handleOpen("name")}
      className="line-clamp-1 flex items-center gap-x-4 hover:underline cursor-pointer group"
    >
      {name}{" "}
      <Button
        variant={"muted"}
        size={"smIcon"}
        className="rounded-full border shadow-lg dark:bg-neutral-600 border-neutral-500 invisible bg-neutral-500 group-hover:visible"
      >
        <PencilIcon className="size-4 text-neutral-100 dark:text-neutral-950" />
      </Button>
    </div>
  );
};
