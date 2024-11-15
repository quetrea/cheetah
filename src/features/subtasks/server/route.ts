import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-Middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { SubTask } from "../types";
import {
  DATABASE_ID,
  PROJECTS_ID,
  SUBTASKS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { Project } from "@/features/projects/types";
import { Task } from "@/features/tasks/types";
import { Workspace } from "@/features/workspaces/types";
import { createSubTask, updateSubTask } from "../schemas";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        taskId: z.string(),
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      try {
        const user = c.get("user");
        const databases = c.get("databases");
        const { taskId, workspaceId } = c.req.valid("query");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const subtasks = await databases.listDocuments<SubTask>(
          DATABASE_ID,
          SUBTASKS_ID,
          [Query.equal("taskId", taskId), Query.orderDesc("$createdAt")]
        );

        if (subtasks.documents.length === 0) {
          return c.json({
            data: {
              total: 0,
              documents: [],
            },
          });
        }

        const [task, project, workspace] = await Promise.all([
          // Ana task'ı getir
          databases.getDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            subtasks.documents[0].taskId
          ),
          // Projeyi getir
          databases.getDocument<Project>(
            DATABASE_ID,
            PROJECTS_ID,
            subtasks.documents[0].projectId
          ),
          // Workspace'i getir
          databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACES_ID,
            subtasks.documents[0].workspaceId
          ),
        ]);

        // Populate edilmiş subtask'ları oluştur
        const populatedSubTasks = subtasks.documents.map((subtask) => ({
          ...subtask,
          task: {
            $id: task.$id,
            title: task.title,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
          },
          project: {
            $id: project.$id,
            name: project.name,
            imageUrl: project.imageUrl,
          },
          workspace: {
            $id: workspace.$id,
            name: workspace.name,
            imageUrl: workspace.imageUrl,
          },
        }));

        return c.json({
          data: {
            total: subtasks.total,
            documents: populatedSubTasks,
          },
        });
      } catch (error) {
        console.error("Subtasks fetch error:", error);
        return c.json(
          {
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { taskId } = c.req.query();

    const member = await getMember({
      databases,
      workspaceId: user.$id,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const subtasks = await databases.listDocuments<SubTask>(
      DATABASE_ID,
      SUBTASKS_ID,
      [Query.equal("taskId", taskId), Query.orderDesc("$createdAt")]
    );

    return c.json({ data: subtasks });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createSubTask),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { title, taskId, projectId, workspaceId, creatorId, completed } =
        c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const subtask = await databases.createDocument<SubTask>(
        DATABASE_ID,
        SUBTASKS_ID,
        ID.unique(),
        {
          title,
          taskId,
          projectId,
          workspaceId,
          creatorId,
          completed: false,
        }
      );

      return c.json({ data: subtask });
    }
  )
  .patch(
    "/:subTaskId",
    sessionMiddleware,
    zValidator("json", updateSubTask),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { title, completed, workspaceId } = c.req.valid("json");
      const { subTaskId } = c.req.param();

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const subTask = await databases.getDocument<SubTask>(
        DATABASE_ID,
        SUBTASKS_ID,
        subTaskId
      );

      if (!subTask) {
        return c.json({ error: "Subtask not found" }, 404);
      }

      if (completed) {
        if (subTask.completed) {
          return c.json({ error: "Subtask already completed" }, 400);
        }
      }

      const subtask = await databases.updateDocument<SubTask>(
        DATABASE_ID,
        SUBTASKS_ID,
        subTaskId,
        {
          title,
          completed,
        }
      );

      return c.json({ data: subtask });
    }
  )
  .delete(
    "/:subTaskId",
    sessionMiddleware,
    zValidator("json", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { subTaskId } = c.req.param();
      const { workspaceId } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const subTask = await databases.getDocument(
        DATABASE_ID,
        SUBTASKS_ID,
        subTaskId
      );

      if (!subTask) {
        return c.json({ error: "Subtask not found" }, 404);
      }

      await databases.deleteDocument(DATABASE_ID, SUBTASKS_ID, subTask.$id);

      return c.json({ data: subTask });
    }
  );

export default app;
