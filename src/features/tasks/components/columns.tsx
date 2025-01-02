"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVerticalIcon } from "lucide-react";

import { MemberAvatar } from "@/features/members/components/member-avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import { Task, TaskStatus } from "../types";
import { TaskDate } from "./task-date";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskActions } from "./task-actions";

import { NameColumn } from "./columns/name-column";
import { ProjectColumn } from "./columns/project-column";
import { LabelsColumn } from "./columns/labels-column";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

// Skeleton component for table cells
const TableCellSkeleton = () => (
  <div className="flex items-center space-x-2">
    <Skeleton className="h-4 w-24" />
  </div>
);

// Skeleton component for avatar cells
const AvatarCellSkeleton = () => (
  <div className="flex items-center gap-x-2">
    <Skeleton className="size-6 rounded-full" />
    <Skeleton className="h-4 w-24" />
  </div>
);

// Skeleton component for badge cells
const BadgeCellSkeleton = () => <Skeleton className="h-5 w-16 rounded-full" />;

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      const HeaderComponent = () => {
        const { t } = useTranslation();
        return (
          <Button
            className="px-2 "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.task-name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      };
      return <HeaderComponent />;
    },
    cell: ({ row }) => {
      const name = row.original.name;
      const id = row.original.$id;

      if (!name || !id) return <TableCellSkeleton />;
      return <NameColumn name={name} taskId={id} />;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      const HeaderComponent = () => {
        const { t } = useTranslation();
        return (
          <Button
            className="px-2 "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.project")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      };
      return <HeaderComponent />;
    },
    cell: ({ row }) => {
      const project = row.original.project;
      const id = row.original.$id;

      if (!project || !id) return <TableCellSkeleton />;
      return <ProjectColumn project={project} taskId={id} />;
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      const HeaderComponent = () => {
        const { t } = useTranslation();
        return (
          <Button
            className="px-2 "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.assignee")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      };
      return <HeaderComponent />;
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;

      if (!assignee) return <AvatarCellSkeleton />;
      return (
        <div className="flex items-center ml-2 gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      const HeaderComponent = () => {
        const { t } = useTranslation();

        return (
          <Button
            className="px-2 "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.duedate")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      };
      return <HeaderComponent />;
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      const status = row.original.status;

      if (!dueDate) return <TableCellSkeleton />;
      return (
        <TaskDate value={dueDate} compeleted={status === TaskStatus.DONE} />
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const HeaderComponent = () => {
        const { t } = useTranslation();
        return (
          <Button
            className="px-2 "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.status")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      };
      return <HeaderComponent />;
    },
    cell: ({ row }) => {
      const RowComponent = () => {
        const { t } = useTranslation();
        const status = row.original.status;

        if (!status) return <BadgeCellSkeleton />;
        return (
          <Badge className="ml-2" variant={status}>
                {snakeCaseToTitleCase(
              `${t(
                `modals.create.task.sections.status.statuses.${status}`
              )}`
            )}
          </Badge>
        );
      };

      return (
        <RowComponent />
      )
    },
  },
  // {
  //   accessorKey: "label",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Labels
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const id = row.original.$id;

  //     if (!id) return <BadgeCellSkeleton />;
  //     return <LabelsColumn taskId={id} />;
  //   },
  // },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      const HeaderComponent = () => {
        const { t } = useTranslation();
        return (
          <Button
            className="px-2 "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.priority")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      };
      return <HeaderComponent />;
    },
    cell: ({ row }) => {
      const RowComponent = () => {
        const { t } = useTranslation();
        const priority = row.original.priority;

        if (priority === null || priority === undefined) {
          return <BadgeCellSkeleton />;
        }

        return (
          <Badge className="ml-2" variant={priority}>
            {snakeCaseToTitleCase(
              `${t(
                `modals.create.task.sections.priority.priorities.${priority}`
              )}`
            )}
          </Badge>
        );
      };

      return <RowComponent />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.$id;
      const projectId = row.original.projectId;

      if (!id || !projectId) return <Skeleton className="size-8" />;
      return (
        <TaskActions id={id} projectId={projectId}>
          <Button variant={"ghost"} className="size-8 p-0">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
