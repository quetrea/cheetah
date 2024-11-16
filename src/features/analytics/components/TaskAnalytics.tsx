import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const TIME_FILTERS = [
  { value: "today", label: "Today" },
  { value: "last3days", label: "Last 3 Days" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
] as const;

const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ analytics }) => {
  const [timeFilter, setTimeFilter] =
    useState<(typeof TIME_FILTERS)[number]["value"]>("week");

  const options = {
    responsive: true,
    animation: {
      duration: 2000,
    },
    plugins: {
      legend: {
        display: false,
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
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  const getFilteredData = () => {
    const currentDate = new Date();
    const filteredData = { ...analytics };

    switch (timeFilter) {
      case "today":
        // Bugünün verisi
        break;
      case "last3days":
        // Son 3 günün verisi
        break;
      case "week":
        // Bu haftanın verisi
        break;
      case "month":
        // Bu ayın verisi
        break;
      case "year":
        // Bu yılın verisi
        break;
      default:
        return analytics;
    }

    return filteredData;
  };

  const filteredAnalytics = getFilteredData();

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
        data: [
          filteredAnalytics.TaskCount,
          filteredAnalytics.AssignedTaskCount,
          filteredAnalytics.CompletedTaskCount,
          filteredAnalytics.InCompleteTaskCount,
          filteredAnalytics.OverdueTaskCount,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-full gap-y-6 p-6 border-2 rounded-lg border-transparent transition-all duration-300 hover:border-neutral-500 hover:shadow-lg bg-card"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            className="text-2xl md:text-2xl  bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Task Analytics
          </motion.h2>

          <motion.div variants={itemVariants}>
            <Select
              value={timeFilter}
              onValueChange={(value) =>
                setTimeFilter(value as typeof timeFilter)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {TIME_FILTERS.map((filter) => (
                  <SelectItem
                    key={filter.value}
                    value={filter.value}
                    className="cursor-pointer"
                  >
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={timeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Bar data={data} options={options} />
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="grid grid-cols-5 gap-4 mt-6"
          variants={itemVariants}
        >
          {data.labels.map((label, index) => (
            <motion.div
              key={label}
              className="flex flex-col items-center justify-between p-2 md:p-3 rounded-lg h-20 md:h-24"
              style={{
                backgroundColor: data.datasets[0].backgroundColor[
                  index
                ].replace("0.6", "0.1"),
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-xs md:text-sm font-medium text-center">
                {label}
              </div>
              <div
                className="font-bold text-base md:text-xl"
                style={{ color: data.datasets[0].borderColor[index] }}
              >
                {data.datasets[0].data[index]}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TaskAnalytics;
