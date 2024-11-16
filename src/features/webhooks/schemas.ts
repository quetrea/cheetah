import { z } from "zod";
import { WebhookEvent } from "./types";

export const createWebhookSchema = z.object({
  workspaceId: z.string(),
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
  events: z.array(z.nativeEnum(WebhookEvent)),
  secret: z.string().min(16, "Secret must be at least 16 characters"),
  isActive: z.boolean().default(true),
});

// Webhook güncelleme şeması
export const updateWebhookSchema = z.object({
  workspaceId: z.string(),
  name: z.string().min(1, "Name is required").optional(),
  url: z.string().url("Must be a valid URL").optional(),
  events: z.array(z.nativeEnum(WebhookEvent)).optional(),
  isActive: z.boolean().optional(),
});
