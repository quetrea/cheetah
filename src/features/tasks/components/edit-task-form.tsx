"use client";
import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useCreateTask } from "../api/use-create-task";
import { createTaskSchema } from "../schemas";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Priority, Task, TaskStatus } from "../types";
import { Circle } from "lucide-react";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateTask } from "../api/use-update-task";
import { useTranslation } from "react-i18next";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
  initialValues: Task;
}

export const EditTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues,
}: EditTaskFormProps) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(
      createTaskSchema.omit({ workspaceId: true, description: true })
    ),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
      priority: initialValues.priority as Priority,
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: values, param: { taskId: initialValues.$id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none rounded-none">
      <CardHeader className="flex p-7 pb-4 ">
        <CardTitle className="text-3xl font-bold">
          {t("modals.edit.task.title")}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("modals.edit.task.sections.name.title")}
                    </FormLabel>

                    <FormControl>
                      <Input
                        className="rounded-sm border-none shadow-none hover:bg-accent focus-visible:ring-neutral-400 cursor-default focus:cursor-text active:border-neutral-100 transition-all focus-visible:ring-2 ring-neutral-100 py-0 focus-visible:rounded-sm"
                        {...field}
                        disabled={isPending}
                        placeholder={t(
                          "modals.edit.task.sections.name.placeholder"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {" "}
                      {t("modals.edit.task.sections.duedate.title")}
                    </FormLabel>

                    <FormControl>
                      <DatePicker
                        {...field}
                        placeholder={t(
                          "modals.edit.task.sections.duedate.placehodler"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {" "}
                      {t("modals.edit.task.sections.assignee.title")}
                    </FormLabel>

                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "modals.edit.task.sections.assignee.placeholder"
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("modals.edit.task.sections.status.title")}
                    </FormLabel>

                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "modals.edit.task.sections.status.placeholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKLOG}>
                          <div className="flex w-full items-center gap-x-4">
                            <Circle className="size-4 rounded-full bg-pink-400 p-2" />
                            {t(
                              "modals.edit.task.sections.status.statuses.BACKLOG"
                            )}
                          </div>
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>
                          <div className="flex w-full items-center gap-x-4">
                            <Circle className="size-4 rounded-full bg-red-400 p-2" />
                            {t(
                              "modals.edit.task.sections.status.statuses.TODO"
                            )}
                          </div>
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          <div className="flex w-full items-center gap-x-4">
                            <Circle className="size-4 rounded-full bg-yellow-400 p-2" />
                            {t(
                              "modals.edit.task.sections.status.statuses.IN_PROGRESS"
                            )}
                          </div>
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          <div className="flex w-full items-center gap-x-4">
                            <Circle className="size-4 rounded-full bg-blue-400 p-2" />
                            {t(
                              "modals.edit.task.sections.status.statuses.IN_REVIEW"
                            )}
                          </div>
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>
                          <div className="flex w-full items-center gap-x-4">
                            <Circle className="size-4 rounded-full bg-emerald-400 p-2" />
                            {t(
                              "modals.edit.task.sections.status.statuses.DONE"
                            )}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {" "}
                      {t("modals.edit.task.sections.priority.title")}
                    </FormLabel>

                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "modals.edit.task.sections.priority.placeholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value={Priority.HIGH}>
                          <div className="flex w-full items-center gap-x-4">
                            <Circle className="size-4 rounded-full bg-red-600 p-2" />
                            {t(
                              "modals.edit.task.sections.priority.priorities.high"
                            )}
                          </div>
                        </SelectItem>
                        <SelectItem value={Priority.MEDIUM}>
                          <div className="flex w-full items-center gap-x-4">
                            <Circle className="size-4 rounded-full bg-green-600 p-2" />
                            {t(
                              "modals.edit.task.sections.priority.priorities.medium"
                            )}
                          </div>
                        </SelectItem>
                        <SelectItem value={Priority.LOW}>
                          <div className="flex w-full items-center gap-x-4">
                            <Circle className="size-4 rounded-full bg-yellow-700 p-2" />
                            {t(
                              "modals.edit.task.sections.priority.priorities.low"
                            )}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {" "}
                      {t("modals.edit.task.sections.project.title")}
                    </FormLabel>

                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "modals.edit.task.sections.project.placeholder"
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
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size={"lg"}
                disabled={isPending}
                variant={"secondary"}
                onClick={onCancel}
                className={cn(!onCancel && "invisible")}
              >
                {t("modals.edit.task.options.cancel")}
              </Button>
              <Button type="submit" disabled={isPending} size={"lg"}>
                {t("modals.edit.task.options.save")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
