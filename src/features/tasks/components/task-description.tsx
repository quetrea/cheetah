import { Button } from "@/components/ui/button";
import { Task } from "../types";
import { PencilIcon, XIcon } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { useState } from "react";
import { useUpdateTask } from "../api/use-update-task";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

// Quill'i client-side only olarak import ediyoruz
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "link",
];

// Modern stil ayarları
const customStyles = `
  .ql-toolbar {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-color: hsl(var(--border));
    background: hsl(var(--muted));
  }
  
  .ql-container {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    border-color: hsl(var(--border));
    background: hsl(var(--background));
  }

  .ql-editor {
    min-height: 120px;
    font-size: 0.925rem;
    line-height: 1.6;
  }

  .ql-editor.ql-blank::before {
    color: hsl(var(--muted-foreground));
    font-style: normal;
  }

  .dark .ql-snow .ql-stroke {
    stroke: hsl(var(--foreground));
  }

  .dark .ql-snow .ql-fill {
    fill: hsl(var(--foreground));
  }

  .dark .ql-toolbar.ql-snow .ql-picker-label {
    color: hsl(var(--foreground));
  }
`;

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description || "");

  const { mutate, isPending } = useUpdateTask();

  // HTML temizleme fonksiyonu
  const cleanHTML = (html: string) => {
    return html
      .replace(/<p><br><\/p>/g, "") // Boş paragrafları kaldır
      .replace(/(<p>|<\/p>)/g, "") // Gereksiz p etiketlerini kaldır
      .trim();
  };

  const handleSave = () => {
    // Kaydetmeden önce HTML'i temizle
    const cleanedValue = cleanHTML(value);
    mutate(
      {
        json: { description: cleanedValue },
        param: { taskId: task.$id },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <style>{customStyles}</style>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Task Description
          </p>
          {!isEditing && !value && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
              No description
            </span>
          )}
        </div>
        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          size="sm"
          variant={isEditing ? "destructive" : "secondary"}
          className="transition-all duration-200"
        >
          {isEditing ? (
            <XIcon className="size-4 mr-2" />
          ) : (
            <PencilIcon className="size-4 mr-2" />
          )}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="mb-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <div
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none",
              "focus-within:outline-none rounded-lg overflow-hidden",
              "[&_.ql-editor]:px-3",
              "transition-all duration-200"
            )}
          >
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              modules={modules}
              formats={formats}
              placeholder="Add a description..."
              readOnly={isPending}
            />
          </div>
          <Button
            className="w-fit ml-auto"
            size="sm"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="animate-pulse">Saving</span>
                <span className="animate-pulse">...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none whitespace-pre-line"
          )}
          dangerouslySetInnerHTML={{
            __html:
              value ||
              '<span class="text-muted-foreground">No description set</span>',
          }}
        />
      )}
    </div>
  );
};
