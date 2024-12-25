"use client";
import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useCreateProject } from "../api/use-create-project";
import { createProjectSchema } from "../schemas";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useTranslation } from "react-i18next";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const { t } = useTranslation();
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useCreateProject();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          window.location.href = `/workspaces/${data.workspaceId}/projects/${data.$id}`;
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Dosya tipi kontrolü
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(
          "Invalid file type. Only PNG, JPEG, JPG and SVG files are allowed."
        );
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }

      // Dosya boyutu kontrolü
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size cannot be larger than 5MB.");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }

      form.setValue("image", file);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="w-full h-full border-none shadow-none">
        <motion.div variants={itemVariants}>
          <CardHeader className="flex p-8 pb-4 items-start">
            <CardTitle className="text-3xl font-bold">
              {t("modals.create.project.title")}
            </CardTitle>
            <CardDescription>
              {t("modals.create.project.description")}
            </CardDescription>
          </CardHeader>
        </motion.div>

        <div className="px-6">
          <DottedSeparator />
        </div>

        <CardContent className="p-8 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <motion.div
                className="flex flex-col gap-y-4"
                variants={itemVariants}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {" "}
                        {t("modals.create.project.formFields.titles.name")}
                      </FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder={t(
                            "modals.create.project.formFields.placeholders.name"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              className="object-cover"
                              fill
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Logo"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[38px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">
                            {" "}
                            {t("modals.create.project.formFields.titles.icon")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG
                            {t("modals.create.project.formFields.or")} JPEG,
                            {t("modals.create.project.formFields.values.max")}
                            5MB
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            accept=" .jpg, .png, jpeg, .svg"
                            ref={inputRef}
                            onChange={handleImageChange}
                            disabled={isPending}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              size={"sm"}
                              disabled={isPending}
                              variant={"destructive"}
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              {t(
                                "modals.create.project.formFields.options.removeIcon"
                              )}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant={"teritary"}
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              {t(
                                "modals.create.project.formFields.options.uploadIcon"
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </motion.div>

              <DottedSeparator className="py-7" />

              <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    size={"lg"}
                    disabled={isPending}
                    variant={"secondary"}
                    onClick={onCancel}
                    className={cn(!onCancel && "invisible")}
                  >
                    {t("modals.create.project.formFields.options.cancel")}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" disabled={isPending} size={"lg"}>
                    {t("modals.create.project.formFields.options.create")}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
