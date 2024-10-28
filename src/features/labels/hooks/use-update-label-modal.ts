import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

export const useUpdateLabelModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "update-label",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const [labelId, setLabelId] = useQueryState("labelId", parseAsString);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    setLabelId,
    labelId,
    close,
    setIsOpen,
  };
};
