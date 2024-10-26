import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { Priority, TaskStatus } from "../types";

export const useTasksFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
    priority: parseAsStringEnum(Object.values(Priority)),
  });
};
