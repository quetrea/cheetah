import { Models } from "node-appwrite";

export type User = Models.Document & {
  name: string;
  id: string;
};
