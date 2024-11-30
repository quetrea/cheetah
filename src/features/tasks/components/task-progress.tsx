"use client";
import { Progress } from "@/components/ui/progress";
import { SubTask } from "@/features/subtasks/types";
import Confetti from "react-confetti";
import { toast } from "sonner";
import { useEffect, useState, useMemo } from "react";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useUpdateTask } from "@/features/tasks/api/use-update-task";
import { TaskStatus } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface TaskProgressProps {
  subtasks: SubTask[];
}

const CompletionModal = ({
  show,
  onComplete,
}: {
  show: boolean;
  onComplete: () => void;
}) => {
  const [showCongrats, setShowCongrats] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);

      // Progress bar animasyonu
      const progressTimer = setTimeout(() => {
        setShowProgress(false);
      }, 2200);

      // Tebrik mesajı gösterimi
      const congratsTimer = setTimeout(() => {
        setShowCongrats(true);
      }, 2500);

      // Modal kapanışı
      const closeTimer = setTimeout(() => {
        setShowCongrats(false);
        setTimeout(() => {
          setIsAnimating(false);
          onComplete();
        }, 800);
      }, 4200);

      // Sadece animasyon state'ini temizle
      return () => {
        setIsAnimating(false);
      };
    }

    // Modal kapandığında state'leri sıfırla
    setShowProgress(true);
    setShowCongrats(false);
    setIsAnimating(false);
  }, [show, onComplete]);

  const modalContent = useMemo(() => {
    if (!show) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        style={{ pointerEvents: isAnimating ? "none" : "auto" }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 0, opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center justify-center gap-8 px-4 max-w-md w-full"
        >
          <AnimatePresence mode="wait">
            {showProgress && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full space-y-4"
              >
                <motion.div className="h-4 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: ["0%", "20%", "40%", "60%", "80%", "100%"],
                      scale: [1, 1.02, 1, 1.02, 1, 1.05],
                    }}
                    transition={{
                      duration: 2,
                      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                      ease: "easeInOut",
                    }}
                    className="h-full bg-gradient-to-r from-white via-white/90 to-white rounded-full"
                  />
                </motion.div>
              </motion.div>
            )}

            {showCongrats && (
              <motion.div
                key="congrats"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                className="text-center"
              >
                <motion.h2
                  className="text-4xl md:text-7xl font-bold text-white"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  🎉 Congratulations
                </motion.h2>
                <motion.p
                  className="text-lg text-white/90 mt-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  All subtasks are finished!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  }, [show, showProgress, showCongrats, isAnimating]);

  return modalContent;
};

export const TaskProgress = ({ subtasks }: TaskProgressProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const taskId = subtasks[0]?.taskId;
  const total = subtasks.length;
  const completed = subtasks.filter((task) => task.completed).length;
  const progressPercentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const { data: task } = useGetTask({ taskId });

  const [soundEnabled] = useLocalStorage("task-completion-sound-enabled", true);
  const [playSuccess] = useSound("/sounds/success.mp3", {
    volume: 1,
    soundEnabled,
  });

  const [lastCompletedCount, setLastCompletedCount] = useLocalStorage(
    `task-${taskId}-last-completed`,
    0
  );

  useEffect(() => {
    if (!task || !taskId || total === 0) return;

    const isFullyCompleted = completed === total;
    const wasJustCompleted =
      completed !== lastCompletedCount && isFullyCompleted;

    if (wasJustCompleted) {
      playSuccess();
      setShowConfetti(true);

      setTimeout(() => setShowConfetti(false), 5000);
    }

    setLastCompletedCount(completed);
  }, [completed, total, taskId, task, playSuccess]);

  const handleModalComplete = () => {
    setShowConfetti(false);
  };

  return (
    <>
      <CompletionModal show={showConfetti} onComplete={handleModalComplete} />

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
    </>
  );
};
