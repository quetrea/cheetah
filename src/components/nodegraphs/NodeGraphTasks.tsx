"use client";
import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import { motion } from "framer-motion";
import { Task } from "@/features/tasks/types";
import { SubTask } from "@/features/subtasks/types";
import { useGetSubTaskByTaskId } from "@/features/subtasks/api/use-get-subtask-bytaskId";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { useTranslation } from "react-i18next";

type NodeGraphProps = {
  task: Task; // Burada task verilerinizi geçin
  taskId: string;
};

export const NodeGraphTasks = ({ task, taskId }: NodeGraphProps) => {
  const { t } = useTranslation();
  const { data: subTasks } = useGetSubTaskByTaskId({
    taskId: taskId,
  });

  const Skeletons = () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} style={{ height: "50px", margin: "10px 0" }} />
      ))}
    </div>
  );

  if (!subTasks) {
    return <Skeletons />;
  }

  const nodes = subTasks.documents.map((subtask, index) => ({
    id: subtask.$id,

    data: {
      label: subtask.title,
      schema: [{ title: "id", type: "uuid" }],
    },
    style: { borderRadius: "36px", fontSize: "8px" },
    position: { x: 170 * index, y: 150 },
  }));

  const edges = subTasks.documents.reverse().map((subtask) => ({
    id: `${subtask.$id}`,
    source: task.$id, // Ana görev ID'si
    type: "bezier",
    target: subtask.$id,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-hidden border rounded-lg p-6 flex flex-col gap-y-4"
      // Kapsayıcı stil
    >
      <div className="flex gap-2 items-center">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          {t("tasks.task-graph.title")}
        </h2>
        <HoverCard>
          <HoverCardTrigger>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              <div className="px-2 py-1 text-[10px] font-medium rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 cursor-pointer">
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {t("tasks.new")}
                </span>
              </div>
            </motion.div>
          </HoverCardTrigger>
        </HoverCard>
      </div>
      {nodes && nodes.length === 0 && (
        <div className="text-sm text-muted-foreground">
          {t("tasks.task-graph.no-task")}
        </div>
      )}
      <div className="h-full border rounded-lg">
        <ReactFlow
          nodes={[
            ...nodes,
            {
              id: task.$id,
              style: {
                borderRadius: "20px",
                fontSize: "12px",
                width: "200px",
                textAlign: "center",
                justifyItems: "center",
                display: "flex",
                alignItems: "center",
              },
              data: { label: task.name },
              position: { x: 0, y: 0 },
            },
          ]} // Ana görev düğümünü ekleyin
          edges={edges}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </motion.div>
  );
};
