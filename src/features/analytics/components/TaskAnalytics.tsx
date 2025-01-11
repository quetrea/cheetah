import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [timeFilter, setTimeFilter] = useState("week");

  const data = {
    labels: [
      t("analytics.taskAnalytics.totalTask.title"),
      t("analytics.taskAnalytics.completedTask.title"),
      t("analytics.taskAnalytics.inCompleteTask.title"),
      t("analytics.taskAnalytics.overDueTask.title"),
    ],
    datasets: [
      {
        label: t("analytics.taskAnalytics.title"),
        data: [
          analytics.TaskCount,
          analytics.CompletedTaskCount,
          analytics.InCompleteTaskCount,
          analytics.OverdueTaskCount,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawTicks: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <motion.div className="w-full max-w-4xl mx-auto p-4">
      <motion.div
        className="w-full gap-y-6 p-6 border-2 rounded-lg border-transparent transition-all duration-300 hover:border-neutral-500 bg-card"
        whileHover={{ scale: 1.0 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">
          {t("analytics.taskAnalytics.title")}
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block"
          >
            <Bar data={data} options={options} />
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {data.labels.map((label, index) => (
            <div
              key={label}
              className="flex flex-col items-center justify-between p-2 rounded-lg h-20 md:h-24"
              style={{
                backgroundColor: data.datasets[0].backgroundColor[
                  index
                ].replace("0.6", "0.1"),
              }}
            >
              <div className="text-xs md:text-base font-medium text-center">
                {label}
              </div>
              <div
                className="font-bold text-base md:text-xl"
                style={{ color: data.datasets[0].borderColor[index] }}
              >
                {data.datasets[0].data[index]}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskAnalytics;
