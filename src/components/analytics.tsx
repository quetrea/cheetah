import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap  shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={"Total Tasks"}
            value={data.TaskCount}
            variant={data.TaskDifferent > 0 ? "up" : "down"}
            increaseValue={data.TaskDifferent}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={"Assigned Tasks"}
            value={data.AssignedTaskCount}
            variant={data.AssignedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.AssignedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={"Completed Tasks"}
            value={data.CompletedTaskCount}
            variant={data.CompletedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.CompletedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={"Overdue Tasks"}
            value={data.OverdueTaskCount}
            variant={data.OverdueTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.OverdueTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={"Incomplete Tasks"}
            value={data.InCompleteTaskCount}
            variant={data.InCompleteTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.InCompleteTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
