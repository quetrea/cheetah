import { useGetLabels } from "@/features/labels/api/use-get-labels";
import { Badge } from "@/components/ui/badge";
import { Hint } from "@/components/hint";
import { useUpdateLabelModal } from "@/features/labels/hooks/use-update-label-modal";

interface LabelsColumnProps {
  taskId: string;
}

export const LabelsColumn = ({ taskId }: LabelsColumnProps) => {
  const { data, isPending } = useGetLabels({ taskId: taskId });
  const { open: updateModal, setLabelId } = useUpdateLabelModal();

  const handleUpdate = async (id: string) => {
    setLabelId(id);
    updateModal();
  };
  return (
    <div className="flex items-center gap-x-2 text-sm font-medium">
      {data && data.labels.total > 0 && data.labels.documents ? (
        <div className="flex">
          {data.labels.documents.slice(0, 1).map((item) => (
            <Hint key={item.$id} label={`Update to ${item.label}`}>
              <Badge
                className="cursor-pointer"
                variant={"default"}
                onClick={() => handleUpdate(item.$id)}
              >
                #{item.label}
              </Badge>
            </Hint>
          ))}
        </div>
      ) : (
        <Badge
          className="cursor-pointer  text-neutral-500 bg-muted"
          variant={"default"}
        >
          Unsigned
        </Badge>
      )}
    </div>
  );
};
