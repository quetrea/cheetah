"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PlusIcon, CalendarIcon, SettingsIcon } from "lucide-react";

import { Task } from "@/features/tasks/types";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

import { Button } from "@/components/ui/button";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Analytics } from "@/components/analytics";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Project } from "@/features/projects/types";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Member } from "@/features/members/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: workspaceAnalytics, isLoading: isLoadingWorkspaceAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: workspaceTasks, isLoading: isLoadingWorkspaceTasks } =
    useGetTasks({ workspaceId });

  const { data: workspaceProjects, isLoading: isLoadingWorkspaceProjects } =
    useGetProjects({ workspaceId });

  const { data: workspaceMembers, isLoading: isLoadingWorkspacesMembers } =
    useGetMembers({ workspaceId });

  const isLoading =
    isLoadingWorkspaceTasks ||
    isLoadingWorkspaceProjects ||
    isLoadingWorkspaceAnalytics ||
    isLoadingWorkspacesMembers;

  if (isLoading) {
    return <PageLoader />;
  }
  if (
    !workspaceAnalytics ||
    !workspaceTasks ||
    !workspaceProjects ||
    !workspaceMembers
  ) {
    return <PageError message="Failed to load workspace data" />;
  }
  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={workspaceAnalytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList
          data={workspaceTasks.documents}
          total={workspaceTasks.total}
        />
        <ProjectList
          data={workspaceProjects.documents}
          total={workspaceProjects.total}
        />
        <MembersList
          data={workspaceMembers.documents}
          total={workspaceMembers.total}
        />
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
}
export const TaskList = ({ data, total }: TaskListProps) => {
  const { open: createTask } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>

          <Button
            className="dark:bg-neutral-950 border dark:border-neutral-950"
            variant={"muted"}
            size={"icon"}
            onClick={createTask}
          >
            <PlusIcon className="size-4 text-neutral-400 " />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => {
            return (
              <li key={task.$id}>
                <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                  <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                    <CardContent className="p-4">
                      <p className="text-lg truncate font-medium">
                        {task.name}
                      </p>
                      <div className="flex items-center gap-x-2">
                        <p>{task.project?.name}</p>
                        <div className="size-1 rounded-full bg-neutral-300" />
                        <div className="text-sm text-muted-foreground flex items-center">
                          <CalendarIcon className="size-3 mr-1" />
                          <span className="truncate">
                            {formatDistanceToNow(new Date(task.dueDate))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button
          asChild
          variant="muted"
          className="mt-4 w-full dark:bg-neutral-950 border dark:border-neutral-950"
        >
          <Link href={`/workspaces/${workspaceId}/tasks`}> Show all</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const { open: createProject } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-y-4 col-span-1 ">
      <div className="bg-white dark:bg-neutral-950 border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>

          <Button
            className="dark:bg-neutral-950 border border-neutral-600"
            variant={"secondary"}
            size={"icon"}
            onClick={createProject}
          >
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => {
            return (
              <li key={project.$id}>
                <Link
                  href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                >
                  <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                    <CardContent className="p-4 flex items-center gap-x-2.5">
                      <ProjectAvatar
                        className="size-12"
                        fallbackClassname="text-lg"
                        name={project.name}
                        image={project.imageUrl}
                      />
                      <p className="text-lg font-medium truncate">
                        {project.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MembersListProps {
  data: Member[];
  total: number;
}

export const MembersList = ({ data, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white dark:bg-neutral-950  border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button
            className="dark:bg-neutral-950 border border-neutral-600"
            asChild
            variant={"secondary"}
            size="icon"
          >
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => {
            return (
              <li key={member.$id}>
                <Link href={`/workspaces/${workspaceId}/members/${member.$id}`}>
                  <Card className="shadow-none rounded-lg overflow-hidden">
                    <CardContent className="p-4 flex flex-col items-center gap-y-2">
                      <MemberAvatar className="size-12" name={member.name} />
                      <div className="flex flex-col items-center overflow-hidden">
                        <p className="text-sm font-medium line-clamp-1">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {member.email}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};
