"use client";
import { useUpdateTask } from "@/features/tasks/api/use-update-task";
import { Task } from "@/features/tasks/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CustomTaskPropertyChangeProps {
  type: "name" | "status" | "projectId" | "dueDate" | "priority";
  changeValue?: string;
  workspaceId?: string;
  taskId: string;
}

export const useCustomTaskPropertyChange = ({
  type,
  changeValue,
  taskId,
}: CustomTaskPropertyChangeProps) => {
  const router = useRouter();
  const [value, setValue] = useState(changeValue);
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate(
      {
        json: { [type]: value },
        param: { taskId: taskId },
      },
      {
        onSuccess: () => {
          toast.success("Succesfully task name changed.");
          router.refresh();
        },
      }
    );
  };

  return {
    value,
    setValue,
    handleSave,
    isPending,
  };
};
