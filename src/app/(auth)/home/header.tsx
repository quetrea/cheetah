import { CalendarIcon } from "lucide-react";

export const Header = () => {
  return (
    <header>
      <div className="flex items-center justify-center flex-col gap-y-4">
        <div className="flex flex-col gap-y-2 items-center">
          <h1 className="font-bold text-5xl text-center">Welcome to Cheetah</h1>
          <p className="font-normal text-center">
            You can create customizable workspaces, with one click!
          </p>
        </div>

        <p className="text-neutral-500 flex items-center border p-2 rounded-md">
          <CalendarIcon className="size-5 mr-2" />
          Created at 2024/23/10
        </p>
      </div>
    </header>
  );
};
