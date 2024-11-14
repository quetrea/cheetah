import { z } from "zod";

export const createSubTask = z.object({
  title: z.string().min(1, "Title is required"),
  taskId: z.string().min(1, "Task ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
  creatorId: z.string().min(1, "Creator ID is required"),
  completed: z.boolean().default(false),
});

export const updateSubTask = z.object({
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().default(false),
});
