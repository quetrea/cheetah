import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.webhooks)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.webhooks)["$post"]>;

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.webhooks["$post"]({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to create webhook");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Webhook created successfully");
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
    onError: () => {
      toast.error("Failed to create webhook");
    },
  });
};
