import { Models } from "node-appwrite";

export enum WebhookEvent {
  TASK_CREATED = "task.created",
  TASK_UPDATED = "task.updated",
  TASK_DELETED = "task.deleted",
  SUBTASK_CREATED = "subtask.created",
  SUBTASK_UPDATED = "subtask.updated",
  SUBTASK_DELETED = "subtask.deleted",
  PROJECT_CREATED = "project.created",
  PROJECT_UPDATED = "project.updated",
  PROJECT_DELETED = "project.deleted",
}

export type Webhook = Models.Document & {
  $id: string;
  workspaceId: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
