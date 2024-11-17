"use client";
import { Progress } from "@/components/ui/progress";
import { SubTask } from "@/features/subtasks/types";
import Confetti from "react-confetti";
import { toast } from "sonner";
import { useEffect, useState, memo } from "react";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useUpdateTask } from "@/features/tasks/api/use-update-task";
import { TaskStatus } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface TaskProgressProps {
  subtasks: SubTask[];
}

const CompletionModal = memo(({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={1}
        gravity={0.3}
        tweenDuration={4000}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center cursor-pointer"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="text-center px-4"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            🎉 Tebrikler!
          </h2>
          <p className="text-2xl md:text-3xl text-white/90">
            Ana görev başarıyla tamamlandı.
          </p>
        </motion.div>
      </motion.div>
    </>
  );
});

CompletionModal.displayName = "CompletionModal";

export const TaskProgress = ({ subtasks }: TaskProgressProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const taskId = subtasks[0]?.taskId;
  const total = subtasks.length;
  const completed = subtasks.filter((task) => task.completed).length;
  const progressPercentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const { data: task } = useGetTask({ taskId });
  const { mutate: updateTask } = useUpdateTask({ showSuccessToast: false });

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
      toast.success("🎉 Tebrikler! Tüm görevleri tamamladın!", {
        duration: 4000,
        className: "success-toast",
      });
      setTimeout(() => setShowConfetti(false), 5000);
    }

    setLastCompletedCount(completed);
  }, [completed, total, taskId, task, playSuccess]);

  return (
    <>
      <AnimatePresence>
        {showConfetti && <CompletionModal show={showConfetti} />}
      </AnimatePresence>

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
