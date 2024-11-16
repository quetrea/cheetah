import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ID, Query } from "node-appwrite";
import { sessionMiddleware } from "@/lib/session-Middleware";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, WEBHOOKS_ID } from "@/config";
import { Webhook, WebhookEvent } from "../types";
import { MemberRole } from "@/features/members/types";
import { createWebhookSchema, updateWebhookSchema } from "../schemas";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      try {
        const user = c.get("user");
        const databases = c.get("databases");
        const { workspaceId } = c.req.valid("query");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member || member.role !== MemberRole.ADMIN) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const webhooks = await databases.listDocuments<Webhook>(
          DATABASE_ID,
          WEBHOOKS_ID,
          [Query.equal("workspaceId", workspaceId)]
        );

        return c.json({ data: webhooks });
      } catch (error) {
        console.error("Webhooks fetch error:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createWebhookSchema),
    async (c) => {
      try {
        const user = c.get("user");
        const databases = c.get("databases");
        const { workspaceId, name, url, events, secret } = c.req.valid("json");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const webhook = await databases.createDocument<Webhook>(
          DATABASE_ID,
          WEBHOOKS_ID,
          ID.unique(),
          {
            workspaceId,
            name,
            url,
            events,
            secret,
            isActive: true,
          }
        );

        return c.json({ data: webhook });
      } catch (error) {
        console.error("Webhook creation error:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .patch(
    "/:webhookId",
    sessionMiddleware,
    zValidator("json", updateWebhookSchema),
    async (c) => {
      try {
        const user = c.get("user");
        const databases = c.get("databases");
        const { webhookId } = c.req.param();
        const { workspaceId, ...updateData } = c.req.valid("json");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const webhook = await databases.updateDocument<Webhook>(
          DATABASE_ID,
          WEBHOOKS_ID,
          webhookId,
          updateData
        );

        return c.json({ data: webhook });
      } catch (error) {
        console.error("Webhook update error:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .delete(
    "/:webhookId",
    sessionMiddleware,
    zValidator("json", z.object({ workspaceId: z.string() })),
    async (c) => {
      try {
        const user = c.get("user");
        const databases = c.get("databases");
        const { webhookId } = c.req.param();
        const { workspaceId } = c.req.valid("json");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        await databases.deleteDocument(DATABASE_ID, WEBHOOKS_ID, webhookId);

        return c.json({ success: true });
      } catch (error) {
        console.error("Webhook deletion error:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  );

export default app;
