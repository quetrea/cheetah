import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetMemberProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: useGetMemberProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
