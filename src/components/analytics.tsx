import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";
import { Skeleton } from "./ui/skeleton";
import { useTranslation } from "react-i18next";

// Analytics Card Skeleton Component

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  const { t } = useTranslation();
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={t("analytics.taskAnalytics.totalTask.title")}
            value={data.TaskCount}
            variant={data.TaskDifferent > 0 ? "up" : "down"}
            increaseValue={data.TaskDifferent}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={t("analytics.taskAnalytics.assigneedTask.title")}
            value={data.AssignedTaskCount}
            variant={data.AssignedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.AssignedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={t("analytics.taskAnalytics.completedTask.title")}
            value={data.CompletedTaskCount}
            variant={data.CompletedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.CompletedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={t("analytics.taskAnalytics.overDueTask.title")}
            value={data.OverdueTaskCount}
            variant={data.OverdueTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.OverdueTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={t("analytics.taskAnalytics.inCompleteTask.title")}
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


export default Analytics;
