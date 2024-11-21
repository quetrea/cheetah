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
import { motion, AnimatePresence } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],

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
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
    border-color: hsl(var(--border));
    background: hsl(var(--muted));
    padding: 0.75rem !important;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    border-bottom: 2px solid hsl(var(--border));
  }
  
  .ql-container {
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    border-color: hsl(var(--border));
    background: hsl(var(--background));
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .ql-editor {
    min-height: 150px;
    font-size: 0.95rem;
    line-height: 1.7;
    padding: 1.25rem !important;
  }

  .ql-editor.ql-blank::before {
    color: hsl(var(--muted-foreground));
    font-style: normal;
    left: 1.25rem;
    font-size: 0.95rem;
  }

  /* Toolbar butonları için hover efekti */
  .ql-formats button:hover {
    background: hsl(var(--muted-foreground)/0.1);
    border-radius: 4px;
  }

  /* Aktif buton stili */
  .ql-formats button.ql-active {
    background: hsl(var(--muted-foreground)/0.15);
    border-radius: 4px;
  }

  /* Preview stili güncellemesi */
  .task-description-preview {
    background: hsl(var(--muted)/0.3);
    border-radius: 0.75rem;
    padding: 1.25rem !important;
    transition: all 0.2s ease;
  }

  .task-description-preview:hover {
    background: hsl(var(--muted)/0.4);
  }

  /* Heading stilleri güncellendi */
  .ql-editor h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
    color: hsl(var(--primary));
  }

  .ql-editor h2 {
    font-size: 1.65rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: hsl(var(--primary));
  }

  .ql-editor h3 {
    font-size: 1.35rem;
    font-weight: 600;
    margin-bottom: 0.875rem;
  }

  /* Liste stilleri */
  .ql-editor ul, .ql-editor ol {
    padding-left: 1.5rem;
  }

  .ql-editor li {
    margin-bottom: 0.5rem;
  }

  /* Blockquote stili */
  .ql-editor blockquote {
    border-left: 4px solid hsl(var(--primary));
    padding-left: 1rem;
    margin: 1rem 0;
    color: hsl(var(--muted-foreground));
    font-style: italic;
  }

  /* Code block stili */
  .ql-editor pre.ql-syntax {
    background: hsl(var(--muted));
    border-radius: 0.5rem;
    padding: 1rem;
    font-family: monospace;
  }

  /* Dark mode optimizasyonları için stil güncellemeleri */
  .dark .ql-toolbar {
    background: hsl(var(--card));
    border-color: hsl(var(--border));
  }

  .dark .ql-container {
    background: hsl(var(--card));
    border-color: hsl(var(--border));
  }

  /* Dark mode için ikon renkleri */
  .dark .ql-snow .ql-stroke {
    stroke: hsl(var(--foreground)) !important;
  }

  .dark .ql-snow .ql-fill {
    fill: hsl(var(--foreground)) !important;
  }

  .dark .ql-snow .ql-picker {
    color: hsl(var(--foreground)) !important;
  }

  /* Dark mode için hover ve aktif durumlar */
  .dark .ql-formats button:hover {
    background: hsl(var(--accent)) !important;
  }

  .dark .ql-formats button.ql-active {
    background: hsl(var(--accent)) !important;
  }

  /* Preview stili güncellemesi */
  .task-description-preview {
    background: hsl(var(--muted)/0.3);
    border-radius: 0.75rem;
    padding: 1.25rem !important;
    transition: all 0.2s ease;
  }

  .dark .task-description-preview {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
  }

  .dark .task-description-preview:hover {
    background: hsl(var(--accent));
    border-color: hsl(var(--accent));
  }

  /* Heading stilleri dark mode için güncellendi */
  .dark .ql-editor h1,
  .dark .ql-editor h2 {
    color: hsl(var(--foreground));
  }
`;

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalValue, setOriginalValue] = useState(task.description || "");
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

  // HTML temizleme fonksiyonunu güncelliyoruz
  const cleanHTML = (html: string) => {
    return html
      .replace(/<p><br><\/p>/g, "<p></p>") // Boş paragrafları tek satır yap
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

  // Preview için ek stiller ekleyelim
  const previewStyles = `
    .task-description-preview {
      line-height: 1.6;
    }
    .task-description-preview p {
      margin-bottom: 0.75rem;
    }
    .task-description-preview p:last-child {
      margin-bottom: 0;
    }
    .task-description-preview h1,
    .task-description-preview h2,
    .task-description-preview h3,
    .task-description-preview h4,
    .task-description-preview h5,
    .task-description-preview h6 {
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }
    .task-description-preview h1:first-child,
    .task-description-preview h2:first-child,
    .task-description-preview h3:first-child,
    .task-description-preview h4:first-child,
    .task-description-preview h5:first-child,
    .task-description-preview h6:first-child {
      margin-top: 0;
    }
  `;

  // Edit butonuna tıklandığında
  const handleEditClick = () => {
    if (!isEditing) {
      // Edit moduna girerken mevcut değeri kaydet
      setOriginalValue(value);
    } else {
      // Cancel edildiğinde orijinal değere geri dön
      setValue(originalValue);
    }
    setIsEditing((prev) => !prev);
  };

  // Cancel butonuna tıklandığında
  const handleCancel = () => {
    setValue(originalValue); // Orijinal değere geri dön
    setIsEditing(false);
  };

  return (
    <div className="p-6 border rounded-xl bg-card shadow-sm dark:bg-card dark:border-border">
      <style>{customStyles}</style>
      <style>{previewStyles}</style>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Task Description
            </h2>
            <HoverCard>
              <HoverCardTrigger>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <div className="px-2 py-1 text-[10px] font-medium rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 cursor-pointer">
                    <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      NEW
                    </span>
                  </div>
                </motion.div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80" align="start">
                <div className="flex flex-col space-y-2">
                  <h4 className="text-sm font-semibold">✨ New Features</h4>
                  <div className="text-sm text-muted-foreground space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">📝</span>
                      <p>
                        Enhanced rich text editor with improved formatting
                        options
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">🎨</span>
                      <p>Optimized dark mode support with better contrast</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">🔄</span>
                      <p>
                        Reliable undo/redo functionality with history
                        preservation
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">⚡</span>
                      <p>Performance improvements and smoother animations</p>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          {!isEditing && !value && (
            <span className="text-xs font-medium text-muted-foreground bg-accent/20 px-3 py-1.5 rounded-full">
              No description
            </span>
          )}
          {!isEditing && task.updatedAt && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-medium text-muted-foreground bg-accent/20 px-3 py-1.5 rounded-full flex items-center gap-2"
            >
              <span className="size-2 bg-blue-500/90 dark:bg-blue-400 rounded-full animate-pulse" />
              Updated {new Date(task.updatedAt).toLocaleDateString()}
            </motion.span>
          )}
        </div>
        <Button
          onClick={handleEditClick}
          size="sm"
          variant={isEditing ? "destructive" : "secondary"}
          className="transition-all duration-300 w-full sm:w-auto"
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
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-y-4"
          >
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
                  label={
                    isToolbarVisible ? "Hide formatting" : "Show formatting"
                  }
                >
                  <Button
                    disabled={isPending}
                    size="smIcon"
                    variant="ghost"
                    onClick={toggleToolbar}
                    className="hover:bg-accent/30 dark:hover:bg-accent/20"
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
                  onClick={handleCancel}
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600/90 dark:hover:bg-emerald-700/90 text-white w-full sm:w-auto"
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
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none task-description-preview",
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
      </AnimatePresence>
    </div>
  );
};
