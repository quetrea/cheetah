"use client";
import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { createWorkspaceSchema } from "../schemas";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();

          router.push(`/workspaces/${data.$id}`);
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
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="w-full h-full border-none shadow-none">
        <motion.div variants={itemVariants}>
          <CardHeader className="flex p-7">
            <CardTitle className="text-xl font-bold">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Create a new workspace
              </motion.span>
            </CardTitle>
          </CardHeader>
        </motion.div>

        <motion.div variants={itemVariants} className="px-7">
          <DottedSeparator />
        </motion.div>

        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <motion.div
                className="flex flex-col gap-y-4"
                variants={itemVariants}
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            Workspace name
                          </motion.span>
                        </FormLabel>
                        <FormControl>
                          <motion.div whileTap={{ scale: 0.995 }}>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Enter workspace name"
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-5">
                          <AnimatePresence mode="wait">
                            {field.value ? (
                              <motion.div
                                key="image"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="size-[72px] relative rounded-md overflow-hidden"
                              >
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
                              </motion.div>
                            ) : (
                              <motion.div
                                key="avatar"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              >
                                <Avatar className="size-[72px]">
                                  <AvatarFallback>
                                    <ImageIcon className="size-[38px] text-neutral-400" />
                                  </AvatarFallback>
                                </Avatar>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <motion.div
                            className="flex flex-col"
                            variants={itemVariants}
                          >
                            <p className="text-sm">Workspace Icon</p>
                            <p className="text-sm text-muted-foreground">
                              JPG, PNG, SVG or JPEG, max 5mb
                            </p>
                            <input
                              className="hidden"
                              type="file"
                              accept=" .jpg, .png, jpeg, .svg"
                              ref={inputRef}
                              onChange={handleImageChange}
                              disabled={isPending}
                            />
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
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
                                  Remove Image
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  disabled={isPending}
                                  variant={"teritary"}
                                  className="w-fit mt-2"
                                  onClick={() => inputRef.current?.click()}
                                >
                                  Upload Image
                                </Button>
                              )}
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    )}
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <DottedSeparator className="py-7" />
              </motion.div>

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
                    Cancel
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" disabled={isPending} size={"lg"}>
                    {isPending ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Creating...
                      </motion.span>
                    ) : (
                      "Create Workspace"
                    )}
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
