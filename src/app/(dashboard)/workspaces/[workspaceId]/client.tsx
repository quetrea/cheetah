"use client";

import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import {
  PlusIcon,
  CalendarIcon,
  SettingsIcon,
  MoreVerticalIcon,
} from "lucide-react";

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

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

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

  const tasks = workspaceTasks?.documents ?? [];
  const projects = workspaceProjects?.documents ?? [];
  const members = workspaceMembers?.documents ?? [];
  const analytics = workspaceAnalytics ?? {
    TaskCount: 0,
    TaskDifferent: 0,
    AssignedTaskCount: 0,
    AssignedTaskDifference: 0,
    CompletedTaskCount: 0,
    CompletedTaskDifference: 0,
    InCompleteTaskCount: 0,
    InCompleteTaskDifference: 0,
    OverdueTaskCount: 0,
    OverdueTaskDifference: 0,
  };

  return (
    <div className="h-full flex flex-col space-y-4 scroll-smooth">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks} total={workspaceTasks?.total ?? 0} />
        <ProjectList data={projects} total={workspaceProjects?.total ?? 0} />
        <MembersList data={members} total={workspaceMembers?.total ?? 0} />
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
          {data.slice(0, 3).map((task) => {
            return (
              <li key={task.$id}>
                <HoverCard>
                  <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                    <HoverCardTrigger>
                      <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                        <CardContent className="p-4  ">
                          <p className="text-sm truncate font-medium">
                            {task.name}
                          </p>
                          <div className="flex items-center gap-x-2">
                            <p className="text-sm">{task.project?.name}</p>
                            <div className="size-1 rounded-full bg-neutral-300" />
                            <div className="text-xs text-muted-foreground flex items-center">
                              <CalendarIcon className="size-3 mr-1" />
                              <span className="truncate">
                                {formatDistanceToNow(new Date(task.$createdAt))}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                  </Link>

                  <HoverCardContent className="flex w-full flex-col">
                    <div className="flex items-center gap-x-2">
                      <ProjectAvatar
                        name={task.project.name}
                        image={task.project.imageUrl}
                      />
                      {task.project.name}
                    </div>
                    <DottedSeparator className="my-4" />
                    <div className="flex flex-col items-start gap-y-2  border rounded-md p-2.5">
                      <div className="text-sm flex gap-x-2 max-w-[200px]">
                        <Badge
                          variant={task.status}
                          className="truncate text-xs"
                        >
                          {task.name}
                        </Badge>
                      </div>
                      <div className="text-sm flex ">
                        {task.description ? (
                          <p className="truncate text-xs">{task.description}</p>
                        ) : (
                          <div className="truncate text-xs">No description</div>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500 flex  ">
                        <CalendarIcon className="size-4 mr-2" />
                        {format(task.dueDate, "PPP")}
                      </span>
                    </div>
                  </HoverCardContent>
                </HoverCard>
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
            className="dark:bg-neutral-950 "
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
                      <p className=" font-medium truncate">{project.name}</p>
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
            className="dark:bg-neutral-950"
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
