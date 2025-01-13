"use client";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { useCreateTask } from "../api/use-create-task";
import { createTaskSchema } from "../schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

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
import { Priority, Task, TaskStatus } from "../types";
import { Circle } from "lucide-react";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";

import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useTranslation } from "react-i18next";
import { differenceInDays, addDays, eachDayOfInterval } from "date-fns";

interface DuplicateTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
  onStatusUpdate?: TaskStatus | string;
  projectId?: string;
  taskId?: string;
}

export const DuplicateTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  onStatusUpdate,
  projectId,
  taskId,
}: DuplicateTaskFormProps) => {
  const { t } = useTranslation();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateTask();
  const { data: tasks, isLoading: tasksLoading } = useGetTasks({
    workspaceId,
    projectId,
  });
  const { data: project, isLoading: projectLoading } = useGetProject({
    projectId: projectId ?? "",
  });

  const { data: duplicatedTask, isLoading: duplicatedTaskLoading } = useGetTask(
    { taskId: taskId ?? "" }
  );

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      workspaceId,
      ...duplicatedTask,
      dueDate:
        duplicatedTask?.$createdAt && duplicatedTask?.dueDate
          ? addDays(
              new Date(),
              eachDayOfInterval({
                start: new Date(duplicatedTask.$createdAt),
                end: new Date(duplicatedTask.dueDate),
              }).length - 1
            )
          : new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: { ...values, workspaceId } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          window.location.href = `/workspaces/${workspaceId}/tasks/${data.$id}`;
          onCancel?.();
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full h-full border-none shadow-none rounded-none ">
        <CardHeader className="flex p-7">
          <CardTitle className="text-3xl font-bold">
            {t("modals.duplicate.task.title")}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("modals.create.task.sections.name.title")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            className="rounded-sm relative border-none shadow-none hover:bg-accent focus-visible:ring-neutral-400 cursor-default focus:cursor-text active:border-neutral-100 transition-all focus-visible:ring-2 ring-neutral-100 py-0 focus-visible:rounded-sm"
                            {...field}
                            disabled={isPending}
                            placeholder={t(
                              "modals.create.task.sections.name.placeholder"
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("modals.create.task.sections.duedate.title")}
                        </FormLabel>
                        <FormControl>
                          <DatePicker {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("modals.create.task.sections.assignee.title")}
                        </FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "modals.create.task.sections.assignee.placeholder"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {memberOptions.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center gap-x-2">
                                  <MemberAvatar
                                    name={member.name}
                                    className="size-6"
                                  />
                                  {member.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("modals.create.task.sections.status.title")}
                        </FormLabel>
                        <Select
                          defaultValue={
                            onStatusUpdate !== "" && onStatusUpdate !== null
                              ? onStatusUpdate
                              : field.value
                          }
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "modals.create.task.sections.status.placeholder"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={TaskStatus.BACKLOG}>
                              <div className="flex w-full items-center gap-x-4">
                                <Circle className="size-4 rounded-full bg-pink-400 p-2" />
                                {t(
                                  "modals.create.task.sections.status.statuses.BACKLOG"
                                )}
                              </div>
                            </SelectItem>
                            <SelectItem value={TaskStatus.TODO}>
                              <div className="flex w-full items-center gap-x-4">
                                <Circle className="size-4 rounded-full bg-red-400 p-2" />
                                {t(
                                  "modals.create.task.sections.status.statuses.TODO"
                                )}
                              </div>
                            </SelectItem>
                            <SelectItem value={TaskStatus.IN_PROGRESS}>
                              <div className="flex w-full items-center gap-x-4">
                                <Circle className="size-4 rounded-full bg-yellow-400 p-2" />
                                {t(
                                  "modals.create.task.sections.status.statuses.IN_PROGRESS"
                                )}
                              </div>
                            </SelectItem>
                            <SelectItem value={TaskStatus.IN_REVIEW}>
                              <div className="flex w-full items-center gap-x-4">
                                <Circle className="size-4 rounded-full bg-blue-400 p-2" />
                                {t(
                                  "modals.create.task.sections.status.statuses.IN_REVIEW"
                                )}
                              </div>
                            </SelectItem>
                            <SelectItem value={TaskStatus.DONE}>
                              <div className="flex w-full items-center gap-x-4">
                                <Circle className="size-4 rounded-full bg-emerald-400 p-2" />
                                {t(
                                  "modals.create.task.sections.status.statuses.DONE"
                                )}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("modals.create.task.sections.priority.title")}
                        </FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "modals.create.task.sections.priority.title"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={Priority.HIGH}>
                              <div className="flex w-full items-center gap-x-4">
                                <Circle className="size-4 rounded-full bg-red-600 p-2" />
                                {t(
                                  "modals.create.task.sections.priority.priorities.high"
                                )}
                              </div>
                            </SelectItem>
                            <SelectItem value={Priority.MEDIUM}>
                              <div className="flex w-full items-center gap-x-4">
                                <Circle className="size-4 rounded-full bg-green-600 p-2" />
                                {t(
                                  "modals.create.task.sections.priority.priorities.medium"
                                )}
                              </div>
                            </SelectItem>
                            <SelectItem value={Priority.LOW}>
                              <div className="flex w-full items-center gap-x-4">
                                <Circle className="size-4 rounded-full bg-yellow-700 p-2" />
                                {t(
                                  "modals.create.task.sections.priority.priorities.low"
                                )}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("modals.create.task.sections.project.title")}
                        </FormLabel>
                        <Select
                          defaultValue={project?.$id ?? field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "modals.create.task.sections.project.placeholder"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projectOptions.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                <div className="flex items-center gap-x-2">
                                  <ProjectAvatar
                                    name={project.name}
                                    className="size-6"
                                    image={project.imageUrl}
                                  />
                                  {project.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {onCancel && (
                    <Button
                      type="button"
                      size={"lg"}
                      disabled={isPending}
                      variant={"secondary"}
                      onClick={onCancel}
                      className={cn(!onCancel && "invisible")}
                    >
                      {t("modals.create.task.options.cancel")}
                    </Button>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button type="submit" disabled={isPending} size={"lg"}>
                    {t("modals.create.task.options.create")}
                  </Button>
                </motion.div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
