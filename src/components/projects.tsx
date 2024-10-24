"use client";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
export const Projects = () => {

  const pathname = usePathname();

  const { open } = useCreateProjectModal();

  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetProjects({ workspaceId });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500 font-bold">PROJECTS</p>
        <RiAddCircleFill
          onClick={() => open()}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;
        return (
          <Link key={project.$id} href={href}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-1  rounded-md hover:opacitry-75 transition cursor-pointer text-neutral-500",
                isActive &&
                  "bg-white dark:bg-neutral-950 shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar name={project.name} image={project.imageUrl} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
