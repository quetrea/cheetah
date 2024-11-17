import { useCreateSubTask } from "@/features/subtasks/api/use-create-subtask";
import { useGetSubTasks } from "@/features/subtasks/api/use-get-subtasks";
import { useUpdateSubTask } from "@/features/subtasks/api/use-update-subtasks";
import { useCallback, useEffect, useState } from "react";
import { Task } from "../../tasks/types";
import { Button } from "@/components/ui/button";
import { CheckIcon, PlusIcon, Trash, XIcon } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TaskProgress } from "../../tasks/components/task-progress";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useDeleteSubTask } from "@/features/subtasks/api/use-delete-subtask";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateTask } from "@/features/tasks/api/use-update-task";
import { TaskStatus } from "@/features/tasks/types";

interface SubTaskProps {
  task: Task;
}
interface LocalSubTaskState {
  [key: string]: boolean; // subtask id -> completed state
}

export const SubTasks = ({ task }: SubTaskProps) => {
  const {
    data: subTasks,
    isLoading: subTasksLoading,
    error,
  } = useGetSubTasks({
    taskId: task.$id,
    workspaceId: task.workspaceId,
  });
  const { mutate: createSubTask } = useCreateSubTask();
  const { mutate: updateSubTask } = useUpdateSubTask({
    showSuccessToast: false,
    showErrorToast: false,
  });
  const { mutate: deleteSubTask } = useDeleteSubTask();
  const { mutate: updateTask } = useUpdateTask({ showSuccessToast: false });
  const [isCreating, setIsCreating] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [localCompletionState, setLocalCompletionState] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (subTasks?.documents) {
      const initialState = subTasks.documents.reduce(
        (acc, subtask) => ({
          ...acc,
          [subtask.$id]: subtask.completed,
        }),
        {}
      );
      setLocalCompletionState(initialState);
    }
  }, [subTasks?.documents]);

  const handleCompletionChange = useCallback(
    async (subtaskId: string, checked: boolean) => {
      const subtask = subTasks?.documents.find((st) => st.$id === subtaskId);
      if (!subtask) return;

      setLocalCompletionState((prev) => ({
        ...prev,
        [subtaskId]: checked,
      }));

      try {
        await updateSubTask({
          json: {
            workspaceId: task.workspaceId,
            title: subtask.title,
            completed: checked,
          },
          param: {
            subTaskId: subtaskId,
          },
        });

        const updatedCompletionState = {
          ...localCompletionState,
          [subtaskId]: checked,
        };

        const allSubtasksCompleted = subTasks?.documents.every(
          (st) => updatedCompletionState[st.$id] ?? st.completed
        );

        if (allSubtasksCompleted) {
          updateTask({
            json: { status: TaskStatus.DONE },
            param: { taskId: task.$id },
          });
        } else {
          updateTask({
            json: { status: TaskStatus.IN_PROGRESS },
            param: { taskId: task.$id },
          });
        }
      } catch (error) {
        setLocalCompletionState((prev) => ({
          ...prev,
          [subtaskId]: !checked,
        }));
        toast.error("Failed to update task status");
      }
    },
    [
      subTasks?.documents,
      task.workspaceId,
      task.$id,
      updateSubTask,
      updateTask,
      localCompletionState,
    ]
  );

  const handleEdit = useCallback(
    async (subtaskId: string, newTitle: string) => {
      const subtask = subTasks?.documents.find((st) => st.$id === subtaskId);
      if (!subtask) return;

      try {
        await updateSubTask({
          json: {
            workspaceId: task.workspaceId,
            title: newTitle.trim(),
            completed: subtask.completed,
          },
          param: {
            subTaskId: subtaskId,
          },
        });
        setEditingSubTaskId(null);
        setEditedTitle("");
      } catch (error) {
        toast.error("Failed to update task title");
      }
    },
    [subTasks?.documents, updateSubTask, task.workspaceId]
  );

  const handleCreateSubTask = () => {
    if (newSubTaskTitle.trim()) {
      createSubTask(
        {
          json: {
            title: newSubTaskTitle.trim(),
            taskId: task.$id,
            projectId: task.projectId,
            workspaceId: task.workspaceId,
            creatorId: task.assigneeId,
            completed: false,
          },
        },
        {
          onSuccess: () => {
            setNewSubTaskTitle("");
            setIsCreating(false);
          },
        }
      );
    }
  };

  const handleDeleteSubTask = (subTaskId: string) => {
    deleteSubTask({
      json: {
        workspaceId: task.workspaceId,
      },
      param: {
        subTaskId: subTaskId,
      },
    });
  };
  return (
    <div className="dark:bg-neutral-900 hover:bg-neutral-100 p-4  rounded-md">
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium">Sub Tasks</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCreating(true)}
          className={cn(
            "hover:bg-neutral-100 dark:hover:bg-neutral-800",
            isCreating && "hidden"
          )}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <DottedSeparator className="my-4" />

      <div className="flex flex-col gap-y-2 justify-between">
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col">
            {subTasksLoading ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-[70%]" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
                <div className="mt-6">
                  <Skeleton className="h-4 w-[100%]" />
                  <div className="mt-2">
                    <Skeleton className="h-2 w-[60%]" />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-y-2">
              <AnimatePresence mode="popLayout">
                {subTasks?.documents
                  .slice()
                  .reverse()
                  .map((subtask) => (
                    <motion.div
                      key={subtask.$id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-x-2 p-2 border-2 hover:opacity-75 cursor-pointer rounded-lg group relative"
                    >
                      <Checkbox
                        checked={
                          localCompletionState[subtask.$id] ?? subtask.completed
                        }
                        onCheckedChange={(checked) => {
                          if (typeof checked === "boolean") {
                            handleCompletionChange(subtask.$id, checked);
                          }
                        }}
                      />

                      {editingSubTaskId === subtask.$id ? (
                        <div className="flex-1 flex items-center gap-x-2 p-0">
                          <Input
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="text-sm border-none py-0"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && editedTitle.trim()) {
                                handleEdit(subtask.$id, editedTitle);
                              }
                              if (e.key === "Escape") {
                                setEditingSubTaskId(null);
                                setEditedTitle("");
                              }
                            }}
                          />
                          <div className="flex items-center gap-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                handleEdit(subtask.$id, editedTitle)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setEditingSubTaskId(null);
                                setEditedTitle("");
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-between">
                          <div
                            onClick={() => {
                              setEditingSubTaskId(subtask.$id);
                              setEditedTitle(subtask.title);
                            }}
                            className={cn(
                              "flex-1 text-sm px-3 py-2",
                              (localCompletionState[subtask.$id] ??
                                subtask.completed) &&
                                "line-through text-muted-foreground"
                            )}
                          >
                            {subtask.title}
                          </div>
                          <Button
                            onClick={() => handleDeleteSubTask(subtask.$id)}
                            className="hidden group-hover:flex"
                            variant="ghost"
                            size="icon"
                          >
                            <Trash className="size-4 text-muted-foreground hover:text-red-500 transition-colors" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}

                {isCreating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-y-2"
                  >
                    <div className="flex items-center gap-x-2 p-4 py-2">
                      <Checkbox checked={false} disabled />
                      <input
                        type="text"
                        className="flex-1 bg-transparent text-sm border-none focus:outline-none"
                        placeholder="Add subtask..."
                        value={newSubTaskTitle}
                        onChange={(e) => setNewSubTaskTitle(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSubTaskTitle.trim()) {
                            handleCreateSubTask();
                          }
                          if (e.key === "Escape") {
                            setIsCreating(false);
                            setNewSubTaskTitle("");
                          }
                        }}
                      />

                      <div className="flex items-center gap-x-2">
                        {newSubTaskTitle.trim() && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCreateSubTask}
                            className="h-8 w-8 md:h-4 md:w-4 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <CheckIcon className="h-4 w-4 md:h-3 md:w-3" />
                          </Button>
                        )}

                        <div className="flex items-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setIsCreating(false);
                              setNewSubTaskTitle("");
                            }}
                            className="h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>

                          <span className="hidden md:inline-flex items-center text-xs text-muted-foreground whitespace-nowrap">
                            Press{" "}
                            <kbd className="px-1 mx-1 bg-neutral-100 dark:bg-neutral-800 rounded">
                              Enter
                            </kbd>{" "}
                            to save,{" "}
                            <kbd className="px-1 mx-1 bg-neutral-100 dark:bg-neutral-800 rounded">
                              Esc
                            </kbd>{" "}
                            to cancel
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="text-red-500 text-center py-4">
                {!subTasks?.documents.length && !isCreating && (
                  <div className="text-md text-muted-foreground text-center py-2">
                    No subtasks yet or not yet set
                  </div>
                )}
              </div>
            </div>
          </div>
          {subTasks && subTasks.total > 0 && (
            <div className="flex justify-end mt-auto">
              <div className="w-full p-4">
                <TaskProgress
                  subtasks={subTasks.documents.map((st) => ({
                    ...st,
                    completed: localCompletionState[st.$id] ?? st.completed,
                  }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
