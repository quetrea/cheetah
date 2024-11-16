import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.webhooks)[":webhookId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.webhooks)[":webhookId"]["$delete"]
>;

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.webhooks[":webhookId"]["$delete"]({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update webhook");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Webhook updated successfully");
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
    onError: () => {
      toast.error("Failed to update webhook");
    },
  });
};
