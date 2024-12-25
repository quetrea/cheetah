"use client";
import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  passwordRecovery,
  updateAccountEmailAndPassword,
  updateAccountName,
  updatePasswordSchema,
} from "../schemas";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

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
import { AlertCircle, ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateAccountName } from "../api/use-update-name";

import { User } from "../types";
import { useUpdateAccountEmail } from "../api/use-update-email";
import { useCreatePasswordRecovery } from "../api/use-create-recovery-password";
import { useUpdatePassword } from "../api/use-update-password";
import { useTranslation } from "react-i18next";

interface EditAccountSettingsProps {
  onCancel?: () => void;
  initialValues: {
    id: string;
    name: string;
    email: string;
  };
}

export const EditAccountSettings = ({
  onCancel,
  initialValues,
}: EditAccountSettingsProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: nameUpdate, isPending } = useUpdateAccountName();
  const { mutate: emailUpdate, isPending: isUpdatingEmail } =
    useUpdateAccountEmail();
  const { mutate: passwordCreate } = useCreatePasswordRecovery();

  const { mutate: changePassword, isPending: isLoadingChangePassword } =
    useUpdatePassword();

  const [UpdateDialog, confirmUpdate] = useConfirm(
    `${t("account.dialogs.update.title")}`,
    `${t("account.dialogs.update.description")}`,
    "primary"
  );

  const form = useForm<z.infer<typeof updateAccountName>>({
    resolver: zodResolver(updateAccountName),
    defaultValues: {
      ...initialValues,
      name: initialValues.name,
    },
  });

  const formUpdateEmail = useForm<
    z.infer<typeof updateAccountEmailAndPassword>
  >({
    resolver: zodResolver(updateAccountEmailAndPassword),
    defaultValues: {
      ...initialValues,
      email: "",
      password: "",
    },
  });
  const formUpdatePassword = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      ...initialValues,
      oldPassword: "",
      password: "",
    },
  });

  const onEmailChangeSubmit = async (
    values: z.infer<typeof updateAccountEmailAndPassword>
  ) => {
    emailUpdate(
      {
        form: { email: values.email, password: values.password },
      },
      {
        onSuccess: () => {
          formUpdateEmail.reset();
        },
      }
    );
  };

  const onPasswordChangeSubmit = async (
    values: z.infer<typeof updatePasswordSchema>
  ) => {
    changePassword(
      {
        form: { oldPassword: values.oldPassword, password: values.password },
      },
      {
        onSuccess: () => {
          formUpdatePassword.reset();
        },
      }
    );
  };

  const onSubmit = async (values: z.infer<typeof updateAccountName>) => {
    const ok = await confirmUpdate();
    if (!ok) return;

    nameUpdate(
      {
        form: { name: values.name || initialValues.name },
        param: { userId: initialValues.id },
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  const onSubmitRecovery = () => {
    passwordCreate({
      json: {
        email: initialValues.email,
      },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <UpdateDialog />
      <motion.div
        className="flex flex-col gap-y-4 select-none"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants}>
          <Card className="w-full h-full shadow-none border select-none border-sky-500">
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
              <Button
                size={"sm"}
                variant={"secondary"}
                onClick={onCancel ? onCancel : () => router.push(`/`)}
              >
                <ArrowLeftIcon className="size-4 mr-2" />
                {t("settingsSections.account.back")}
              </Button>
              <CardTitle className="text-xl font-bold">
                {initialValues.name}
              </CardTitle>
            </CardHeader>
            <div className="px-7">
              <DottedSeparator />
            </div>
            <CardContent className="p-7">
              <div className="">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {" "}
                              {t(
                                "settingsSections.account.sections.update.formFields.titles.name"
                              )}
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder={t(
                                  "settingsSections.account.sections.update.formFields.placeholders.name"
                                )}
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
                        {t(
                          "settingsSections.account.sections.update.formFields.options.cancel"
                        )}
                      </Button>
                      <Button
                        type="submit"
                        className="px-3.5"
                        disabled={isPending}
                      >
                        {t(
                          "settingsSections.account.sections.update.formFields.options.save"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="w-full h-full shadow-none border select-none border-sky-500">
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
              <CardTitle className="text-xl font-bold">
                {t("settingsSections.account.sections.change-email.title")}
              </CardTitle>
            </CardHeader>
            <div className="px-7">
              <DottedSeparator />
            </div>
            <CardContent className="p-7">
              <Form {...formUpdateEmail}>
                <form
                  onSubmit={formUpdateEmail.handleSubmit(onEmailChangeSubmit)}
                >
                  <div className=" flex flex-col gap-y-4 items-center">
                    <div className="flex gap-4">
                      <FormField
                        control={formUpdateEmail.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {" "}
                              {t(
                                "settingsSections.account.sections.change-email.formFields.titles.email"
                              )}
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                disabled={isUpdatingEmail}
                                placeholder={t(
                                  "settingsSections.account.sections.change-email.formFields.placeholders.email"
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formUpdateEmail.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {" "}
                              {t(
                                "settingsSections.account.sections.change-email.formFields.titles.password"
                              )}
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                autoComplete="off"
                                aria-autocomplete="none"
                                type={"password"}
                                disabled={isUpdatingEmail}
                                placeholder={t(
                                  "settingsSections.account.sections.change-email.formFields.placeholders.password"
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex-col  flex items-start gap-y-2  w-full rounded-md">
                      <p className="flex text-xs items-center gap-x-2">
                        <AlertCircle className="size-4" />
                        {t(
                          "settingsSections.account.sections.change-email.formFields.doesnt-work"
                        )}
                      </p>
                      <span
                        onClick={() => onSubmitRecovery()}
                        className="text-xs flex justify-end hover:underline text-sky-700 cursor-pointer"
                      >
                        {t(
                          "settingsSections.account.sections.change-email.formFields.recovery-span"
                        )}
                      </span>
                    </div>
                  </div>
                  <DottedSeparator className="my-4" />
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      size={"lg"}
                      disabled={isPending}
                      variant={"secondary"}
                      onClick={onCancel}
                      className={cn(!onCancel && "invisible")}
                    >
                      {t(
                        "settingsSections.account.sections.change-email.formFields.options.cancel"
                      )}
                    </Button>
                    <Button
                      variant={"primary"}
                      type="submit"
                      disabled={isPending}
                      className="px-3.5 py-2"
                    >
                      {t(
                        "settingsSections.account.sections.change-email.formFields.options.save"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="w-full h-full shadow-none border select-none border-sky-500">
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
              <CardTitle className="text-xl font-bold">
                {t("settingsSections.account.sections.change-password.title")}
              </CardTitle>
            </CardHeader>
            <div className="px-7">
              <DottedSeparator />
            </div>
            <CardContent className="p-7">
              <Form {...formUpdatePassword}>
                <form
                  onSubmit={formUpdatePassword.handleSubmit(
                    onPasswordChangeSubmit
                  )}
                >
                  <div className=" flex flex-col gap-y-4 items-center">
                    <div className="flex gap-4">
                      <FormField
                        control={formUpdatePassword.control}
                        name="oldPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {" "}
                              {t(
                                "settingsSections.account.sections.change-password.formFields.titles.old-password"
                              )}
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                type={"password"}
                                disabled={isLoadingChangePassword}
                                placeholder={t(
                                  "settingsSections.account.sections.change-password.formFields.placeholders.old-password"
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formUpdatePassword.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                "settingsSections.account.sections.change-password.formFields.titles.password"
                              )}
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                aria-autocomplete="none"
                                type={"password"}
                                disabled={isLoadingChangePassword}
                                placeholder={t(
                                  "settingsSections.account.sections.change-password.formFields.placeholders.password"
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex-col  flex items-start gap-y-2  w-full rounded-md">
                      <p className="flex text-xs items-center gap-x-2">
                        <AlertCircle className="size-4" />
                        {t(
                          "settingsSections.account.sections.change-password.formFields.doesnt-work"
                        )}
                      </p>
                      <span
                        onClick={() => onSubmitRecovery()}
                        className="text-xs flex justify-end hover:underline text-sky-700 cursor-pointer"
                      >
                        {t(
                          "settingsSections.account.sections.change-password.formFields.recovery-span"
                        )}
                      </span>
                    </div>
                  </div>
                  <DottedSeparator className="my-4" />
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      size={"lg"}
                      disabled={isPending}
                      variant={"secondary"}
                      onClick={onCancel}
                      className={cn(!onCancel && "invisible")}
                    >
                      {t(
                        "settingsSections.account.sections.change-password.formFields.options.cancel"
                      )}
                    </Button>
                    <Button
                      variant={"primary"}
                      type="submit"
                      disabled={isPending}
                      className="px-3.5 py-2"
                    >
                      {t(
                        "settingsSections.account.sections.change-password.formFields.options.save"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};
