import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { Webhook } from "../types";

interface UseGetWebhooksProps {
  workspaceId: string;
}

export const useGetWebhooks = ({ workspaceId }: UseGetWebhooksProps) => {
  const query = useQuery({
    queryKey: ["webhooks", workspaceId],
    queryFn: async () => {
      const response = await client.api.webhooks.$get({
        query: {
          workspaceId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch webhooks");
      }

      const { data } = await response.json();

      return data;
    },
    enabled: !!workspaceId,
  });

  return query;
};
