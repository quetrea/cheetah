import { Button } from "@/components/ui/button";
import { Task, TaskStatus } from "../types";
import { PencilIcon, PlusIcon, CheckIcon, XIcon } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { OverviewProperty } from "./overview-property";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { useGetLabels } from "@/features/labels/api/use-get-labels";

import { useCreateLabelModal } from "@/features/labels/hooks/use-create-label-modal";
import { useUpdateLabelModal } from "@/features/labels/hooks/use-update-label-modal";
import { Hint } from "@/components/hint";
import { format } from "date-fns";
import { TaskOverviewSkeleton } from "./skeletons/task-overview-skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();

  const { data, isLoading } = useGetLabels({ taskId: task.$id });
  const { open: createModal, setProjectId } = useCreateLabelModal();
  const { open: updateModal, setLabelId } = useUpdateLabelModal();

  const handleCreate = async () => {
    setProjectId(task.projectId);
    createModal();
  };

  const handleUpdate = async (id: string) => {
    setLabelId(id);
    updateModal();
  };

  if (isLoading) {
    return <TaskOverviewSkeleton />;
  }

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardAnimation = {
    hover: {
      boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
      scale: 1.005,
    },
  };

  const innerCardHover = {
    y: -1,
  };

  const itemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-y-4 col-span-1 select-none"
    >
      <motion.div
        whileHover={cardAnimation.hover}
        transition={{ duration: 0.2 }}
        className="bg-neutral-100/50 dark:bg-neutral-900/50 h-full rounded-xl p-4 space-y-4 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <motion.div
            variants={itemAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Overview
            </p>
            <Badge
              variant="outline"
              className="text-xs font-normal bg-neutral-200/50 dark:bg-neutral-800/50"
            >
              Task Info
            </Badge>
          </motion.div>
          <Button
            onClick={() => open(task.$id)}
            size="sm"
            variant="secondary"
            className="bg-neutral-200/80 hover:bg-neutral-300/80 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80"
          >
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>

        <DottedSeparator className="my-4 opacity-50" />

        <div className="flex lg:flex-col xl:flex-row flex-col gap-4">
          <motion.div className="flex flex-col flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="overview">Details</Badge>
              <span className="bg-neutral-200/30 dark:bg-neutral-800/30 px-2 py-1 rounded-md text-xs text-neutral-600 dark:text-neutral-400">
                Task Details
              </span>
            </div>
            <motion.div
              className="p-4 flex flex-col gap-y-4 border border-neutral-200/50 dark:border-neutral-800/50 rounded-lg bg-neutral-100/50 dark:bg-neutral-900/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors"
              whileHover={innerCardHover}
            >
              <OverviewProperty label="Assignee">
                <MemberAvatar name={task.assignee.name} className="size-6" />
                <p className="text-sm font-medium">{task.assignee.name}</p>
              </OverviewProperty>
              <OverviewProperty label="Created At">
                <div className="text-sm text-blue-500">
                  {format(task.$createdAt, "PPP")}
                </div>
              </OverviewProperty>
              <OverviewProperty label="End Date">
                <TaskDate
                  compeleted={task.status === TaskStatus.DONE}
                  value={task.dueDate}
                  className="text-sm font-medium"
                />
              </OverviewProperty>
              <OverviewProperty label="Status">
                <Badge variant={task.status}>
                  {snakeCaseToTitleCase(task.status)}
                </Badge>
              </OverviewProperty>
              <OverviewProperty label="Priority">
                <Badge variant={task.priority}>
                  {snakeCaseToTitleCase(task.priority)}
                </Badge>
              </OverviewProperty>
            </motion.div>
          </motion.div>

          {/* <DottedSeparator className="py-7 hidden sm:block xs:block md:block lg:block xl:hidden opacity-50" />
          <DottedSeparator
            direction="vertical"
            className="px-7 hidden sm:hidden xs:hidden md:hidden lg:hidden xl:block opacity-50"
          /> */}

          {/* <AnimatePresence mode="wait">
            {data && data?.labels.total !== 0 ? (
              <motion.div className="flex flex-col flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="overview">Labels</Badge>
                  <span className="bg-neutral-200/30 dark:bg-neutral-800/30 px-2 py-1 rounded-md text-xs text-neutral-600 dark:text-neutral-400">
                    Task Labels
                  </span>
                </div>
                <motion.div
                  className="p-4 flex flex-col gap-y-4 border border-neutral-200/50 dark:border-neutral-800/50 rounded-lg bg-neutral-100/50 dark:bg-neutral-900/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors"
                  whileHover={innerCardHover}
                >
                  {data.labels.total > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {data.labels.documents.map((item, index) => (
                        <motion.div
                          key={item.$id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge
                            className="cursor-pointer hover:scale-105 transition-transform"
                            variant="default"
                            onClick={() => handleUpdate(item.$id)}
                          >
                            #{item.label}
                          </Badge>
                        </motion.div>
                      ))}
                      <Button
                        onClick={handleCreate}
                        size="smIcon"
                        variant="outline"
                        className="rounded-full hover:scale-110 transition-transform bg-neutral-200/50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700"
                      >
                        <PlusIcon className="size-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div className="flex flex-col flex-1 space-y-4">
                <Badge variant="overview">Create Label</Badge>
                <motion.div
                  className="p-4 flex flex-col gap-y-4 border border-neutral-200/50 dark:border-neutral-800/50 rounded-lg bg-neutral-100/50 dark:bg-neutral-900/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors"
                  whileHover={innerCardHover}
                >
                  <Button
                    onClick={handleCreate}
                    className="hover:scale-[1.02] transition-transform"
                  >
                    <PlusIcon className="size-4 mr-2" />
                    Create a label
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence> */}
        </div>
      </motion.div>
    </motion.div>
  );
};
