import { getCurrent } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Tasks page",
};

const TasksPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="h-full flex flex-col select-none">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
