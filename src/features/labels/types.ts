import { Models } from "node-appwrite";

export type Label = Models.Document & {
  taskId: string;
  label: string;
  workspaceId: string;
  projectId: string;
};
