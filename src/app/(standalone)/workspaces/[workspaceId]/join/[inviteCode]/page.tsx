import { getCurrent } from "@/features/auth/queries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { WorkspaceIdJoinClient } from "./client";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

export const metadata: Metadata = {
  title: "Joining",
  description: "You received a link to log into a workspace",
};

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <WorkspaceIdJoinClient />;
};

export default WorkspaceIdJoinPage;
