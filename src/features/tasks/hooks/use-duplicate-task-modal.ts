import { useQueryState, parseAsString } from "nuqs";

export const useDuplicateTaskModal = () => {
  const [taskId, setTaskId] = useQueryState("duplicated-task", parseAsString);

  const open = (id: string) => {
    setTaskId(id);
  };

  const close = () => setTaskId(null);

  return {
    taskId,
    setTaskId,
    open,
    close,
  };
};
