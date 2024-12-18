import { getCurrent } from "@/features/auth/queries";

import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";
import { WorkspaceIdSettingsClient } from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace Settings",
  description: "Workspace settings",
};

const WorkspaceIdSettingsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("sign-in");

  return <WorkspaceIdSettingsClient />;
};

export default WorkspaceIdSettingsPage;
