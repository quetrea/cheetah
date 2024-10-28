"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { EditTaskFormWrapper } from "../edit-task-form-wrapper";
import { useEditTaskModal } from "../../hooks/use-edit-task-modal";
import { useUpdateTaskModal } from "../../hooks/use-update-task-property-modal";
import { UpdateTaskForm } from "./update-task-form";

export const UpdateTaskModal = () => {
  const { value, close, taskId } = useUpdateTaskModal();

  return (
    <ResponsiveModal open={!!value} onOpenChange={close}>
      {value && taskId && (
        <UpdateTaskForm
          taskId={taskId}
          onCancel={close}
          type={
            value as "name" | "status" | "projectId" | "dueDate" | "priority"
          }
        />
      )}
    </ResponsiveModal>
  );
};
