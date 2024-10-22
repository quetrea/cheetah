import {
  useQueryState,
  parseAsBoolean,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import { Task, TaskStatus } from "../types";
import { useEffect } from "react";

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const [modalStatus, setStatus] = useQueryState("task-status", parseAsString);
  const [modalProject, setProject] = useQueryState(
    "task-project",
    parseAsString
  );

  const open = () => {
    setIsOpen(true);
  };

  const openWithStatus = (initialStatus: TaskStatus) => {
    setStatus(initialStatus);
    console.log(initialStatus);
    setIsOpen(true);
  };

  const close = () => {
    setStatus("");
    setIsOpen(false);
  };

  return {
    isOpen,
    setStatus,
    open,
    openWithStatus,
    close,
    setIsOpen,
    modalStatus,
  };
};
