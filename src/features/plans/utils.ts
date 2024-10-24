import { Query, type Databases } from "node-appwrite";

import { DATABASE_ID, PLANS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Plan } from "./types";

interface GetPlanProps {
  userId: string;
}

export const getPlan = async ({ userId }: GetPlanProps) => {
  const { databases } = await createSessionClient();
  const plans = await databases.listDocuments<Plan>(DATABASE_ID, PLANS_ID, [
    Query.equal("userId", userId),
  ]);

  return plans.documents[0];
};
