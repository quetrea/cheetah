import { Progress } from "@/components/ui/progress";
import { SubTask } from "@/features/subtasks/types";

interface TaskProgressProps {
  subtasks: SubTask[];
}

export const TaskProgress = ({ subtasks }: TaskProgressProps) => {
  const total = subtasks.length;
  const completed = subtasks.filter((task) => task.completed).length;
  const progressPercentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Progress</span>
        <span>{progressPercentage}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <div className="text-xs text-muted-foreground">
        {completed} of {total} subtasks completed
      </div>
    </div>
  );
};
