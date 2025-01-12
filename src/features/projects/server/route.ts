import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { getMember } from "@/features/members/utils";

import { sessionMiddleware } from "@/lib/session-Middleware";

import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  PROJECTS_ID,
  SUBTASKS_ID,
  TASKS_ID,
  WEBHOOKS_ID,
} from "@/config";
import { createProjectSchema, updateProjectSchema } from "../schemas";

import { Project } from "../types";
import { Task, TaskStatus } from "@/features/tasks/types";
import { Webhook, WebhookEvent } from "@/features/webhooks/types";
import { sendDiscordWebhook } from "@/lib/webhook";
import { SubTask } from "@/features/subtasks/types";



const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId: workspaceId,
        }
      );

      const webhooks = await databases.listDocuments<Webhook>(
        DATABASE_ID,
        WEBHOOKS_ID,
        [Query.equal("workspaceId", workspaceId)]
      );

      const activeWebhooks = webhooks.documents.filter(
        (webhook) =>
          webhook.isActive &&
          webhook.events.includes(WebhookEvent.PROJECT_CREATED)
      );

      await Promise.allSettled(
        activeWebhooks.map(async (webhook) => {
          try {
            await sendDiscordWebhook(webhook, {
              title: "Project Created",
              description: `New project "${project.name}" has been created`,
              fields: [
                { name: "Created By", value: user.email, inline: true },
                { name: "Project ID", value: project.$id, inline: true },
              ],
              color: 0x10b981, // Yeşil
            });
          } catch (error) {
            console.error(`Webhook delivery failed for ${webhook.url}:`, error);
          }
        })
      );

      return c.json({ data: project });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) {
        return c.json({ error: "Missing workspace" }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return c.json({ data: projects });
    }
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: project });
  })
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | null = existingProject.imageUrl;
      let imageId: string | null = existingProject.imageId;

      if (image === "undefined") {
        if (existingProject.imageId) {
          await storage.deleteFile(IMAGES_BUCKET_ID, existingProject.imageId);
        }
        uploadedImageUrl = null;
        imageId = null;
      } else if (image instanceof File) {
        if (existingProject.imageId) {
          await storage.deleteFile(IMAGES_BUCKET_ID, existingProject.imageId);
        }
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );
        imageId = file.$id;
        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImageUrl,
          imageId: imageId,
        }
      );

      const webhooks = await databases.listDocuments<Webhook>(
        DATABASE_ID,
        WEBHOOKS_ID,
        [Query.equal("workspaceId", existingProject.workspaceId)]
      );

      const activeWebhooks = webhooks.documents.filter(
        (webhook) =>
          webhook.isActive &&
          webhook.events.includes(WebhookEvent.PROJECT_UPDATED)
      );

      await Promise.allSettled(
        activeWebhooks.map(async (webhook) => {
          try {
            await sendDiscordWebhook(webhook, {
              title: "Project Updated",
              description: `Project "${project.name}" has been updated`,
              fields: [
                { name: "Updated By", value: user.email, inline: true },
                { name: "Project ID", value: project.$id, inline: true },
              ],
              color: 0x3b82f6, // Mavi
            });
          } catch (error) {
            console.error(`Webhook delivery failed for ${webhook.url}:`, error);
          }
        })
      );

      return c.json({ data: project });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", existingProject.$id),
    ]);

    for (const task of tasks.documents) {
      const subtasks = await databases.listDocuments<SubTask>(
        DATABASE_ID,
        SUBTASKS_ID,
        [Query.equal("taskId", task.$id)]
      );

      for (const subtask of subtasks.documents) {
        await databases.deleteDocument(DATABASE_ID, SUBTASKS_ID, subtask.$id);
      }

      await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    const webhooks = await databases.listDocuments<Webhook>(
      DATABASE_ID,
      WEBHOOKS_ID,
      [Query.equal("workspaceId", existingProject.workspaceId)]
    );

    const activeWebhooks = webhooks.documents.filter(
      (webhook) =>
        webhook.isActive &&
        webhook.events.includes(WebhookEvent.PROJECT_DELETED)
    );

    await Promise.allSettled(
      activeWebhooks.map(async (webhook) => {
        try {
          await sendDiscordWebhook(webhook, {
            title: "Project Deleted",
            description: `Project "${existingProject.name}" has been deleted`,
            fields: [
              { name: "Deleted By", value: user.email, inline: true },
              { name: "Project ID", value: projectId, inline: true },
              {
                name: "Tasks Deleted",
                value: tasks.total.toString(),
                inline: true,
              },
            ],
            color: 0xdc2626, // Kırmızı
          });
        } catch (error) {
          console.error(`Webhook delivery failed for ${webhook.url}:`, error);
        }
      })
    );

    return c.json({ data: { $id: projectId } });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const TaskCount = thisMonthTasks.total;
    const TaskDifferent = TaskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const AssignedTaskCount = thisMonthAssignedTasks.total;
    const AssignedTaskDifference =
      AssignedTaskCount - lastMonthAssignedTasks.total;

    const thisMonthInCompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthInCompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const InCompleteTaskCount = thisMonthInCompleteTasks.total;
    const InCompleteTaskDifference =
      InCompleteTaskCount - lastMonthInCompleteTasks.total;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const CompletedTaskCount = thisMonthCompletedTasks.total;
    const CompletedTaskDifference =
      CompletedTaskCount - lastMonthCompletedTasks.total;

    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const OverdueTaskCount = thisMonthOverdueTasks.total;
    const OverdueTaskDifference =
      CompletedTaskCount - lastMonthOverdueTasks.total;

    // Tüm görevleri al
    const allTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [Query.equal("projectId", projectId)]
    );

    // Görevlerin oluşturulma tarihlerine göre gruplandırma
    const tasksByCreationDate: { 
      date: string; 
      tasks: Array<{
        id: string;
        name: string;
        status: TaskStatus;
        createdAt: string;
      }>;
    }[] = [];
    
    // Tamamlanan görevlerin tarihlerine göre gruplandırma
    const tasksByCompletionDate: { 
      date: string; 
      tasks: Array<{
        id: string;
        name: string;
        completedAt: string;
      }>;
    }[] = [];

    const creationDateMap = new Map<string, typeof tasksByCreationDate[0]['tasks']>();
    const completionDateMap = new Map<string, typeof tasksByCompletionDate[0]['tasks']>();

    allTasks.documents.forEach(task => {
      // Oluşturulma tarihi için
      const creationDate = new Date(task.$createdAt).toISOString().split('T')[0];
      const creationTasks = creationDateMap.get(creationDate) || [];
      creationTasks.push({
        id: task.$id,
        name: task.name,
        status: task.status,
        createdAt: task.$createdAt,
      });
      creationDateMap.set(creationDate, creationTasks);

      // Tamamlanma tarihi için (eğer görev tamamlanmışsa)
      if (task.status === TaskStatus.DONE && task.completedAt) {
        const completionDate = new Date(task.completedAt).toISOString().split('T')[0];
        const completionTasks = completionDateMap.get(completionDate) || [];
        completionTasks.push({
          id: task.$id,
          name: task.name,
          completedAt: task.completedAt,
        });
        completionDateMap.set(completionDate, completionTasks);
      }
    });

    // Map'leri dizilere dönüştür
    creationDateMap.forEach((tasks, date) => {
      tasksByCreationDate.push({ date, tasks });
    });
    completionDateMap.forEach((tasks, date) => {
      tasksByCompletionDate.push({ date, tasks });
    });

    // Tarihe göre sırala
    tasksByCreationDate.sort((a, b) => a.date.localeCompare(b.date));
    tasksByCompletionDate.sort((a, b) => a.date.localeCompare(b.date));

    return c.json({
      data: {
        TaskCount,
        TaskDifferent,
        AssignedTaskCount,
        AssignedTaskDifference,
        CompletedTaskCount,
        CompletedTaskDifference,
        InCompleteTaskCount,
        InCompleteTaskDifference,
        OverdueTaskCount,
        OverdueTaskDifference,
        taskCreationHistory: tasksByCreationDate,
        taskCompletionHistory: tasksByCompletionDate,
      },
    });
  });

export default app;
