import { Button } from "@/components/ui/button";
import { Task } from "../types";
import { PencilIcon, XIcon } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { useState, useRef } from "react";
import { useUpdateTask } from "../api/use-update-task";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import { PiTextAa } from "react-icons/pi";
import { Smile, ImageIcon } from "lucide-react";
import { EmojiPopover } from "@/components/emoji-popover";
import { Hint } from "@/components/hint";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
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

// Modern stil ayarları güncellendi
const customStyles = `
  .ql-toolbar {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-color: hsl(var(--border));
    background: hsl(var(--muted));
    padding: 0.5rem !important;
    flex-wrap: wrap;
    gap: 0.25rem;
    justify-content: center;
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
    padding: 1rem !important;
  }

  .ql-editor.ql-blank::before {
    color: hsl(var(--muted-foreground));
    font-style: normal;
    left: 1rem;
  }

  /* Dark mode optimizasyonları */
  .dark .ql-snow .ql-stroke {
    stroke: hsl(var(--foreground));
  }

  .dark .ql-snow .ql-fill {
    fill: hsl(var(--foreground));
  }

  .dark .ql-snow .ql-picker {
    color: hsl(var(--foreground));
  }

  .dark .ql-snow .ql-picker-options {
    background-color: hsl(var(--background));
    border-color: hsl(var(--border));
  }

  .dark .ql-toolbar.ql-snow .ql-picker-label {
    color: hsl(var(--foreground));
    border-color: hsl(var(--border));
  }

  .dark .ql-snow .ql-tooltip {
    background-color: hsl(var(--background));
    border-color: hsl(var(--border));
    color: hsl(var(--foreground));
    box-shadow: 0 0 0 1px hsl(var(--border));
  }

  .dark .ql-snow .ql-tooltip input[type=text] {
    background-color: hsl(var(--muted));
    border-color: hsl(var(--border));
    color: hsl(var(--foreground));
  }

  /* Mobil optimizasyonları */
  @media (max-width: 640px) {
    .ql-toolbar {
      padding: 0.25rem !important;
    }

    .ql-toolbar .ql-formats {
      margin-right: 0 !important;
      margin-bottom: 0.25rem;
    }

    .ql-container {
      font-size: 0.875rem;
    }

    .ql-editor {
      padding: 0.75rem !important;
      min-height: 100px;
    }
  }

  /* Heading stilleri */
  .ql-editor h1 {
    font-size: 1.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .ql-editor h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.875rem;
  }

  .ql-editor h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .ql-editor h4 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.625rem;
  }

  .ql-editor h5 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .ql-editor h6 {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.375rem;
  }
`;

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description || "");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { mutate, isPending } = useUpdateTask();

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const onEmojiSelect = (emoji: string) => {
    setValue((prev) => prev + emoji);
  };

  // Geliştirilmiş HTML temizleme fonksiyonu
  const cleanHTML = (html: string) => {
    return html
      .replace(/<p><br><\/p>/g, "") // Boş paragrafları kaldır
      .replace(/(<p>|<\/p>)/g, "") // Gereksiz p etiketlerini kaldır
      .replace(/\n\s*\n/g, "\n") // Çoklu boş satırları tek satıra indir
      .replace(/^\s+|\s+$/g, "") // Baş ve sondaki boşlukları kaldır
      .replace(/\s+/g, " ") // Çoklu boşlukları tek boşluğa indir
      .trim();
  };

  const handleSave = () => {
    const cleanedValue = cleanHTML(value);
    mutate(
      {
        json: { description: cleanedValue },
        param: { taskId: task.$id },
      },
      {
        onSuccess: () => {
          setValue(cleanedValue); // State'i temizlenmiş değerle güncelle
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="p-4 border rounded-lg bg-card sm:p-6">
      <style>{customStyles}</style>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
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
          className="transition-all duration-200 w-full sm:w-auto"
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
            ref={containerRef}
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none",
              "focus-within:outline-none rounded-lg overflow-hidden border",
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
          <div className="flex flex-wrap items-center gap-2 px-2">
            <div className="flex items-center gap-2">
              <Hint
                label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
              >
                <Button
                  disabled={isPending}
                  size="smIcon"
                  variant="ghost"
                  onClick={toggleToolbar}
                >
                  <PiTextAa className="size-4" />
                </Button>
              </Hint>
              <EmojiPopover onEmojiSelect={onEmojiSelect}>
                <Button disabled={isPending} size="smIcon" variant="ghost">
                  <Smile className="size-4" />
                </Button>
              </EmojiPopover>
            </div>
            <div className="flex items-center gap-x-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#008a5a] hover:bg-[#007a5a]/80 text-white w-full sm:w-auto"
                size="sm"
                onClick={handleSave}
                disabled={isPending || !value.trim()}
              >
                {isPending ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none",
            "min-h-[120px] p-3 rounded-lg",
            !value && "flex items-center justify-center text-muted-foreground"
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
