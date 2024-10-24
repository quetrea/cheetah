import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetPlanProps {
  userId: string;
}

export const useGetPlan = ({ userId }: useGetPlanProps) => {
  const query = useQuery({
    queryKey: ["plan", userId],
    queryFn: async ({}) => {
      const response = await client.api.plans[":userId"].$get({
        param: { userId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
