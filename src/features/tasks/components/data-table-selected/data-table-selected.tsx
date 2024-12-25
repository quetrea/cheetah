import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react"; // Lucide ikonları kullanıyoruz
import { Task } from "../../types";
import { toast } from "sonner";
import { useBulkDeleteTasks } from "../../api/use-bulk-delete-tasks";
import { useRouter } from "next/navigation";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface DataTableSelectedProps<TData> {
  table: Table<TData>;
}

export function DataTableSelected<TData>({
  table,
}: DataTableSelectedProps<TData>) {
  const { t } = useTranslation();
  const router = useRouter();
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map<Task>((row) => row.original as Task);

  const { mutate: bulkDeleteTasks, isPending: isDeletingTasks } =
    useBulkDeleteTasks();

  const handleEdit = () => {
    toast.error("This function is not yet available");
  };

  const handleDelete = () => {
    const taskIds = selectedRows.map((task) => task.$id);

    bulkDeleteTasks({
      json: {
        tasks: taskIds,
      },
    });
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <span className="text-sm text-muted-foreground">
        {t("table.selected", { selected: selectedRows.length })}
      </span>
      <div className="ml-auto flex gap-2">
        {/* <Button variant="outline" size="sm" onClick={handleEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Selected
        </Button> */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeletingTasks}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeletingTasks ? "Deleting..." : `${t("table.delete-select")}`}
        </Button>
      </div>
    </div>
  );
}
