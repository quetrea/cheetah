"use client";

import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: workspaces } = useGetWorkspaces();
  const { close, open } = useCreateWorkspaceModal();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between border-2 rounded-md p-2">
        <p className="text-xs uppercase text-neutral-500 font-bold">
          Workspaces
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue className="p-4" placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent className="dark:bg-neutral-900">
          {workspaces?.documents.map((workspace) => {
            return (
              <SelectItem key={workspace.$id} value={workspace.$id}>
                <div className="flex justify-start  items-center gap-3 font-medium">
                  <WorkspaceAvatar
                    image={workspace.imageUrl}
                    name={workspace.name}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
