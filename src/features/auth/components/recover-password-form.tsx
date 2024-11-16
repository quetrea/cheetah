"use client";
import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { updatePasswordRecovery } from "../schemas";
import { useRouter } from "next/navigation";
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

import { ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useUpdateRecoveryPassword } from "../api/use-update-recovery-password";

interface EditRecoveryPasswordProps {
  onCancel?: () => void;
  secret: string;
  initialValues: {
    id: string;
  };
}

export const EditRecoveryPassword = ({
  onCancel,
  secret,
  initialValues,
}: EditRecoveryPasswordProps) => {
  const router = useRouter();

  const { mutate, isPending } = useUpdateRecoveryPassword();

  const form = useForm<z.infer<typeof updatePasswordRecovery>>({
    resolver: zodResolver(updatePasswordRecovery),
    defaultValues: {
      ...initialValues,
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof updatePasswordRecovery>) => {
    mutate({
      form: {
        password: values.password,
      },
      param: {
        userId: initialValues.id,
        secret: secret,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-y-4 select-none dark:bg-neutral-950">
        <Card className="w-full h-full shadow-none border select-none border-sky-500">
          <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={onCancel ? onCancel : () => router.push(`/`)}
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-xl font-bold">Password Change</CardTitle>
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            disabled={isPending}
                            placeholder="Enter new password"
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
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
