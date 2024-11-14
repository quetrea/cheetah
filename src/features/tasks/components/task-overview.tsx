import { Button } from "@/components/ui/button";
import { Task, TaskStatus } from "../types";
import { PencilIcon, PlusIcon, CheckIcon, XIcon } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { OverviewProperty } from "./overview-property";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { useGetLabels } from "@/features/labels/api/use-get-labels";

import { useCreateLabelModal } from "@/features/labels/hooks/use-create-label-modal";
import { useUpdateLabelModal } from "@/features/labels/hooks/use-update-label-modal";
import { Hint } from "@/components/hint";
import { format } from "date-fns";
import { TaskOverviewSkeleton } from "./skeletons/task-overview-skeleton";

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();

  const { data, isLoading } = useGetLabels({ taskId: task.$id });
  const { open: createModal, setProjectId } = useCreateLabelModal();
  const { open: updateModal, setLabelId } = useUpdateLabelModal();

  const handleCreate = async () => {
    setProjectId(task.projectId);
    createModal();
  };

  const handleUpdate = async (id: string) => {
    setLabelId(id);
    updateModal();
  };

  if (isLoading) {
    return <TaskOverviewSkeleton />;
  }

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted dark:bg-neutral-900 h-full rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            onClick={() => {
              open(task.$id);
            }}
            size="sm"
            variant={"secondary"}
          >
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex lg:flex-col xl:flex-row flex-col gap-y-1">
          <div className="flex flex-col flex-1">
            <div className="p-1 px-4 pb-2 text-sm flex items-center">
              <Badge className=" border-neutral-700" variant={"overview"}>
                Details
              </Badge>{" "}
              <span className="dark:bg-neutral-800 bg-neutral-400 p-1.5 rounded-r-md text-xs">
                Task Details
              </span>
            </div>
            <div className="p-4 flex flex-col gap-y-4 border border-neutral-300 rounded-lg">
              <OverviewProperty label="Assignee">
                <MemberAvatar name={task.assignee.name} className="size-6" />
                <p className="text-sm font-medium">{task.assignee.name}</p>
              </OverviewProperty>
              <OverviewProperty label="Created At">
                <div className="text-sm text-blue-500">
                  {format(task.$createdAt, "PPP")}
                </div>
              </OverviewProperty>
              <OverviewProperty label="End Date">
                <TaskDate
                  compeleted={task.status === TaskStatus.DONE}
                  value={task.dueDate}
                  className="text-sm font-medium"
                />
              </OverviewProperty>
              <OverviewProperty label="Status">
                <Badge variant={task.status}>
                  {snakeCaseToTitleCase(task.status)}
                </Badge>
              </OverviewProperty>
              <OverviewProperty label="Priority">
                <Badge variant={task.priority}>
                  {snakeCaseToTitleCase(task.priority)}
                </Badge>
              </OverviewProperty>
            </div>
          </div>
          <div>
            <DottedSeparator className=" py-7 hidden sm:block xs:block md:block lg:block xl:hidden" />
          </div>
          <div>
            <DottedSeparator
              direction="vertical"
              className=" px-7  hidden sm:hidden xs:hidden md:hidden lg:hidden xl:block"
            />
          </div>

          {data && data?.labels.total !== 0 ? (
            <div className="flex flex-col flex-1">
              <div className="p-1 px-4 pb-2">
                <Badge className="border-neutral-700" variant={"overview"}>
                  Labels
                </Badge>
                <span className="dark:bg-neutral-800 bg-neutral-400 p-1.5 rounded-r-md text-xs">
                  Task Labels
                </span>
              </div>
              <div className="p-4 flex flex-col gap-y-4 border border-neutral-300 rounded-lg h-full">
                {data.labels.total > 0 && (
                  <div className="flex items-center gap-x-2">
                    {data.labels.documents.map((item) => {
                      return (
                        <Hint key={item.$id} label={`Update to ${item.label}`}>
                          <Badge
                            className="cursor-pointer"
                            variant={"default"}
                            onClick={() => handleUpdate(item.$id)}
                          >
                            #{item.label}
                          </Badge>
                        </Hint>
                      );
                    })}
                    <Hint label={`Add new label`}>
                      <Button
                        onClick={handleCreate}
                        size={"smIcon"}
                        variant={"muted"}
                        className="rounded-full border  bg-neutral-200 dark:bg-neutral-600 dark:text-neutral-900 hover:dark:border dark:border-transparent hover:dark:border-neutral-300 hover:dark:bg-neutral-600/20 hover:dark:text-neutral-300 "
                      >
                        <PlusIcon className="size-4" />
                      </Button>
                    </Hint>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              <div className="p-1 px-4 pb-2">
                <Badge variant={"overview"}>Create Label</Badge>
              </div>
              <div className="p-4 flex flex-col gap-y-4 border border-neutral-300 rounded-lg h-full">
                <Button onClick={handleCreate}>Create a label</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
