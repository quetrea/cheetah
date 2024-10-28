import { useQueryState, parseAsString } from "nuqs";

export const useUpdateTaskModal = () => {
  const [value, setValue] = useQueryState(
    "update-task-property",
    parseAsString.withOptions({ shallow: true })
  );

  const [taskId, setTaskId] = useQueryState(
    "taskId",
    parseAsString.withOptions({ shallow: true })
  );

  const open = (
    state: "name" | "status" | "projectId" | "dueDate" | "priority"
  ) => setValue(state);
  const close = () => {
    setValue(null);
    setTaskId(null);
  };

  return {
    value,
    taskId,
    setTaskId,
    open,
    close,
    setValue,
  };
};
