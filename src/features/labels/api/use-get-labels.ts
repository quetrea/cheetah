import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetTaskProps {
  taskId: string;
}

export const useGetLabels = ({ taskId }: useGetTaskProps) => {
  const query = useQuery({
    queryKey: ["labels", taskId],
    queryFn: async () => {
      const response = await client.api.labels.$get({
        query: { taskId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch labels");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
