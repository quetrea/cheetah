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
import { Member, MemberRole } from "@/features/members/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useLeaveWorkspace } from "@/features/workspaces/api/use-leave-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { Hint } from "@/components/hint";
import { ListBulletIcon, ResetIcon } from "@radix-ui/react-icons";
import { useState } from "react";

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

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave Workspace",
    "This action cannot be undone.",
    "destructive"
  );

  const handleLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) return;

    leavingWorkspace(
      { param: { workspaceId } },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  const { mutate: leavingWorkspace, isPending: isLeavingWorkspace } =
    useLeaveWorkspace();

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
    <>
      <LeaveDialog />
      <div className="h-full flex flex-col space-y-4 scroll-smooth">
        <Analytics data={analytics} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <TaskList data={tasks} total={workspaceTasks?.total ?? 0} />
          <ProjectList data={projects} total={workspaceProjects?.total ?? 0} />
          <MembersList data={members} total={workspaceMembers?.total ?? 0} />
        </div>
        {workspaceMembers?.currentMember.role === MemberRole.MEMBER && (
          <div className="flex justify-end fixed right-5 bottom-5">
            <Button
              disabled={isLeavingWorkspace}
              onClick={handleLeave}
              variant={"destructive"}
            >
              Leave Workspace
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
}
export const TaskList = ({ data, total }: TaskListProps) => {
  const { open: createTask } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const [slice, setSlice] = useState(3);

  const handleResetShowMore = () => {
    setSlice(3);
  };

  const handleShowMore = async () => {
    setSlice((prevSlice) => prevSlice + 6);
  };

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <span className="bg-white hover:bg-muted duration-300 transition-all rounded-lg p-4 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <Hint label="View all tasks" side="right">
            <Link
              className="text-lg transition-all duration-300 px-2 py-1 rounded-lg hover:bg-white cursor-pointer font-semibold"
              href={`/workspaces/${workspaceId}/tasks`}
            >
              Tasks ({total})
            </Link>
          </Hint>
          <div className="flex gap-x-4 ">
            {slice > 3 && (
              <Hint label="Reset show more" side="bottom">
                <Button
                  className="dark:bg-neutral-950 border dark:border-neutral-950"
                  variant={"muted"}
                  size={"icon"}
                  onClick={handleResetShowMore}
                >
                  <ResetIcon className="size-4 text-neutral-400 " />
                </Button>
              </Hint>
            )}

            <Hint label="Create a new task" side="bottom">
              <Button
                className="dark:bg-neutral-950 border dark:border-neutral-950"
                variant={"muted"}
                size={"icon"}
                onClick={createTask}
              >
                <PlusIcon className="size-4 text-neutral-400 " />
              </Button>
            </Hint>
          </div>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.slice(0, slice).map((task) => {
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
          variant="muted"
          className="mt-4 w-full dark:bg-neutral-950 border dark:border-neutral-950"
          onClick={handleShowMore}
        >
          Show more
        </Button>
      </span>
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
      <div className="bg-white dark:bg-neutral-950 hover:shadow-sm transition-all duration-300 hover:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Hint label="Your projects total" side="right">
            <p className="text-lg font-semibold cursor-pointer">
              Projects ({total})
            </p>
          </Hint>
          <Hint label="Create a new project" side="left">
            <Button
              className="dark:bg-neutral-950 "
              variant={"secondary"}
              size={"icon"}
              onClick={createProject}
            >
              <PlusIcon className="size-4 text-neutral-400" />
            </Button>
          </Hint>
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
      <div className="bg-white dark:bg-neutral-950 hover:shadow-sm transition-all duration-300 hover:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Hint label="View all members" side="right">
            <Link
              href={`/workspaces/${workspaceId}/members`}
              className="text-lg transition-all duration-300 px-2 py-1 rounded-lg hover:bg-white cursor-pointer font-semibold"
            >
              Members ({total})
            </Link>
          </Hint>
          <Hint label="View member list" side="left">
            <Button
              className="dark:bg-neutral-950"
              asChild
              variant={"secondary"}
              size="icon"
            >
              <Link href={`/workspaces/${workspaceId}/members`}>
                <ListBulletIcon className="size-4 text-neutral-400" />
              </Link>
            </Button>
          </Hint>
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
