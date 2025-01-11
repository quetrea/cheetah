"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { useDuplicateTaskModal } from "../hooks/use-duplicate-task-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";
import { DuplicateTaskFormWrapper } from "./duplicate-task-form-wrapper";

export const DuplicateTaskModal = () => {
  const { taskId, close } = useDuplicateTaskModal();

  console.log("Current taskId:", taskId); // taskId'yi kontrol edin

  if (!taskId) {
    console.log("No task ID provided");
    return null; // Eğer taskId yoksa modalı render etmeyin
  }

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      <DuplicateTaskFormWrapper onCancel={close} duplicatedTaskId={taskId} />
    </ResponsiveModal>
  );
};
