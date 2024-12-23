import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-Middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { Member, MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";

import { Workspace } from "../types";
import { getMember } from "@/features/members/utils";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Task, TaskStatus } from "@/features/tasks/types";
import { Project } from "@/features/projects/types";

// Dosya doğrulama sabitleri
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return c.json({ data: workspace });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        // File type check
        if (!ALLOWED_FILE_TYPES.includes(image.type)) {
          return c.json({ 
            error: "Invalid file type. Only PNG, JPEG, JPG and SVG files are allowed." 
          }, 400);
        }

        // File size check
        if (image.size > MAX_FILE_SIZE) {
          return c.json({ 
            error: "File size cannot be larger than 5MB." 
          }, 400);
        }

        try {
          // Check if the file is actually an image
          const imageBuffer = await image.arrayBuffer();
          const fileHeader = new Uint8Array(imageBuffer.slice(0, 4));
          
          // Magic number check for valid image formats
          const isPNG = fileHeader[0] === 0x89 && fileHeader[1] === 0x50 && fileHeader[2] === 0x4E && fileHeader[3] === 0x47;
          const isJPEG = fileHeader[0] === 0xFF && fileHeader[1] === 0xD8;
          
          if (!isPNG && !isJPEG && image.type !== 'image/svg+xml') {
            return c.json({ 
              error: "Invalid image file format" 
            }, 400);
          }

          const file = await storage.createFile(
            IMAGES_BUCKET_ID,
            ID.unique(),
            image
          ).catch(error => {
            // Catch Appwrite specific errors
            if (error.code === 413) {
              throw new Error("File size exceeds Appwrite limit");
            }
            if (error.code === 415) {
              throw new Error("Unsupported file format");
            }
            
            throw error;
          });

          const arrayBuffer = await storage.getFilePreview(
            IMAGES_BUCKET_ID,
            file.$id
          ).catch(error => {
            if (error.code === 404) {
              throw new Error("Failed to generate file preview");
            }
            throw error;
          });

          uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
        } catch (error) {
          console.error("File upload error:", error);
          return c.json({ 
            error: error instanceof Error ? error.message : "An unexpected error occurred while uploading the file" 
          }, 500);
        }
      }
      const generatedCode = generateInviteCode(6);

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generatedCode,
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        // File type check
        if (!ALLOWED_FILE_TYPES.includes(image.type)) {
          return c.json({ 
            error: "Invalid file type. Only PNG, JPEG, JPG and SVG files are allowed." 
          }, 400);
        }

        // File size check
        if (image.size > MAX_FILE_SIZE) {
          return c.json({ 
            error: "File size cannot be larger than 5MB." 
          }, 400);
        }

        try {
          // Check if the file is actually an image
          const imageBuffer = await image.arrayBuffer();
          const fileHeader = new Uint8Array(imageBuffer.slice(0, 4));
          
          // Magic number check for valid image formats
          const isPNG = fileHeader[0] === 0x89 && fileHeader[1] === 0x50 && fileHeader[2] === 0x4E && fileHeader[3] === 0x47;
          const isJPEG = fileHeader[0] === 0xFF && fileHeader[1] === 0xD8;
          
          if (!isPNG && !isJPEG && image.type !== 'image/svg+xml') {
            return c.json({ 
              error: "Invalid image file format" 
            }, 400);
          }

          const file = await storage.createFile(
            IMAGES_BUCKET_ID,
            ID.unique(),
            image
          ).catch(error => {
            // Catch Appwrite specific errors
            if (error.code === 413) {
              throw new Error("File size exceeds Appwrite limit");
            }
            if (error.code === 415) {
              throw new Error("Unsupported file format");
            }
            throw error;
          });

          const arrayBuffer = await storage.getFilePreview(
            IMAGES_BUCKET_ID,
            file.$id
          ).catch(error => {
            if (error.code === 404) {
              throw new Error("Failed to generate file preview");
            }
            throw error;
          });

          uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
        } catch (error) {
          console.error("File upload error:", error);
          return c.json({ 
            error: error instanceof Error ? error.message : "An unexpected error occurred while uploading the file" 
          }, 500);
        }
      } else {
        uploadedImageUrl = image;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const members = await databases.listDocuments<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", workspaceId)]
    );
    const projects = await databases.listDocuments<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      [Query.equal("workspaceId", workspaceId)]
    );
    const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
    ]);

    if (members.documents.length === 0) {
      return c.json({ error: "There is no members." }, 401);
    }

    await Promise.all([
      ...members.documents.map((member) =>
        databases.deleteDocument(DATABASE_ID, MEMBERS_ID, member.$id)
      ),
      ...projects.documents.map((project) =>
        databases.deleteDocument(DATABASE_ID, PROJECTS_ID, project.$id)
      ),
      ...tasks.documents.map((task) =>
        databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id)
      ),
    ]);

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(6),
      }
    );

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return c.json({ error: "Already a member" }, 400);
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });

      return c.json({ data: workspace });
    }
  )
  .post("/:workspaceId/leave", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.param();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!workspace) {
      return c.json(
        { error: "Failed to find the workspace or maybe it can be deleted" },
        404
      );
    }

    const workspaceCurrentMember = await databases.getDocument<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      member.$id
    );

    if (!workspaceCurrentMember) {
      return c.json(
        { error: "Failed to find the member or maybe it can be deleted" },
        404
      );
    }

    const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("assigneeId", workspaceCurrentMember.$id),
    ]);

    await Promise.all([
      ...tasks.documents.map((task) =>
        databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id)
      ),
    ]);

    await databases.deleteDocument(
      DATABASE_ID,
      MEMBERS_ID,
      workspaceCurrentMember.$id
    );

    return c.json({ data: workspace });
  })
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId: workspaceId,
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
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthInCompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const OverdueTaskCount = thisMonthOverdueTasks.total;
    const OverdueTaskDifference =
      CompletedTaskCount - lastMonthOverdueTasks.total;

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
      },
    });
  });
export default app;
