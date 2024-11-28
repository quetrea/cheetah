import { Skeleton } from "@/components/ui/skeleton";
import { DottedSeparator } from "@/components/dotted-separator";

export const TaskOverviewSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted dark:bg-neutral-900 h-full rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>

        <DottedSeparator className="my-4" />

        <div className="flex lg:flex-col xl:flex-row flex-col gap-y-1">
          <div className="flex flex-col flex-1">
            <div className="p-1 px-4 pb-2 flex items-center gap-x-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="p-4 flex flex-col gap-y-4 border border-neutral-300 rounded-lg">
              {/* Assignee */}
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Created At */}
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* End Date */}
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Status */}
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* Priority */}
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>

          {/* <div>
            <DottedSeparator className="py-7 hidden sm:block xs:block md:block lg:block xl:hidden" />
          </div>
          <div>
            <DottedSeparator
              direction="vertical"
              className="px-7 hidden sm:hidden xs:hidden md:hidden lg:hidden xl:block"
            />
          </div> */}

          {/* Labels Section */}
          {/* <div className="flex flex-col flex-1">
            <div className="p-1 px-4 pb-2 flex items-center gap-x-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="p-4 flex flex-col gap-y-4 border border-neutral-300 rounded-lg h-full">
              <div className="flex items-center gap-x-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-18 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
