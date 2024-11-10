"use client";

import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import {
  PlusIcon,
  CalendarIcon,
  SettingsIcon,
  MoreVerticalIcon,
  Trash,
  Pencil,
  ExternalLinkIcon,
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
import { useEditTaskModal } from "@/features/tasks/hooks/use-edit-task-modal";
import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import { RiCloseFill } from "react-icons/ri";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          <TaskList
            data={tasks}
            total={workspaceTasks?.total ?? 0}
            currentMember={workspaceMembers?.currentMember as Member}
          />
          <ProjectList
            data={projects}
            total={workspaceProjects?.total ?? 0}
            currentMember={workspaceMembers?.currentMember as Member}
          />
          <MembersList
            data={members}
            total={workspaceMembers?.total ?? 0}
            currentMember={workspaceMembers?.currentMember as Member}
          />
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
  currentMember: Member;
  data: Task[];
  total: number;
}
export const TaskList = ({ data, total, currentMember }: TaskListProps) => {
  const router = useRouter();
  const { open: createTask } = useCreateTaskModal();
  const { open: editTask } = useEditTaskModal();
  const { mutate: deleteTask, isPending } = useDeleteTask();
  const workspaceId = useWorkspaceId();
  const [slice, setSlice] = useState(3);

  const handleResetShowMore = () => {
    setSlice(3);
  };

  const onDelete = (id: string) => {
    deleteTask(
      { param: { taskId: id } },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
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
              className="text-lg transition-all duration-300 px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-neutral-950 cursor-pointer font-semibold"
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
                className="dark:bg-neutral-950 border  dark:border-neutral-950"
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
                <Card className="shadow-none rounded-lg hover:opacity-75 transition flex justify-between items-center">
                  <CardContent className="p-4 flex  justify-between border w-full rounded-md items-center group">
                    <div className="w-full flex flex-col  overflow-hidden">
                      <p className="text-sm truncate font-medium line-clamp-1 w-full">
                        {task.name}
                      </p>
                      <div className="flex items-center gap-x-2">
                        <p className="text-sm truncate ">
                          {task.project?.name}
                        </p>
                        <div className="size-1 rounded-full bg-neutral-300" />
                        <div className="text-xs text-muted-foreground flex items-center">
                          <CalendarIcon className="size-3 mr-1" />
                          <span className="truncate">
                            {formatDistanceToNow(new Date(task.$createdAt))}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-x-2   ">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"outline"} size={"icon"}>
                            <MoreVerticalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          side="bottom"
                          className="w-40 "
                          sideOffset={10}
                        >
                          <div className="flex flex-col">
                            <DropdownMenuItem className="gap-x-4" asChild>
                              <Link
                                href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
                              >
                                <ExternalLinkIcon className="size-4" />
                                Open Task{" "}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-x-4"
                              onClick={() => editTask(task.$id)}
                            >
                              <Pencil className="size-4" />
                              Edit Task
                            </DropdownMenuItem>
                            {currentMember.role === MemberRole.ADMIN && (
                              <>
                                <DropdownMenuItem
                                  className="gap-x-4 text-amber-500"
                                  onClick={() => onDelete(task.$id)}
                                >
                                  <Trash className="size-4" />
                                  Delete Task
                                </DropdownMenuItem>
                              </>
                            )}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
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
  currentMember: Member;
  data: Project[];
  total: number;
}

export const ProjectList = ({
  data,
  total,
  currentMember,
}: ProjectListProps) => {
  const { open: createProject } = useCreateProjectModal();

  const router = useRouter();

  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-y-4 col-span-1 ">
      <div className="bg-white dark:bg-neutral-950  hover:shadow-sm transition-all duration-300 hover:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Hint label="Your projects total" side="right">
            <p className="text-lg font-semibold cursor-pointer">
              Projects ({total})
            </p>
          </Hint>
          <Hint label="Create a new project" side="left">
            <Button
              className="dark:bg-neutral-900 "
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
                    <CardContent className="p-4 flex items-center   justify-between">
                      <div className="flex gap-x-2.5 items-center">
                        <ProjectAvatar
                          className="size-12"
                          fallbackClassname="text-lg"
                          name={project.name}
                          image={project.imageUrl}
                        />
                        <p className=" font-medium truncate">{project.name}</p>
                      </div>
                      {currentMember.role === MemberRole.ADMIN && (
                        <div className="flex items-center">
                          <Button variant={"outline"}>
                            <Link
                              href={`/workspaces/${workspaceId}/projects/${project.$id}/settings`}
                            >
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      )}
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
  currentMember: Member;
  data: Member[];
  total: number;
}

export const MembersList = ({
  data,
  total,
  currentMember,
}: MembersListProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate: kickMember, isPending: kickingMember } = useDeleteMember();
  const onDelete = (id: string) => {
    kickMember(
      { param: { memberId: id } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white dark:bg-neutral-950 hover:shadow-sm transition-all duration-300 hover:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Hint label="View all members" side="right">
            <Link
              href={`/workspaces/${workspaceId}/members`}
              className="text-lg transition-all dark:hover:bg-neutral-900 duration-300 px-2 py-1 rounded-lg hover:bg-white cursor-pointer font-semibold"
            >
              Members ({total})
            </Link>
          </Hint>
          <Hint label="View member list" side="left">
            <Button
              className="dark:bg-neutral-900"
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

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {data.map((member) => {
            return (
              <li key={member.$id}>
                <Card className="shadow-none rounded-lg overflow-hidden w-full">
                  <CardContent className="p-4 flex items-center gap-x-2 justify-between group w-full">
                    <div className="flex items-center gap-x-4">
                      <MemberAvatar className="size-12" name={member.name} />
                      <div className="flex flex-col items-start overflow-hidden">
                        <p className="text-sm font-medium line-clamp-1">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp  truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="items-center ">
                      {currentMember.role === MemberRole.ADMIN &&
                        member.role !== MemberRole.ADMIN && (
                          <Button
                            className="opacity-0 group-hover:opacity-100"
                            onClick={() => onDelete(member.$id)}
                            variant={"destructive"}
                            size={"icon"}
                          >
                            <RiCloseFill className="size-4 " />
                          </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
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
