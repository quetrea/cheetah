import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetSubTasksProps {
  workspaceId: string;
  taskId: string;
}

export const useGetSubTasks = ({
  workspaceId,
  taskId,
}: useGetSubTasksProps) => {
  const query = useQuery({
    queryKey: ["subtasks", workspaceId, taskId],
    queryFn: async () => {
      const response = await client.api.subtasks.$get({
        query: {
          workspaceId,
          taskId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
