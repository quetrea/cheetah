"use client";

import { z } from "zod"; // Zod kütüphanesi
import { useRef } from "react"; // React hookları
import Image from "next/image"; // Next.js Image bileşeni
import { useForm } from "react-hook-form"; // React Hook Form
import { zodResolver } from "@hookform/resolvers/zod"; // Zod ile form doğrulama
import { cn } from "@/lib/utils"; // Yardımcı fonksiyonlar
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";

import { updateWorkspaceSchema } from "../schemas";

// UI bileşenleri
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";

// Form bileşenleri
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Tipler
import { Workspace } from "../types";
import { MemberRole } from "@/features/members/types";

// İkonlar
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  ImageIcon,
} from "lucide-react";

// API çağrıları
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { toast } from "sonner"; // Toast bildirimleri
import { useLeaveWorkspace } from "../api/use-leave-workspace";
import { WebhookManager } from "@/features/webhooks/components/webhook-manager";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });

  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const { mutate: leavingWorkspace, isPending: isLeavingWorkspace } =
    useLeaveWorkspace();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone.",
    "destructive"
  );
  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave Workspace",
    "This action cannot be undone.",
    "destructive"
  );

  const [ResetInviteCodeDialog, confirmReset] = useConfirm(
    "Resetting invite link",
    "This action cannot be undone.",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;
    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  const handleLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) return;

    leavingWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;

    resetInviteCode({
      param: { workspaceId: initialValues.$id },
    });
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate({ form: finalValues, param: { workspaceId: initialValues.$id } });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <>
      <LeaveDialog />
      <DeleteDialog />
      <ResetInviteCodeDialog />
      <motion.div
        className="flex flex-col gap-y-4 select-none"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {data?.currentMember.role === MemberRole.ADMIN && (
          <motion.div variants={itemVariants}>
            <Card className="w-full h-full shadow-none border select-none border-sky-500">
              <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size={"sm"}
                    variant={"secondary"}
                    onClick={
                      onCancel
                        ? onCancel
                        : () => router.push(`/workspaces/${initialValues.$id}`)
                    }
                  >
                    <ArrowLeftIcon className="size-4 mr-2" />
                    Back
                  </Button>
                </motion.div>
                <CardTitle className="text-xl flex-1 font-bold">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {initialValues.name}
                  </motion.span>
                </CardTitle>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size={"sm"}
                    variant={"secondary"}
                    onClick={
                      onCancel
                        ? onCancel
                        : () =>
                            router.push(
                              `/workspaces/${initialValues.$id}/settings/webhooks`
                            )
                    }
                  >
                    <ArrowRightIcon className="size-4 mr-2" />
                    Webhooks
                  </Button>
                </motion.div>
              </CardHeader>
              <div className="px-7">
                <DottedSeparator />
              </div>
              <CardContent className="p-7">
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
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
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
                              <div className="flex flex-col">
                                <p className="text-sm">Workspace Icon</p>
                                <p className="text-sm text-muted-foreground">
                                  JPG,PNG,SVG or JPEG, max 2mb
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
                              </div>
                            </div>
                          </div>
                        )}
                      />
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
                          {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Card className="w-full h-full shadow-none border border-gray-500">
          <CardContent className="p-7">
            <div className="flex flex-col">
              <h3 className="font-bold">Invite Members</h3>
              <p className="text-sm text-muted-foreground">
                Share the invite link to add members to
                <span className="text-black dark:text-white font-bold ml-1">
                  {initialValues.name}
                </span>
              </p>
              <div className="mt-4">
                <div className="flex items-center gap-x-2">
                  <Input disabled value={fullInviteLink} />
                  <Button
                    onClick={handleCopyInviteLink}
                    variant={"secondary"}
                    className="size-12"
                  >
                    <CopyIcon className="size-5" />
                  </Button>
                </div>
              </div>
              {data?.currentMember.role === MemberRole.ADMIN && (
                <>
                  <DottedSeparator className="py-7" />
                  <Button
                    className="mt-6 w-fit ml-auto"
                    size={"sm"}
                    variant={"destructive"}
                    type="button"
                    disabled={isPending || isResettingInviteCode}
                    onClick={handleResetInviteCode}
                  >
                    Reset invite link
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        {data?.currentMember.role === MemberRole.ADMIN && (
          <Card className="w-full h-full shadow-none border border-amber-500">
            <CardContent className="p-7">
              <div className="flex flex-col ">
                <h3 className="font-bold">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Deleting a workspace is a irreversible and will remove all
                  associated data!
                </p>
                <DottedSeparator className="py-7" />
                <Button
                  className="mt-6 w-fit ml-auto"
                  size={"sm"}
                  variant={"destructive"}
                  type="button"
                  disabled={isPending || isDeletingWorkspace}
                  onClick={handleDelete}
                >
                  Delete Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {data?.currentMember.role === MemberRole.MEMBER && (
          <Card className="w-full h-full shadow-none border border-amber-500">
            <CardContent className="p-7">
              <div className="flex flex-col ">
                <h3 className="font-bold">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Leaving a workspace is a irreversible and will remove all your
                  data in the workspace!
                </p>
                <DottedSeparator className="py-7" />
                <Button
                  className="mt-6 w-fit ml-auto"
                  size={"sm"}
                  variant={"destructive"}
                  type="button"
                  disabled={isPending || isLeavingWorkspace}
                  onClick={handleLeave}
                >
                  Leave Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </>
  );
};
