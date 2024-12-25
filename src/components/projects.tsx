"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill, RiArrowDownSLine, RiCloseLine } from "react-icons/ri";
import { useRecentProjects } from "@/features/projects/hooks/use-recent-projects";
import { DottedSeparator } from "./dotted-separator";
import { useTranslation } from "react-i18next";

export const Projects = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const { open } = useCreateProjectModal();

  const workspaceId = useWorkspaceId();

  const [isExpanded, setIsExpanded] = useState(true);

  const { data, isPending } = useGetProjects({ workspaceId });

  const { recentProjects, addRecentProject, clearRecentProjects } =
    useRecentProjects();

  return (
    <>
      {recentProjects.length > 0 && (
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between border-2 border-b-0 rounded-b-none rounded-md p-2">
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase text-neutral-500 font-bold">
                {t("sidebar.projects.recent.title")}
              </p>
            </div>
            <RiCloseLine
              onClick={() => clearRecentProjects()}
              className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
            />
          </div>
          <div className="px-1 flex flex-col border-b-2 rounded-b-md">
            <AnimatePresence initial={false}>
              {recentProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    marginBottom: 8,
                  }}
                  exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                  transition={{
                    type: "spring",
                    duration: 0.3,
                    bounce: 0.1,
                  }}
                >
                  <Link
                    href={`/workspaces/${project.workspaceId}/projects/${project.id}`}
                  >
                    <div className="flex items-center gap-2.5 p-1 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500 group duration-500">
                      <ProjectAvatar
                        name={project.name}
                        image={project.imageUrl}
                      />
                      <span className="truncate text-sm duration-100 transition group-hover:text-primary">
                        {project.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className={cn("my-4 hidden", recentProjects.length > 0 && "block")}>
        <DottedSeparator />
      </div>

      <div className="flex flex-col gap-y-2 select-none">
        <div className="flex items-center justify-between border-2 border-b-0 rounded-b-none rounded-lg p-2">
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <p className="text-xs uppercase text-neutral-500 font-bold">
              {!isExpanded
                ? `${t("sidebar.projects.titles.current.title")}`
                : `${t("sidebar.projects.titles.all.title")}`}
            </p>
            <div className="flex items-center gap-1.5">
              <RiArrowDownSLine
                className={cn(
                  "size-4 text-neutral-400  transition-transform",
                  isExpanded ? "rotate-0" : "-rotate-90"
                )}
              />
            </div>
          </div>
          <RiAddCircleFill
            onClick={() => open()}
            className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          />
        </div>

        <div className="px-1 flex flex-col">
          <AnimatePresence initial={false}>
            {data?.documents.map((project) => {
              const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
              const isActive = pathname === href;

              if (!isExpanded && !isActive) return null;

              return (
                <motion.div
                  key={project.$id}
                  initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    marginBottom: 8, // 2 * 4px (gap-2 equivalent)
                  }}
                  exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                  transition={{
                    type: "spring",
                    duration: 0.3,
                    bounce: 0.1,
                  }}
                >
                  <Link
                    href={href}
                    onClick={() => {
                      addRecentProject({
                        id: project.$id,
                        name: project.name,
                        imageUrl: project.imageUrl,
                        workspaceId: workspaceId,
                      });
                    }}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2.5 p-1 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500 group duration-500",
                        isActive &&
                          "bg-white dark:bg-neutral-950 shadow-sm hover:opacity-100 text-primary"
                      )}
                    >
                      <ProjectAvatar
                        name={project.name}
                        image={project.imageUrl}
                      />
                      <span className="truncate text-sm duration-100 transition group-hover:text-primary">
                        {project.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
