import { sessionMiddleware } from "@/lib/session-Middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createPlanSchema, updatePlanSchema } from "../schemas";
import { z } from "zod";
import { createAdminClient } from "@/lib/appwrite";
import { getPlan } from "../utils";
import { DATABASE_ID, PLANS_ID } from "@/config";
import { Plan, PlanType } from "../types";
import { Query } from "node-appwrite";

const app = new Hono()
  .get("/:userId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const { userId } = c.req.param();

    const currentUserPlan = await getPlan({
      userId: userId,
    });

    const plan = await databases.getDocument<Plan>(
      DATABASE_ID,
      PLANS_ID,
      currentUserPlan.$id
    );

    if (!plan) {
      return c.json({ error: "You dont have a plan!" }, 404);
    }

    return c.json({
      data: {
        plan: plan,
      },
    });
  })
  .patch(
    "/plan/:userId",
    sessionMiddleware,
    zValidator("json", updatePlanSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { userId } = c.req.param();

      const { endDate, startDate, planType } = c.req.valid("json");

      const currentPlan = await getPlan({
        userId: userId,
      });

      const currentPlanData = await databases.getDocument<Plan>(
        DATABASE_ID,
        PLANS_ID,
        currentPlan.$id
      );

      if (!currentPlan) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await databases.updateDocument(
        DATABASE_ID,
        PLANS_ID,
        currentPlanData.$id,
        {
          planType: planType,
          startDate: startDate,
          endDate: endDate,
        }
      );

      return c.json({ data: currentPlanData });
    }
  );

export default app;
