"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, Trash } from "lucide-react";
import React from "react";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { useGetTask } from "../api/use-get-task";
import { useTranslation } from "react-i18next";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const { t } = useTranslation();
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data } = useGetTask({ taskId: id });
  const { open } = useEditTaskModal();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This action cannot be undone.",
    "destructive"
  );
  const { mutate: taskDelete, isPending: isDeleting } = useDeleteTask();

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    if (!data) {
      return null;
    }

    taskDelete({ param: { taskId: data?.$id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };
  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            {t("task_actions.details.title")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            {t("task_actions.open.title")}
          </DropdownMenuItem>
          {data?.$id === id ? (
            <DropdownMenuItem
              onClick={() => open(data?.$id)}
              className="font-medium p-[10px]"
            >
              <PencilIcon className="size-4 mr-2 stroke-2" />
              {t("task_actions.edit.title")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => open(id)}
              className="font-medium p-[10px]"
            >
              <PencilIcon className="size-4 mr-2 stroke-2" />
              {t("task_actions.edit.title")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <Trash className="size-4 mr-2 stroke-2" />
            {t("task_actions.delete.title")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
