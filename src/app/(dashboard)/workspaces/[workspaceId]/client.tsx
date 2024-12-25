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

import { Analytics } from "@/components/analytics";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Project } from "@/features/projects/types";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Member, MemberRole } from "@/features/members/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";

import { useRouter } from "next/navigation";
import { useLeaveWorkspace } from "@/features/workspaces/api/use-leave-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { Hint } from "@/components/hint";
import { ListBulletIcon, ResetIcon } from "@radix-ui/react-icons";
import { useState, useEffect, useRef } from "react";
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
import TaskAnalytics from "@/features/analytics/components/TaskAnalytics";
import MembersPieChart from "@/features/analytics/components/MembersPieChart";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  motion,
  useAnimation,
  useInView,

} from "framer-motion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

// Ana container animasyonu
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Liste item animasyonu
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// Skeleton animasyonu
const skeletonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Analytics Section Skeleton
const AnalyticsSkeleton = () => (
  <motion.div
    variants={skeletonVariants}
    initial="hidden"
    animate="visible"
    className="rounded-lg shadow-lg w-full dark:bg-neutral-900/50 dark:backdrop-blur-sm"
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 max-h-xl w-full gap-4">
      {/* Task Analytics Skeleton */}
      <div className="flex flex-col h-full lg:flex-row">
        <Skeleton className="w-full h-[300px] rounded-lg dark:bg-neutral-800/50" />
      </div>
      {/* Members Pie Chart Skeleton */}
      <div className="rounded-md border-transparent transition duration-300 border-2">
        <Skeleton className="w-full h-[300px] rounded-lg dark:bg-neutral-800/50" />
      </div>
    </div>
  </motion.div>
);

const AnalyticsCardSkeleton = () => {
  return (
    <div className="flex flex-col p-4 w-full">
      <Skeleton className="h-5 w-24 mb-2" /> {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-16" /> {/* Value */}
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-4 w-4" /> {/* Arrow icon */}
          <Skeleton className="h-4 w-12" /> {/* Difference value */}
        </div>
      </div>
    </div>
  );
};

// Analytics Skeleton Component
const TopAnalyticsSkeleton = () => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center flex-1">
            <AnalyticsCardSkeleton />
            {index < 4 && <DottedSeparator direction="vertical" />}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

// Task List Skeleton
const TaskListSkeleton = () => (
  <motion.div
    variants={skeletonVariants}
    initial="hidden"
    animate="visible"
    className="flex flex-col gap-y-4"
  >
    <div className="bg-white dark:bg-neutral-950 hover:shadow-sm transition-all duration-300 hover:bg-muted border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-8" />
      </div>
      <DottedSeparator className="my-4" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-x-4">
            <Skeleton className="w-full h-[72px] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Project List Skeleton
const ProjectListSkeleton = () => (
  <div className="flex flex-col gap-y-4">
    <div className="bg-white dark:bg-neutral-950 hover:shadow-sm transition-all duration-300 hover:bg-muted border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-8" />
      </div>
      <DottedSeparator className="my-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

// Members List Skeleton
const MembersListSkeleton = () => (
  <div className="flex flex-col gap-y-4 col-span-1">
    <div className="bg-white dark:bg-neutral-950 hover:shadow-sm transition-all duration-300 hover:bg-muted border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-8" />
      </div>
      <DottedSeparator className="my-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-full">
            <Card className="shadow-none rounded-lg overflow-hidden">
              <CardContent className="p-4 flex items-center gap-x-2">
                <div className="flex items-center gap-x-4">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const WorkspaceIdClient = () => {
  const { t } = useTranslation();
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
    `${t("workspace.dialogs.LeaveDialog.title")}`,
    `${t("workspace.dialogs.LeaveDialog.description")}`,
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

  if (isLoading) {
    return (
      <div className="h-full p-6 space-y-4">
        <TopAnalyticsSkeleton />
        <AnalyticsSkeleton />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <TaskListSkeleton />
          <ProjectListSkeleton />
          <MembersListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      <LeaveDialog />
      <div className="h-full flex flex-col space-y-4 scroll-smooth">
        {/* <Analytics data={analytics} /> */}
        <div className="rounded-lg  w-full flex items-center   transition  justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 max-h-xl w-full gap-4  ">
            <div className="flex flex-col h-full lg:flex-row">
              <TaskAnalytics analytics={analytics} />
            </div>

            <div className="rounded-md  border-transparent transition duration-300 border-2 hover:border-neutral-500 cursor-pointer  w-full  flex  ">
              <MembersPieChart
                totalMembers={workspaceMembers?.total ?? 0}
                adminCount={
                  workspaceMembers?.documents.filter(
                    (member) => member.role === MemberRole.ADMIN
                  ).length ?? 0
                }
                memberCount={
                  workspaceMembers?.documents.filter(
                    (member) => member.role === MemberRole.MEMBER
                  ).length ?? 0
                }
              />
            </div>
          </div>
        </div>
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
  const { t } = useTranslation();
  const router = useRouter();
  const { open: createTask } = useCreateTaskModal();
  const { open: editTask } = useEditTaskModal();
  const { mutate: deleteTask } = useDeleteTask();
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

  if (!data) return <TaskListSkeleton />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-y-4"
    >
      <span className="bg-white hover:bg-muted duration-300 transition-all rounded-lg p-4 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <Hint label={t("sections.tasks.view-all-tasks")} side="right">
            <Link
              className="text-lg transition-all duration-300 px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-neutral-950 cursor-pointer font-semibold"
              href={`/workspaces/${workspaceId}/tasks`}
            >
              {t("sections.tasks.title")} ({total})
            </Link>
          </Hint>
          <div className="flex gap-x-4 ">
            {slice > 3 && (
              <Hint label={t("sections.tasks.reset-more")} side="bottom">
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

            <Hint label={t("sections.tasks.add-button-hint")} side="bottom">
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
        <motion.ul className="space-y-2.5">
          {data.slice(0, slice).map((task) => (
            <motion.li
              key={task.$id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="shadow-none rounded-lg transition">
                <CardContent className="p-4 flex  justify-between border w-full rounded-md items-center group">
                  <div className="w-full flex flex-col gap-y-1 overflow-hidden">
                    <p className="text-sm truncate font-medium line-clamp-1 w-full">
                      {task.name}
                    </p>
                    <div className="flex items-center gap-x-2">
                      <p className="text-sm truncate ">{task.project?.name}</p>
                      <div className="flex gap-x-2 items-center">
                        <div className="size-1 rounded-full bg-neutral-300" />
                        <div className="text-xs text-muted-foreground flex items-center gap-x-1  ">
                          <CalendarIcon className="size-3 mr-1" />

                          <span className="truncate flex text-xs items-center">
                            <p className="mr-1">
                              {t("sections.tasks.created-at")}
                            </p>
                            {format(
                              new Date(task.$createdAt),
                              "MM/dd/yyyy hh:mm a"
                            )}
                          </span>
                        </div>
                        <div className="size-1 rounded-full bg-neutral-300" />
                        <div className="text-xs text-muted-foreground flex items-center gap-x-1  ">
                          <CalendarIcon className="size-3 mr-1" />

                          <span className="truncate flex text-xs items-center">
                            <p className="mr-1">
                              {" "}
                              {t("sections.tasks.dueDate")}
                            </p>
                            {format(
                              new Date(task.dueDate),
                              "MM/dd/yyyy hh:mm a"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-x-2">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} size={"icon"}>
                          <MoreVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        side="bottom"
                        className="w-40 dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-lg dark:shadow-black/20"
                        sideOffset={10}
                      >
                        <div className="flex flex-col">
                          <DropdownMenuItem
                            className="gap-x-4 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 transition-colors duration-200"
                            asChild
                          >
                            <Link
                              href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
                            >
                              <ExternalLinkIcon className="size-4" />
                              {t("sections.tasks.options.open-task")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-x-4"
                            onClick={() => editTask(task.$id)}
                          >
                            <Pencil className="size-4" />
                            {t("sections.tasks.options.edit-task")}
                          </DropdownMenuItem>
                          {currentMember.role === MemberRole.ADMIN && (
                            <>
                              <DropdownMenuItem
                                className="gap-x-4 text-amber-500"
                                onClick={() => onDelete(task.$id)}
                              >
                                <Trash className="size-4" />
                                {t("sections.tasks.options.delete-task")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            {t("sections.tasks.no-task-found")}
          </li>
        </motion.ul>

        {/* Show more/less button only if there are tasks */}
        {data.length > 0 && (
          <Button
            variant="muted"
            className="mt-4 w-full dark:bg-neutral-950 border dark:border-neutral-950"
            onClick={() => {
              if (slice >= data.length) {
                setSlice(3);
              } else {
                handleShowMore();
              }
            }}
          >
            <div className="flex items-center gap-x-2">
              {slice >= data.length
                ? `${t("sections.tasks.options.show-less")}`
                : `${t("sections.tasks.options.show-more")}`}
              <motion.div
                initial={false}
                animate={{ rotate: slice >= data.length ? 180 : 0 }}
              >
                <ChevronDownIcon className="size-4" />
              </motion.div>
            </div>
          </Button>
        )}
      </span>
    </motion.div>
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
  const { t } = useTranslation();
  const workspaceId = useWorkspaceId();

  if (!data) return <ProjectListSkeleton />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-y-4"
    >
      <div className="bg-white dark:bg-neutral-950  hover:shadow-sm transition-all duration-300 hover:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Hint label="Your projects total" side="right">
            <p className="text-lg font-semibold cursor-pointer">
              {t("sections.projects.title")} ({total})
            </p>
          </Hint>
          <Hint label={t("sections.projects.add-button-hint")} side="left">
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
        <motion.ul
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          variants={containerVariants}
        >
          {data.map((project) => (
            <motion.li
              key={project.$id}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
            >
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
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
            </motion.li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            {t("sections.projects.no-project-found")}
          </li>
        </motion.ul>
      </div>
    </motion.div>
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
  const { t } = useTranslation();
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

  if (!data) return <MembersListSkeleton />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-y-4"
    >
      <div className="bg-white dark:bg-neutral-950 hover:shadow-sm transition-all duration-300 hover:bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Hint label="View all members" side="right">
            <Link
              href={`/workspaces/${workspaceId}/members`}
              className="text-lg transition-all dark:hover:bg-neutral-900 duration-300 px-2 py-1 rounded-lg hover:bg-white cursor-pointer font-semibold"
            >
              {t("sections.members.title")} ({total})
            </Link>
          </Hint>
          <Hint label={t("sections.members.view-all-members")} side="left">
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

        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"
          variants={containerVariants}
        >
          {data.map((member) => (
            <motion.li
              key={member.$id}
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
            >
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
            </motion.li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </motion.ul>
      </div>
    </motion.div>
  );
};

// Scroll animasyonu için özel hook
const useScrollAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.1,
    once: true,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
};

// Scroll animasyonu için wrapper component
const ScrollAnimationWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { ref, controls, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            duration: 0.6,
            bounce: 0.3,
          },
        },
        hidden: {
          opacity: 0,
          y: 50,
        },
      }}
    >
      {children}
    </motion.div>
  );
};
