import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Circle,
  Clock,
  FolderIcon,
  ListCheckIcon,
  UserIcon,
} from "lucide-react";
import { Priority, TaskStatus } from "../types";
import { useTasksFilters } from "../hooks/use-task-filters";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { DatePicker } from "@/components/date-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

interface DataFilterProps {
  hideProjectFilter?: boolean;
}

const FilterSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-2">
      {/* Status Filter Skeleton */}
      <div className="w-full lg:w-[150px]">
        <Skeleton className="h-8 w-full rounded-md" />
      </div>

      {/* Priority Filter Skeleton */}
      <div className="w-full lg:w-[150px]">
        <Skeleton className="h-8 w-full rounded-md" />
      </div>

      {/* Assignee Filter Skeleton */}
      <div className="w-full lg:w-[150px]">
        <Skeleton className="h-8 w-full rounded-md" />
      </div>

      {/* Project Filter Skeleton */}
      <div className="w-full lg:w-[150px]">
        <Skeleton className="h-8 w-full rounded-md" />
      </div>

      {/* Date Filter Skeleton */}
      <div className="w-full lg:w-[150px]">
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    </div>
  );
};

export const DataFilter = ({ hideProjectFilter }: DataFilterProps) => {
  const { t } = useTranslation();
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });

  const isLoading = isMembersLoading || isProjectsLoading;

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
    image: project.imageUrl,
  }));

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ status, assigneeId, projectId, dueDate, priority }, setFilters] =
    useTasksFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };
  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };

  const onPriorityChange = (value: string) => {
    setFilters({ priority: value === "all" ? null : (value as Priority) });
  };

  if (isLoading) return <FilterSkeleton />;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue
              placeholder={t(
                "tasks.task-switcher.data-filter.status.placeholder"
              )}
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("tasks.task-switcher.data-filter.status.placeholder")}
          </SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-pink-400 p-2" />
              {t("tasks.task-switcher.data-filter.status.list.BACKLOG")}
            </div>
          </SelectItem>
          <SelectItem value={TaskStatus.TODO}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-red-400 p-2" />
              {t("tasks.task-switcher.data-filter.status.list.TODO")}
            </div>
          </SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-yellow-400 p-2" />
              {t("tasks.task-switcher.data-filter.status.list.IN_PROGRESS")}
            </div>
          </SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-blue-400 p-2" />
              {t("tasks.task-switcher.data-filter.status.list.IN_REVIEW")}
            </div>
          </SelectItem>
          <SelectItem value={TaskStatus.DONE}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-emerald-400 p-2" />
              {t("tasks.task-switcher.data-filter.status.list.DONE")}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={priority ?? undefined}
        onValueChange={(value) => onPriorityChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <Clock className="size-4 mr-2" />
            <SelectValue
              placeholder={t(
                "tasks.task-switcher.data-filter.priority.placeholder"
              )}
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("tasks.task-switcher.data-filter.priority.placeholder")}
          </SelectItem>
          <SelectSeparator />
          <SelectItem value={Priority.HIGH}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-red-600 p-2" />
              {t("tasks.task-switcher.data-filter.priority.list.high")}
            </div>
          </SelectItem>
          <SelectItem value={Priority.MEDIUM}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-green-600 p-2" />
              {t("tasks.task-switcher.data-filter.priority.list.medium")}
            </div>
          </SelectItem>
          <SelectItem value={Priority.LOW}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-yellow-700 p-2" />
              {t("tasks.task-switcher.data-filter.priority.list.low")}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue
              placeholder={t(
                "tasks.task-switcher.data-filter.assignee.placeholder"
              )}
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("tasks.task-switcher.data-filter.assignee.placeholder")}
          </SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              <div className="flex items-center gap-x-2">
                <MemberAvatar name={member.label} />
                {member.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue
                placeholder={t(
                  "tasks.task-switcher.data-filter.projects.placeholder"
                )}
              />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("tasks.task-switcher.data-filter.projects.placeholder")}
            </SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                <div className="flex items-center gap-x-2">
                  <ProjectAvatar image={project.image} name={project.label} />
                  {project.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder={t("tasks.task-switcher.data-filter.duedate.placeholder")}
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};


