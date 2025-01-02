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
      className="line-clamp-1 inline-flex  ml-2 items-center gap-x-4 hover:underline cursor-pointer group"
    >
      {name}{" "}
    </div>
  );
};
