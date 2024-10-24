import { Models } from "node-appwrite";

export enum PlanType {
  FREE = "free",
  PREMIUM = "premium",
}

export type Plan = Models.Document & {
  userId: string;
  planType: PlanType;
  startDate: string;
  endDate?: string;
};
