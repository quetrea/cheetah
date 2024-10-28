"use client";
import { ResponsiveModal } from "@/components/responsive-modal";

import { useCreateLabelModal } from "../hooks/use-create-label-modal";
import { CreateLabelForm } from "./create-label-form";
import { useUpdateLabelModal } from "../hooks/use-update-label-modal";
import { UpdateLabelForm } from "./update-label-form";

export const UpdateLabelModal = () => {
  const { isOpen, setIsOpen, close, labelId } = useUpdateLabelModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      {labelId && <UpdateLabelForm onCancel={close} labelId={labelId} />}
    </ResponsiveModal>
  );
};
