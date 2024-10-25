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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/features/members/types";
import { useCurrent } from "@/features/auth/api/use-current";

export const MemberList = () => {
  const user = useCurrent();
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
  return (
    <>
      <ConfirmDialog />

      <Card className="w-full h-full border-none shadow-none dark:bg-neutral-900">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            className="dark:bg-neutral-950 dark:text-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-400"
            asChild
            variant={"secondary"}
            size={"sm"}
          >
            <Link href={`/workspaces/${workspaceId}`}>
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
            </Link>
          </Button>
          <CardTitle className="text-xl font-bold">Members list</CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          {data?.documents.map((member, index) => (
            <Fragment key={member.$id}>
              <div className="flex items-center gap-2 ">
                <MemberAvatar
                  name={member.name}
                  fallbackClassName="text-lg"
                  className="size-10"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>

                {data.currentMember.role === MemberRole.ADMIN &&
                  data.totalMembers > 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="ml-auto dark:bg-neutral-950 border border-neutral-700"
                          variant={"secondary"}
                          size={"icon"}
                        >
                          <MoreVerticalIcon className="size-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom" align="end">
                        {member.role !== MemberRole.ADMIN && (
                          <DropdownMenuItem
                            className="font-medium"
                            onClick={() =>
                              handleUpdateMember(member.$id, MemberRole.ADMIN)
                            }
                            disabled={updatingMember}
                          >
                            Set as Administrator
                          </DropdownMenuItem>
                        )}
                        {member.role !== MemberRole.MEMBER && (
                          <DropdownMenuItem
                            className="font-medium"
                            onClick={() =>
                              handleUpdateMember(member.$id, MemberRole.MEMBER)
                            }
                            disabled={updatingMember}
                          >
                            Set as Member
                          </DropdownMenuItem>
                        )}

                        {data?.totalMembers !== 1 && (
                          <DropdownMenuItem
                            className="font-medium text-amber-700"
                            onClick={() => handleDeleteMember(member.$id)}
                            disabled={deletingMember}
                          >
                            Kick from workspace
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
              </div>
              {index < data.documents.length - 1 && (
                <Separator className="my-2.5 " />
              )}
            </Fragment>
          ))}
        </CardContent>
      </Card>
    </>
  );
};
