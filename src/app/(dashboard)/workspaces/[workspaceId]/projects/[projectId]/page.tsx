import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

import { ProjectIdClient } from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project",
  description: "More information about the Project",
};

const ProjectIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <ProjectIdClient />;
};

export default ProjectIdPage;
