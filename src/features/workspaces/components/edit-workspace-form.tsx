"use client";

import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";

import { updateWorkspaceSchema } from "../schemas";

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

import { Workspace } from "../types";
import { MemberRole } from "@/features/members/types";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  ImageIcon,
} from "lucide-react";

import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { toast } from "sonner";
import { useLeaveWorkspace } from "../api/use-leave-workspace";
import { useTranslation } from "react-i18next";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const { t } = useTranslation();
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
    `${t("modals.dialogs.delete.workspace.title")}`,
    `${t("modals.dialogs.delete.workspace.description")}`,
    "destructive"
  );
  const [LeaveDialog, confirmLeave] = useConfirm(
    `${t("modals.dialogs.leave.workspace.title")}`,
    `${t("modals.dialogs.leave.workspace.description")}`,
    "destructive"
  );

  const [ResetInviteCodeDialog, confirmReset] = useConfirm(
    `${t("modals.dialogs.reset.inviteCode.title")}`,
    `${t("modals.dialogs.reset.inviteCode.description")}`,
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
              <CardHeader className="flex flex-row items-center justify-between gap-x-4 p-7 space-y-0">
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
                    {t("modals.edit.back")}
                  </Button>
                </motion.div>
                <CardTitle className="text-xl flex-1 font-bold hidden md:inline-block">
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
                                {t(
                                  "modals.edit.workspace.formFields.titles.name"
                                )}
                              </motion.span>
                            </FormLabel>
                            <FormControl>
                              <motion.div whileTap={{ scale: 0.995 }}>
                                <Input
                                  {...field}
                                  disabled={isPending}
                                  placeholder={t(
                                    "modals.edit.workspace.formFields.placeholders.name"
                                  )}
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
                                <p className="text-sm">
                                  {t(
                                    "modals.edit.workspace.formFields.titles.icon"
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  JPG, PNG, SVG{" "}
                                  {t("modals.edit.workspace.formFields.or")}{" "}
                                  JPEG,{" "}
                                  {t(
                                    "modals.edit.workspace.formFields.values.max"
                                  )}{" "}
                                  5mb
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
                                      field.onChange("");
                                      if (inputRef.current) {
                                        inputRef.current.value = "";
                                      }
                                    }}
                                  >
                                    {t(
                                      "modals.edit.workspace.formFields.options.removeIcon"
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
                                      "modals.edit.workspace.formFields.options.uploadIcon"
                                    )}
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
                      className="flex  justify-between flex-col w-full md:flex-row md:items-center"
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
                          {t("modals.edit.workspace.formFields.options.cancel")}
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full"
                          type="submit"
                          disabled={isPending}
                          size={"lg"}
                        >
                          {isPending
                            ? "Saving..."
                            : ` ${t(
                                "modals.edit.workspace.formFields.options.save"
                              )}`}
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
              <h3 className="font-bold">
                {t("settingsSections.workspace.invite.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("settingsSections.workspace.invite.description")}
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
                    className="mt-0 w-fit ml-auto"
                    size={"sm"}
                    variant={"destructive"}
                    type="button"
                    disabled={isPending || isResettingInviteCode}
                    onClick={handleResetInviteCode}
                  >
                    {t("settingsSections.workspace.invite.button")}
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
                <h3 className="font-bold">
                  {t("settingsSections.workspace.delete.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("settingsSections.workspace.delete.description")}
                </p>
                <DottedSeparator className="py-7" />
                <Button
                  className="mt-0 w-fit ml-auto"
                  size={"sm"}
                  variant={"destructive"}
                  type="button"
                  disabled={isPending || isDeletingWorkspace}
                  onClick={handleDelete}
                >
                  {t("settingsSections.workspace.delete.button")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {data?.currentMember.role === MemberRole.MEMBER && (
          <Card className="w-full h-full shadow-none border border-amber-500">
            <CardContent className="p-7">
              <div className="flex flex-col ">
                <h3 className="font-bold">
                  {" "}
                  {t("settingsSections.workspace.leave.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("settingsSections.workspace.leave.description")}
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
                  {t("settingsSections.workspace.leave.button")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </>
  );
};
