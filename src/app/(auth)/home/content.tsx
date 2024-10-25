import { DottedSeparator } from "@/components/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Content = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <DottedSeparator className="my-7" />
      <div className="p-7 relative">
        <Card className="p-4 group cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Easily manage your workflow and tasks. Make your projects
              tangible.
            </CardTitle>
            <CardDescription>This card created by @Cheetah</CardDescription>
          </CardHeader>
          <CardContent className="w-full  relative">
            <div className="border h-full rounded-md flex">
              <div className="flex-3 md:flex border-r hidden flex-col gap-y-4 p-4">
                <div className="flex flex-col items-center gap-y-2">
                  <div className="text-sm">Workspace</div>
                  <DottedSeparator />
                  <div className="flex flex-col">
                    <div className="text-xs flex items-center justify-center border rounded-md p-2">
                      My workspace
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                  <div className="text-sm">Projects</div>
                  <DottedSeparator />
                  <div className="flex flex-col">
                    <div className="text-xs flex items-center justify-center border rounded-md p-2">
                      My project
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-y-2 p-4">
                <div className="text-sm">My tasks</div>
                <div className="flex border rounded-md flex-col p-2 gap-y-2">
                  <div className="px-2 py-1 ">Tasks </div>
                  <div className="p-2 border rounded-md gap-y-4 flex flex-col text-xs py-3">
                    <li>Task 1</li>
                    <DottedSeparator />
                    <li>Task 2</li>
                    <DottedSeparator />
                    <li>Task 3</li>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-lg  flex gap-x-2">
            Author:
            <span className="group-hover:underline text-neutral-500">
              {" "}
              Illusion Celesita
            </span>{" "}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
