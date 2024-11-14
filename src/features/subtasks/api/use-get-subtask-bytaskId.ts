import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetSubTaskByTaskIdProps {
  taskId: string;
}

export const useGetSubTaskByTaskId = ({
  taskId,
}: useGetSubTaskByTaskIdProps) => {
  const query = useQuery({
    queryKey: ["subtasks", taskId],
    queryFn: async () => {
      const response = await client.api.subtasks[":taskId"].$get({
        param: { taskId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
