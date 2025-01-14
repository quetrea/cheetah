"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  SkipForward,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Task, TaskStatus } from "@/features/tasks/types";
import { useUpdateTask } from "@/features/tasks/api/use-update-task";
import { DottedSeparator } from "@/components/dotted-separator";
import { TaskActions } from "@/features/tasks/components/task-actions";
import { SubTasks } from "@/features/subtasks/components/sub-tasks";

import {
  defaultSettings,
  PomodoroSettings,
  PomodoroSettingsModal,
} from "@/features/pomodoro/components/PomodoroSettings";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";

type TimerType = "pomodoro" | "shortBreak" | "longBreak";

export const PomodoroClient = () => {
  const { t } = useTranslation();

  const workspaceId = useWorkspaceId();
  const { data: tasks } = useGetTasks({ workspaceId });
  const { mutate: updateTask } = useUpdateTask();

  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pomodoroSettings");
      return saved ? JSON.parse(saved) : defaultSettings;
    }
    return defaultSettings;
  });

  const [timerType, setTimerType] = useState<TimerType>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(0);
  const tasksPerPage = 8;
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [isResetting, setIsResetting] = useState(false);

  const paginatedTasks = tasks?.documents.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const totalPages = tasks
    ? Math.ceil(tasks.documents.length / tasksPerPage)
    : 0;

  const durations = {
    pomodoro: settings.pomodoroTime * 60,
    shortBreak: settings.shortBreakTime * 60,
    longBreak: settings.longBreakTime * 60,
  };

  const calculateProgress = (timeLeft: number, duration: number) => {
    return ((duration - timeLeft) / duration) * 100;
  };

  useEffect(() => {
    setTimeLeft(durations[timerType]);
    setProgress(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerType, settings]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(calculateProgress(newTime, durations[timerType]));
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isMuted) {
        new Audio("/sounds/timer-end.mp3").play();
      }

      if (timerType === "pomodoro") {
        const newCycle = currentCycle + 1;
        setCurrentCycle(newCycle);

        if (newCycle >= settings.cyclesBeforeLongBreak) {
          setTimerType("longBreak");
          setCurrentCycle(0);
          if (activeTask) {
            updateTask({
              json: {
                status: TaskStatus.DONE,
              },
              param: {
                taskId: activeTask.$id,
              },
            });
          }
        } else {
          setTimerType("shortBreak");
        }
      } else if (timerType === "shortBreak") {
        setTimerType("pomodoro");
      } else if (timerType === "longBreak") {
        setTimerType("pomodoro");
        setIsRunning(false);
      }

      setTimeLeft(durations[timerType]);
      setProgress(0);

      sendNotification(
        t("pomodoro.notifications.timerEnded", {
          type: getTimerTypeLabel(timerType),
        })
      );
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isRunning,
    timeLeft,
    timerType,
    isMuted,
    activeTask,
    updateTask,
    currentCycle,
    settings,
  ]);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        return permission;
      } catch (error) {
        console.error("Notification permission not granted:", error);
        return "denied";
      }
    }
    return "denied";
  };

  const sendNotification = (title: string) => {
    if (notificationPermission === "granted") {
      new Notification(title);
    } else if (notificationPermission === "default") {
      requestNotificationPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title);
        }
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsResetting(true);
    setProgress(0);
    if (!isMuted) {
      new Audio("/sounds/timer-reset.mp3").play();
    }

    setTimeout(() => {
      setTimeLeft(durations[timerType]);
      setIsResetting(false);
      setIsRunning(false);
    }, 300);
  };

  const handleSettingsSave = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    localStorage.setItem("pomodoroSettings", JSON.stringify(newSettings));
    setTimeLeft(newSettings.pomodoroTime * 60);
    setProgress(0);
    setIsRunning(false);
  };

  const getTimerTypeLabel = (type: TimerType) => {
    switch (type) {
      case "pomodoro":
        return t("pomodoro.timer.tabs.pomodoro");
      case "shortBreak":
        return t("pomodoro.timer.tabs.shortBreak");
      case "longBreak":
        return t("pomodoro.timer.tabs.longBreak");
    }
  };

  const handleTaskSelect = (task: Task) => {
    setActiveTask(task);
    setIsResetting(true);
    setProgress(0);

    setTimeout(() => {
      setTimeLeft(durations[timerType]);
      setIsResetting(false);
      setIsRunning(false);
    }, 300);
  };

  const handleStart = async () => {
    setIsRunning(true);
    if (!isMuted) {
      new Audio("/sounds/timer-start.mp3").play();
    }

    sendNotification(
      t("pomodoro.notifications.started", {
        taskName: activeTask?.name || t("pomodoro.tasks.noTaskSelected"),
      })
    );
  };

  const handleSkip = () => {
    setTimeLeft(0);
    setProgress(0);
    setIsRunning(false);

    if (timerType === "pomodoro") {
      const newCycle = currentCycle + 1;
      setCurrentCycle(newCycle);

      if (newCycle >= settings.cyclesBeforeLongBreak) {
        setTimerType("longBreak");
        setCurrentCycle(0);
      } else {
        setTimerType("shortBreak");
      }
    } else if (timerType === "shortBreak") {
      setTimerType("pomodoro");
    } else if (timerType === "longBreak") {
      setTimerType("pomodoro");
      setIsRunning(false);
    }

    setTimeLeft(durations[timerType]);

    if (!isMuted) {
      new Audio("/sounds/timer-skip.mp3").play();
    }

    sendNotification(t("pomodoro.notifications.skipped"));
  };

  useEffect(() => {
    document.title = `${getTimerTypeLabel(timerType)} - ${formatTime(
      timeLeft
    )}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerType, timeLeft]);

  const formatEndTime = () => {
    const endTime = new Date(Date.now() + timeLeft * 1000);
    return endTime.toLocaleTimeString();
  };

  const formatTotalEndTime = () => {
    const totalDuration = (currentCycle + 1) * settings.pomodoroTime * 60; // toplam süre (saniye cinsinden)
    const endTime = new Date(Date.now() + totalDuration * 1000);
    return endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto flex  items-center justify-center p-4 sm:p-4 mt-2 md:mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 ">
        <Card className="bg-white  dark:bg-neutral-900 lg:min-w-[300px]">
          <div className="p-4 sm:p-6">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3 sm:p-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("pomodoro.info.title")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-neutral-300">
                {t("pomodoro.info.description")}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3 sm:p-4">
              <p className="text-sm text-gray-600 dark:text-neutral-300">
                {t("pomodoro.cycles.completed", {
                  count: currentCycle,
                  total: settings.cyclesBeforeLongBreak,
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-neutral-300">
                {t("pomodoro.endTime", { endTime: formatTotalEndTime() })}
              </p>
            </div>

            <Tabs
              defaultValue="pomodoro"
              value={timerType}
              onValueChange={(value) => setTimerType(value as TimerType)}
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-neutral-800">
                <TabsTrigger
                  onClick={() => setIsRunning(false)}
                  value="pomodoro"
                  className="text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700"
                >
                  {t("pomodoro.timer.tabs.pomodoro")}
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setIsRunning(false)}
                  value="shortBreak"
                  className="text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700"
                >
                  {t("pomodoro.timer.tabs.shortBreak")}
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setIsRunning(false)}
                  value="longBreak"
                  className="text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700"
                >
                  {t("pomodoro.timer.tabs.longBreak")}
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col items-center py-6 sm:py-8 space-y-6 sm:space-y-8">
                <div className="text-5xl sm:text-7xl font-mono font-bold text-gray-900 dark:text-white">
                  {formatTime(timeLeft)}
                </div>

                <div className="w-full max-w-md">
                  <div className="h-3 bg-gray-100 dark:bg-neutral-800 rounded-full p-0.5 border border-gray-200 dark:border-neutral-700">
                    <AnimatePresence>
                      <motion.div
                        key={`progress-${isResetting}`}
                        initial={
                          isResetting
                            ? { width: `${progress}%` }
                            : { width: "0%" }
                        }
                        animate={{ width: `${progress}%` }}
                        transition={{
                          duration: isResetting ? 0.3 : 0,
                          ease: "easeInOut",
                        }}
                        className={cn(
                          "h-full rounded-full",
                          "bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400",
                          "shadow-[0_0_8px_rgba(59,130,246,0.5)] dark:shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                        )}
                      />
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    title={t("pomodoro.settings.title")}
                    variant={"outline"}
                    size={"icon"}
                  >
                    <PomodoroSettingsModal
                      settings={settings}
                      onSave={handleSettingsSave}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 border-gray-200 dark:border-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={
                      isRunning ? () => setIsRunning(false) : handleStart
                    }
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 border-gray-200 dark:border-white/20 min-w-[120px]"
                  >
                    {isRunning ? (
                      <span className="flex items-center gap-2">
                        <Pause className="h-4 w-4" />
                        {t("pomodoro.controls.pause")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        {t("pomodoro.controls.start")}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    title={t("pomodoro.controls.reset")}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 border-gray-200 dark:border-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSkip}
                    title={t("pomodoro.controls.skip")}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 border-gray-200 dark:border-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <Card className="bg-gray-50 flex flex-col gap-y-4 dark:bg-neutral-800 rounded-lg p-4 w-full max-w-md">
                  <CardHeader className="flex  p-0 border-white">
                    <div>
                      <CardTitle className=" text-xl flex items-center justify-between text-neutral-900 font-bold dark:text-white">
                        {t("pomodoro.tasks.current")}
                        <div className="text-sm text-gray-500  dark:text-neutral-400">
                          {getTimerTypeLabel(timerType)}
                        </div>
                      </CardTitle>{" "}
                    </div>
                  </CardHeader>
                  <CardContent className=" dark:bg-neutral-900 font-medium rounded-md p-4">
                    {activeTask ? (
                      <div className="flex flex-row gap-y-2">
                        <div className="flex flex-col gap-y-2 w-full">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                            {t("tasks.overview.info")}
                          </h3>
                          <DottedSeparator className="my-3" />
                          <div className="flex flex-row text-sm justify-between text-neutral-700 dark:text-neutral-200">
                            <p className="text-neutral-700 dark:text-neutral-200 text-sm ">
                              {t("table.task-name")}
                            </p>
                            <div className="text-neutral-600 truncate dark:text-neutral-400 text-sm ">
                              {activeTask.name}
                            </div>
                          </div>
                          <div className="flex flex-row justify-between text-sm text-neutral-700 dark:text-neutral-700   gap-x-2 items-center">
                            <div className="text-neutral-700 dark:text-neutral-200 text-sm ">
                              {t("table.project")}
                            </div>{" "}
                            <div className="flex flex-row gap-x-2 items-center">
                              <ProjectAvatar
                                className="text-sm"
                                image={activeTask.project.imageUrl}
                                name={activeTask.project.name}
                              />
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {activeTask.project.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-row justify-between text-sm text-neutral-200   gap-x-2 items-center">
                            <div className="text-neutral-700 dark:text-neutral-200 text-sm ">
                              {t("table.assignee")}
                            </div>{" "}
                            <div className="flex flex-row gap-x-2 items-center">
                              <MemberAvatar name={activeTask.assignee.name} />
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {activeTask.assignee.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-center text-gray-500 dark:text-neutral-400">
                        {t("pomodoro.tasks.noTaskSelected")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Tabs>
          </div>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 lg:min-w-[300px]">
          <div className="p-4 flex flex-col h-[400px] sm:h-[500px]">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-xl font-medium">
                {t("pomodoro.tasks.title")}
              </h3>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-6 w-6 p-0 border-gray-200 dark:border-white/20"
                >
                  ←
                </Button>
                <span className="text-xs text-gray-500 dark:text-neutral-400">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-6 w-6 p-0 border-gray-200 dark:border-white/20"
                >
                  →
                </Button>
              </div>
            </div>

            <DottedSeparator className="mb-3" />

            <div className="space-y-2 overflow-y-auto flex-1">
              {paginatedTasks?.map((task) => (
                <div
                  key={task.$id}
                  className={cn(
                    "group flex items-center justify-between",
                    "rounded-lg transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-neutral-600",
                    activeTask?.$id === task.$id
                      ? "bg-gray-100 dark:bg-neutral-600"
                      : "bg-gray-50 dark:bg-neutral-700"
                  )}
                >
                  <button
                    onClick={() => handleTaskSelect(task)}
                    className="flex-1 px-3 py-2.5 text-left text-sm text-gray-900 dark:text-white"
                  >
                    {task.name}
                  </button>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                    <TaskActions id={task.$id} projectId={task.projectId}>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </TaskActions>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 lg:min-w-[300px] h-full">
          <AnimatePresence>
            {activeTask && (
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <SubTasks task={activeTask} isPomodoro={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
};
