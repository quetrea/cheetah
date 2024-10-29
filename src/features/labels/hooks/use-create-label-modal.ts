import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

export const useCreateLabelModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-label",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const [projectId, setProjectId] = useQueryState("projectId", parseAsString);

  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    setProjectId(null);
  };

  return {
    isOpen,
    open,
    setProjectId,
    projectId,
    close,
    setIsOpen,
  };
};
