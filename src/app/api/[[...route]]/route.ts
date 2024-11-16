import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import members from "@/features/members/server/route";
import workspaces from "@/features/workspaces/server/route";
import projects from "@/features/projects/server/route";
import tasks from "@/features/tasks/server/route";
import subtasks from "@/features/subtasks/server/route";
import plans from "@/features/plans/server/route";
import labels from "@/features/labels/server/route";
import webhooks from "@/features/webhooks/server/route";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/members", members)
  .route("/workspaces", workspaces)
  .route("/projects", projects)
  .route("/tasks", tasks)
  .route("/subtasks", subtasks)
  .route("/webhooks", webhooks)
  .route("/plans", plans)
  .route("/labels", labels);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);

export type AppType = typeof routes;
