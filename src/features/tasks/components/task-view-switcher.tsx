"use client";
import { useQueryState } from "nuqs";
import { Loader2, PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DataTable } from "./data-table";
import { columns } from "./columns";

import { useGetTasks } from "../api/use-get-tasks";
import { DataFilter } from "./data-filters";
import { useTasksFilters } from "../hooks/use-task-filters";
import { DataKanban } from "./data-kanban";
import { useCallback } from "react";
import { TaskStatus } from "../types";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";

import { DataCalendar } from "./data-calendar";
import { useProjectId } from "@/features/projects/hooks/use-task-id";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

// Create Skeleton components
const TableSkeleton = () => (
  <div className="space-y-4">
    {/* Header Skeleton */}
    <div className="flex items-center space-x-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-[100px]" />
      ))}
    </div>

    {/* Rows Skeleton */}
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-4 w-[20px]" /> {/* Checkbox */}
        <Skeleton className="h-4 w-[200px]" /> {/* Name */}
        <Skeleton className="h-4 w-[150px]" /> {/* Project */}
        <Skeleton className="h-4 w-[120px]" /> {/* Assignee */}
        <Skeleton className="h-4 w-[100px]" /> {/* Due Date */}
        <Skeleton className="h-4 w-[80px]" /> {/* Status */}
        <Skeleton className="h-4 w-[100px]" /> {/* Labels */}
        <Skeleton className="h-4 w-[80px]" /> {/* Priority */}
      </div>
    ))}
  </div>
);

const KanbanSkeleton = () => (
  <div className="flex gap-x-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="w-[300px] space-y-4">
        <Skeleton className="h-8 w-full" /> {/* Column Header */}
        {Array.from({ length: 3 }).map((_, j) => (
          <Skeleton
            key={j}
            className="h-[120px] w-full rounded-lg"
          /> /* Cards */
        ))}
      </div>
    ))}
  </div>
);

const CalendarSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-[200px]" /> {/* Month/Year */}
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-[80px]" /> {/* Navigation buttons */}
        <Skeleton className="h-8 w-[80px]" />
      </div>
    </div>
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <Skeleton key={i} className="h-[100px] w-full" /> /* Calendar cells */
      ))}
    </div>
  </div>
);

const FiltersSkeleton = () => (
  <div className="flex flex-wrap gap-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-9 w-[150px]" />
    ))}
  </div>
);

export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const [{ status, assigneeId, projectId, dueDate, priority }] =
    useTasksFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();
  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId: paramProjectId || projectId,
    assigneeId,
    status,
    dueDate,
    priority,
  });

  const createNewTaskHandler = () => {
    open();
  };

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({ json: { tasks } });
    },
    [bulkUpdate]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const renderContent = () => {
    if (isLoadingTasks) {
      return (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {view === "table" && <TableSkeleton />}
          {view === "kanban" && <KanbanSkeleton />}
          {view === "calendar" && <CalendarSkeleton />}
        </motion.div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {view === "table" && (
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
          )}
          {view === "kanban" && (
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                onChange={onKanbanChange}
                data={tasks?.documents ?? []}
              />
            </TabsContent>
          )}
          {view === "calendar" && (
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <motion.div
        className="h-full flex flex-col overflow-auto p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col gap-y-2 lg:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => createNewTaskHandler()}
              className="w-full lg:w-auto"
              size={"sm"}
            >
              <PlusIcon className="size-4 mr-2" />
              New
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DottedSeparator className="my-4" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DataFilter hideProjectFilter={hideProjectFilter} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DottedSeparator className="my-4" />
        </motion.div>

        {renderContent()}
      </motion.div>
    </Tabs>
  );
};
