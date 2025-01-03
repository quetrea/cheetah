"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DottedSeparator } from "@/components/dotted-separator";

import { useConfirm } from "@/hooks/use-confirm";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/features/members/types";
import { useCurrent } from "@/features/auth/api/use-current";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export const MemberList = () => {
  const { t } = useTranslation();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from workspace",
    "destructive"
  );

  const { data } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: deletingMember } = useDeleteMember();
  const { mutate: updateMember, isPending: updatingMember } = useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();

    if (!ok) return;

    deleteMember(
      {
        param: { memberId },
      },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const adminCount =
    data?.documents.filter((member) => member.role === MemberRole.ADMIN)
      .length || 0;

  return (
    <>
      <ConfirmDialog />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="w-full h-full border-none shadow-none dark:bg-neutral-950">
          <motion.div variants={headerVariants}>
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-400"
                  asChild
                  variant={"secondary"}
                  size={"sm"}
                >
                  <Link href={`/workspaces/${workspaceId}`}>
                    <ArrowLeftIcon className="size-4 mr-2" />
                    {t("settingsSections.members.back")}
                  </Link>
                </Button>
              </motion.div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t("settingsSections.members.title")}
              </CardTitle>
            </CardHeader>
          </motion.div>

          <div className="px-7">
            <DottedSeparator />
          </div>

          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {data?.documents.map((member, index) => (
                <motion.div
                  key={member.$id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20 }}
                  layout
                >
                  <div className="flex items-center gap-2 justify-between p-2">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MemberAvatar
                          name={member.name}
                          fallbackClassName="text-lg"
                          className="size-10"
                        />
                      </motion.div>

                      <motion.div
                        className="flex flex-col"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </motion.div>
                    </div>
                    {data.currentMember.role === MemberRole.ADMIN &&
                      data.totalMembers > 1 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                className="ml-auto dark:bg-neutral-950 "
                                variant={"outline"}
                                size={"icon"}
                              >
                                <MoreVerticalIcon className="size-5 text-muted-foreground" />
                              </Button>
                            </motion.button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="end">
                            {member.role !== MemberRole.ADMIN && (
                              <DropdownMenuItem
                                className="font-medium"
                                onClick={() =>
                                  handleUpdateMember(
                                    member.$id,
                                    MemberRole.ADMIN
                                  )
                                }
                                disabled={updatingMember}
                              >
                                {t("options.set-admin")}
                              </DropdownMenuItem>
                            )}
                            {adminCount > 1 &&
                              member.role !== MemberRole.MEMBER && (
                                <DropdownMenuItem
                                  className="font-medium"
                                  onClick={() =>
                                    handleUpdateMember(
                                      member.$id,
                                      MemberRole.MEMBER
                                    )
                                  }
                                  disabled={updatingMember}
                                >
                                  {t("options.set-member")}
                                </DropdownMenuItem>
                              )}

                            {data?.totalMembers !== 1 && (
                              <DropdownMenuItem
                                className="font-medium text-amber-700"
                                onClick={() => handleDeleteMember(member.$id)}
                                disabled={deletingMember}
                              >
                                {t("options.kick")}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                  </div>
                  {index < data.documents.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Separator className="my-2.5" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};
