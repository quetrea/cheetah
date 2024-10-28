"use client";
import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { createLabelSchema } from "../schemas";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateLabel } from "../api/use-create-label";

import { useCurrent } from "@/features/auth/api/use-current";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";

interface CreateLabelFormProps {
  projectId: string;
  onCancel?: () => void;
}

export const CreateLabelForm = ({
  onCancel,
  projectId,
}: CreateLabelFormProps) => {
  const workspaceId = useWorkspaceId();
  const taskId = useTaskId();

  const { mutate, isPending } = useCreateLabel();

  const form = useForm<z.infer<typeof createLabelSchema>>({
    resolver: zodResolver(createLabelSchema),
    defaultValues: {
      workspaceId,
      taskId,
      projectId,
    },
  });

  const onSubmit = (values: z.infer<typeof createLabelSchema>) => {
    console.log("Form submitted with values:", values);
    mutate(
      {
        json: {
          ...values,
          projectId: projectId,
          taskId: taskId,
          workspaceId: workspaceId,
        },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onCancel?.();
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new label</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label name</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter label name"
                      />
                    </FormControl>
                    <FormMessage />
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
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} size={"lg"}>
                Create label
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
