"use client";

import { motion } from "framer-motion";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { DottedSeparator } from "@/components/dotted-separator";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { TaskDescription } from "@/features/tasks/components/task-description";
import { SubTasks } from "@/features/subtasks/components/sub-tasks";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Task not found" />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <TaskBreadcrumbs project={data.project} task={data} />
      </motion.div>

      <DottedSeparator className="my-6" />

      <motion.div className="flex flex-col gap-4" variants={containerVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div variants={itemVariants} className="w-full">
            <TaskOverview task={data} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SubTasks task={data} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <TaskDescription task={data} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
