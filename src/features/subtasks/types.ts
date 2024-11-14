import { Models } from "node-appwrite";

export type SubTask = Models.Document & {
  title: string;
  taskId: string;
  projectId: string;
  workspaceId: string;
  creatorId: string;
  description?: string;
  completed: boolean;
};
