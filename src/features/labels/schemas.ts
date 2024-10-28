import { z } from "zod";

export const createLabelSchema = z.object({
  label: z.string().min(1, "Required"),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  taskId: z.string().trim().min(1, "Required"),
});

export const updateLabelSchema = z.object({
  label: z.string().min(1, "Required"),
  workspaceId: z.string().trim().min(1, "Required"),
});
