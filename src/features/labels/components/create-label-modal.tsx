"use client";
import { ResponsiveModal } from "@/components/responsive-modal";

import { useCreateLabelModal } from "../hooks/use-create-label-modal";
import { CreateLabelForm } from "./create-label-form";

export const CreateLabelModal = () => {
  const { isOpen, setIsOpen, close, projectId } = useCreateLabelModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      {projectId && <CreateLabelForm onCancel={close} projectId={projectId} />}
    </ResponsiveModal>
  );
};
