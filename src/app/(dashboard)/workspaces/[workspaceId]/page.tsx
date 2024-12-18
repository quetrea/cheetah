import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdClient } from "./client";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

const WorkspaceIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <WorkspaceIdClient />;
};

export default WorkspaceIdPage;
