import { sessionMiddleware } from "@/lib/session-Middleware";
import { Hono } from "hono";
import { createLabelSchema, updateLabelSchema } from "../schemas";
import { zValidator } from "@hono/zod-validator";
import {
  DATABASE_ID,
  LABELS_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { Task } from "@/features/tasks/types";
import { getMember } from "@/features/members/utils";
import { error } from "console";
import { Workspace } from "@/features/workspaces/types";
import { Project } from "@/features/projects/types";
import { Member } from "@/features/members/types";
import { Label } from "../types";
import { z } from "zod";

const app = new Hono()
  .get("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!currentMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      task.workspaceId
    );

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );

    const member = await databases.getDocument<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    );

    const labels = await databases.listDocuments(DATABASE_ID, LABELS_ID, [
      Query.equal("taskId", task.$id),
    ]);

    if (!labels) {
      return c.json({ error: "This task has no tags defined yet." }, 401);
    }

    const label = await databases.getDocument<Label>(
      DATABASE_ID,
      LABELS_ID,
      labels.documents[0].$id
    );

    if (!label) {
      return c.json({ error: "Label not found" }, 404);
    }

    return c.json({ data: { ...member, project, workspace, label } });
  })
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ taskId: z.string() })),
    async (c) => {
      const databases = c.get("databases");

      const { taskId } = c.req.valid("query");

      const labels = await databases.listDocuments<Label>(
        DATABASE_ID,
        LABELS_ID,
        [Query.equal("taskId", taskId)]
      );

      if (!labels) {
        return c.json({ error: "This task has no tags defined yet." }, 401);
      }

      return c.json({ data: { labels } });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createLabelSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { label, taskId, projectId, workspaceId } = c.req.valid("json");
      const currentMember = await getMember({
        databases,
        workspaceId: workspaceId,
        userId: user.$id,
      });

      if (!currentMember) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const labelCreate = await databases.createDocument<Label>(
        DATABASE_ID,
        LABELS_ID,
        ID.unique(),
        {
          taskId,
          label,
          projectId,
          workspaceId,
        }
      );

      return c.json({ data: labelCreate });
    }
  )
  .patch(
    "/:labelId",
    sessionMiddleware,
    zValidator("json", updateLabelSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { label, workspaceId } = c.req.valid("json");
      const { labelId } = c.req.param();
      const currentMember = await getMember({
        databases,
        workspaceId: workspaceId,
        userId: user.$id,
      });

      if (!currentMember) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const labelupdate = await databases.updateDocument<Label>(
        DATABASE_ID,
        LABELS_ID,
        labelId,
        {
          label,
        }
      );

      return c.json({ data: labelupdate });
    }
  );

export default app;
