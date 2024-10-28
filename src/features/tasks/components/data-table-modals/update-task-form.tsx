"use client";
import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useCreateTask } from "../../api/use-create-task";
import { createTaskSchema } from "../../schemas";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Priority, Task, TaskStatus } from "../../types";
import { Circle } from "lucide-react";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateTask } from "../../api/use-update-task";
import { useUpdateTaskModal } from "../../hooks/use-update-task-property-modal";
import { useCustomTaskPropertyChange } from "@/hooks/use-custom-task-property-change";
import { useGetTask } from "../../api/use-get-task";

interface UpdateTaskFormProps {
  onCancel?: () => void;
  type: "name" | "status" | "projectId" | "dueDate" | "priority" | null;
  taskId: string;
}

export const UpdateTaskForm = ({
  onCancel,
  type,
  taskId,
}: UpdateTaskFormProps) => {
  const { data, isPending } = useGetTask({ taskId });

  const { setValue, value, handleSave } = useCustomTaskPropertyChange({
    taskId: taskId,
    changeValue: data?.name,
    type: type as "name" | "status" | "projectId" | "dueDate" | "priority",
  });
  return (
    <Card className="w-full h-full border-none shadow-none rounded-none">
      <CardHeader className="flex p-7 pb-4 ">
        <CardTitle className="text-xl font-bold">Edit task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 ">
        <form onSubmit={handleSave}>
          <div className="flex flex-col gap-y-4">
            <Input
              className="rounded-sm border-none shadow-none hover:bg-accent focus-visible:ring-neutral-400 cursor-default focus:cursor-text active:border-neutral-100 transition-all focus-visible:ring-2 ring-neutral-100 py-0 focus-visible:rounded-sm"
              disabled={isPending}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter task ${!type ? type : "name"}`}
            />
          </div>
          <DottedSeparator className="py-7" />
          <div className="flex items-center justify-between">
            <Button
              type="button"
              size={"lg"}
              disabled={false}
              variant={"secondary"}
              onClick={onCancel}
              className={cn(!onCancel && "invisible")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={false} size={"lg"}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
