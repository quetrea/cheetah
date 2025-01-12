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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  subDays,
  subMonths,
  subYears,
  eachDayOfInterval,
  format,
} from "date-fns";
import { TaskStatus, Priority } from "@/features/tasks/types";
import { tr, enUS } from "date-fns/locale";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type TimeRange = "1W" | "2W" | "1M" | "3M" | "1Y" | "3Y" | "5Y";

interface TaskAnalyticsProps {
  analytics: {
    TaskCount: number;
    TaskDifferent: number;
    AssignedTaskCount: number;
    AssignedTaskDifference: number;
    CompletedTaskCount: number;
    InCompleteTaskCount: number;
    OverdueTaskCount: number;
    dailyTasks: Array<{
      date: string;
      tasks: Array<{
        id: string;
        name: string;
        status: TaskStatus;
        priority: Priority;
        createdAt: number;
        dueDate: number | null;
      }>;
    }>;
  };
}

const statusColors = {
  [TaskStatus.BACKLOG]: "rgba(156, 163, 175, 0.7)", // Gri
  [TaskStatus.TODO]: "rgba(59, 130, 246, 0.7)", // Mavi
  [TaskStatus.IN_PROGRESS]: "rgba(245, 158, 11, 0.7)", // Turuncu
  [TaskStatus.IN_REVIEW]: "rgba(139, 92, 246, 0.7)", // Mor
  [TaskStatus.DONE]: "rgba(34, 197, 94, 0.7)", // Yeşil
};

const timeRangeOptions = [
  { value: "1W", translationKey: "1-week" },
  { value: "2W", translationKey: "2-weeks" },
  { value: "1M", translationKey: "1-month" },
  { value: "3M", translationKey: "3-months" },
  { value: "1Y", translationKey: "1-year" },
  { value: "3Y", translationKey: "3-years" },
  { value: "5Y", translationKey: "5-years" },
] as const;

const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ analytics }) => {
  const { t, i18n } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [hiddenStatuses, setHiddenStatuses] = useState<TaskStatus[]>([]);

  const getLocale = () => {
    switch (i18n.language) {
      case "tr":
        return tr;
      default:
        return enUS;
    }
  };

  const getDateRange = (range: TimeRange) => {
    const now = new Date();
    switch (range) {
      case "1W":
        return subDays(now, 7);
      case "2W":
        return subDays(now, 14);
      case "1M":
        return subMonths(now, 1);
      case "3M":
        return subMonths(now, 3);
      case "1Y":
        return subYears(now, 1);
      case "3Y":
        return subYears(now, 3);
      case "5Y":
        return subYears(now, 5);
    }
  };

  // Tarih aralığındaki tüm günleri oluştur
  const startDate = getDateRange(timeRange);
  const endDate = new Date();
  const allDates = eachDayOfInterval({ start: startDate, end: endDate });

  // Her gün için veri hazırla
  const tasksMap = new Map(
    analytics.dailyTasks.map((item) => [item.date, item.tasks])
  );

  const datasets = Object.values(TaskStatus)
    .filter((status) => !hiddenStatuses.includes(status))
    .map((status) => ({
      label: t(`tasks.task-switcher.data-filter.status.list.${status}`),
      data: allDates.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd", { locale: getLocale() });
        const tasks = tasksMap.get(dateStr) || [];
        return tasks.filter((task) => task.status === status).length;
      }),
      backgroundColor: statusColors[status],
      borderColor: statusColors[status].replace("0.7", "1"),
      borderWidth: 1,
      borderRadius: 5,
      maxBarThickness: 10,
    }));

  const data = {
    labels: allDates.map((date) =>
      format(date, "MMM dd", { locale: getLocale() })
    ),
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        external: function (context: any) {
          const tooltipEl = document.getElementById("chartjs-tooltip");
          if (!tooltipEl) return;

          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = "0";
            return;
          }

          // Tooltip verilerini al
          const date = allDates[tooltipModel.dataPoints[0].dataIndex];
          const formattedDate = format(date, "MMMM d, yyyy", {
            locale: getLocale(),
          });

          // HoverCard içeriğini güncelle
          const content = document.createElement("div");
          content.className = "space-y-2";

          // Başlık
          const title = document.createElement("div");
          title.className = "font-semibold border-b pb-2 mb-2";
          title.textContent = formattedDate;
          content.appendChild(title);

          // Status verileri
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tooltipModel.dataPoints.forEach((dataPoint: any) => {
            const status = Object.values(TaskStatus)[dataPoint.datasetIndex];
            const row = document.createElement("div");
            row.className = "flex justify-between items-center gap-4";

            const label = document.createElement("span");
            label.textContent = t(
              `tasks.task-switcher.data-filter.status.list.${status}`
            );
            label.className = "text-sm";

            const value = document.createElement("span");
            value.textContent = `${dataPoint.formattedValue}`;
            value.className = "font-medium";
            value.style.color = statusColors[status];

            row.appendChild(label);
            row.appendChild(value);
            content.appendChild(row);
          });

          tooltipEl.innerHTML = "";
          tooltipEl.appendChild(content);

          // Chart container'ını al
          const chartContainer = document.getElementById("chart-container");
          if (!chartContainer) return;

          // Tooltip stil ayarları
          tooltipEl.style.opacity = "1";
          tooltipEl.style.position = "absolute";

          // Bar'ın yanında konumlandırma
          const barX = tooltipModel.caretX;
          const barY = tooltipModel.caretY;
          const tooltipWidth = tooltipEl.offsetWidth;
          const chartWidth = chartContainer.offsetWidth;

          // Tooltip'i bar'ın sağında göster, eğer taşarsa solunda göster
          if (barX + tooltipWidth + 10 > chartWidth) {
            tooltipEl.style.left = `${barX - tooltipWidth - 10}px`;
          } else {
            tooltipEl.style.left = `${barX + 10}px`;
          }

          // Dikey pozisyonu bar'ın ortasına hizala
          tooltipEl.style.top = "0";
          tooltipEl.style.transform = `translateY(${barY}px)`;
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
      },
    },
  };

  const toggleStatus = (status: TaskStatus) => {
    setHiddenStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <motion.div className="w-full max-w-4xl mx-auto p-4 ">
      <motion.div className="w-full gap-y-6 p-6 border-2 rounded-lg border-transparent transition-all duration-300 hover:border-neutral-500 bg-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {t("analytics.taskAnalytics.title")}
          </h2>
          <Select
            value={timeRange}
            onValueChange={(value: TimeRange) => setTimeRange(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue
                placeholder={t("analytics.taskAnalytics.timeRange.select")}
              />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(
                    `analytics.taskAnalytics.timeRange.${option.translationKey}`
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div id="chart-container" className="relative w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={timeRange}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block"
            >
              <Bar data={data} options={options} />

              <div
                id="chartjs-tooltip"
                className="absolute pointer-events-none opacity-0 bg-popover text-popover-foreground rounded-md shadow-md p-3 min-w-[200px] z-50"
                style={{ transition: "all .1s ease" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          {Object.entries(statusColors).map(([status, color]) => {
            const isHidden = hiddenStatuses.includes(status as TaskStatus);
            const statusTasks = analytics.dailyTasks.flatMap((day) =>
              day.tasks.filter((task) => task.status === status)
            );

            return (
              <button
                key={status}
                onClick={() => toggleStatus(status as TaskStatus)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                  isHidden ? "opacity-50" : "opacity-100"
                }`}
                style={{
                  backgroundColor: color.replace("0.7", "0.1"),
                  borderColor: color,
                  borderWidth: "1px",
                }}
              >
                <span className="text-sm font-medium mb-1">
                  {t(`tasks.task-switcher.data-filter.status.list.${status}`)}
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: color.replace("0.7", "1") }}
                >
                  {statusTasks.length}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskAnalytics;
