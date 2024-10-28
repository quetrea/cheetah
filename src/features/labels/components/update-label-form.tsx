"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { createLabelSchema, updateLabelSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { useUpdateLabel } from "../api/use-update-label";

interface UpdateLabelFormProps {
  labelId: string;
  onCancel?: () => void;
}

export const UpdateLabelForm = ({
  onCancel,
  labelId,
}: UpdateLabelFormProps) => {
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useUpdateLabel();

  const form = useForm<z.infer<typeof updateLabelSchema>>({
    resolver: zodResolver(updateLabelSchema),
    defaultValues: {
      workspaceId,
    },
  });

  const onSubmit = (values: z.infer<typeof updateLabelSchema>) => {
    console.log("Form submitted with values:", values);
    mutate(
      {
        json: {
          ...values,
          workspaceId,
        },
        param: { labelId: labelId },
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
        <CardTitle className="text-xl font-bold">Update label</CardTitle>
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
