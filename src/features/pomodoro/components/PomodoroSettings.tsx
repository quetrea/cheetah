import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Dialog } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";

import { useTranslation } from "react-i18next";

export interface PomodoroSettings {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  cyclesBeforeLongBreak: number;
}

export const defaultSettings: PomodoroSettings = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  cyclesBeforeLongBreak: 4,
};

interface PomodoroSettingsModalProps {
  settings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
}

export const PomodoroSettingsModal = ({
  settings,
  onSave,
}: PomodoroSettingsModalProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] =
    useState<PomodoroSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 border-gray-200 dark:border-white/20"
        >
          <Settings className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("pomodoro.settings.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("pomodoro.settings.pomodoroTime")}</Label>
            <Input
              type="number"
              value={localSettings.pomodoroTime}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  pomodoroTime: Number(e.target.value),
                }))
              }
              min="1"
              max="60"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("pomodoro.settings.shortBreakTime")}</Label>
            <Input
              type="number"
              value={localSettings.shortBreakTime}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  shortBreakTime: Number(e.target.value),
                }))
              }
              min="1"
              max="30"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("pomodoro.settings.longBreakTime")}</Label>
            <Input
              type="number"
              value={localSettings.longBreakTime}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  longBreakTime: Number(e.target.value),
                }))
              }
              min="1"
              max="60"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("pomodoro.settings.cyclesBeforeLongBreak")}</Label>
            <Input
              type="number"
              value={localSettings.cyclesBeforeLongBreak}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  cyclesBeforeLongBreak: Number(e.target.value),
                }))
              }
              min="1"
              max="10"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>{t("common.save")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
