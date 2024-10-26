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

interface DataFilterProps {
  hideProjectFilter?: boolean;
}

export const DataFilter = ({ hideProjectFilter }: DataFilterProps) => {
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

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder={"All statuses"} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-pink-400 p-2" />
              Backlog
            </div>
          </SelectItem>
          <SelectItem value={TaskStatus.TODO}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-red-400 p-2" />
              Todo
            </div>
          </SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-yellow-400 p-2" />
              In Progress
            </div>
          </SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-blue-400 p-2" />
              In Review
            </div>
          </SelectItem>
          <SelectItem value={TaskStatus.DONE}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-emerald-400 p-2" />
              Done
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
            <SelectValue placeholder={"All priorities"} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectSeparator />
          <SelectItem value={Priority.HIGH}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-red-600 p-2" />
              High
            </div>
          </SelectItem>
          <SelectItem value={Priority.MEDIUM}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-green-600 p-2" />
              Medium
            </div>
          </SelectItem>
          <SelectItem value={Priority.LOW}>
            <div className="flex w-full items-center gap-x-4">
              <Circle className="size-4 rounded-full bg-yellow-700 p-2" />
              Low
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
            <SelectValue placeholder={"All assignees"} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
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
              <SelectValue placeholder={"All projects"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
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
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};
