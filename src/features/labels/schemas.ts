import { z } from "zod";

export const createLabelSchema = z.object({
  label: z
    .string()
    .min(1, "Required")
    .max(50, "Label must be at most 50 characters long")
    .regex(/^[a-z]+$/, "Label must only contain lowercase letters"),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  taskId: z.string().trim().min(1, "Required"),
});

export const updateLabelSchema = z.object({
  label: z
    .string()
    .min(1, "Required")
    .max(50, "Label must be at most 50 characters long")
    .regex(/^[a-z]+$/, "Label must only contain lowercase letters"),
  workspaceId: z.string().trim().min(1, "Required"),
});
