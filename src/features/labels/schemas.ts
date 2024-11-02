import { z } from "zod";

export const createLabelSchema = z.object({
  label: z
    .string()
    .min(1, "Required")
    .max(50, "Label must be at most 50 characters long")
    .regex(
      /^[^\s#!@#%]*$/,
      "Label cannot contain spaces or special characters"
    ),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  taskId: z.string().trim().min(1, "Required"),
});

export const updateLabelSchema = z.object({
  label: z
    .string()
    .min(1, "Required")
    .max(50, "Label must be at most 50 characters long")
    .regex(
      /^[^\s#!@#%]*$/,
      "Label cannot contain spaces or special characters"
    ),
  workspaceId: z.string().trim().min(1, "Required"),
});
