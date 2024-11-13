import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TaskAnalyticsProps {
  analytics: {
    TaskCount: number;
    TaskDifferent: number;
    AssignedTaskCount: number;
    AssignedTaskDifference: number;
    CompletedTaskCount: number;
    InCompleteTaskCount: number;
    OverdueTaskCount: number;
  };
}

const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ analytics }) => {
  const data = {
    labels: [
      "Total Tasks",
      "Assigned Tasks",
      "Completed Tasks",
      "Incomplete Tasks",
      "Overdue Tasks",
    ],
    datasets: [
      {
        label: "Task Counts",
        data: [
          analytics.TaskCount,
          analytics.AssignedTaskCount,
          analytics.CompletedTaskCount,
          analytics.InCompleteTaskCount,
          analytics.OverdueTaskCount,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Total Tasks
          "rgba(255, 99, 132, 0.6)", // Assigned Tasks
          "rgba(54, 162, 235, 0.6)", // Completed Tasks
          "rgba(255, 206, 86, 0.6)", // Incomplete Tasks
          "rgba(255, 159, 64, 0.6)", // Overdue Tasks
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", // Total Tasks
          "rgba(255, 99, 132, 1)", // Assigned Tasks
          "rgba(54, 162, 235, 1)", // Completed Tasks
          "rgba(255, 206, 86, 1)", // Incomplete Tasks
          "rgba(255, 159, 64, 1)", // Overdue Tasks
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full gap-y-6 max-w-full mx-auto flex flex-col p-4 border-2 rounded-md border-transparent transition duration-300 hover:border-neutral-500 cursor-pointer ">
      <h2 className="text-center text-2xl">Task Analytics</h2>
      <Bar data={data} />
    </div>
  );
};

export default TaskAnalytics;
