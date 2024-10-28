import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.labels)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.labels)["$post"]>;

export const useCreateLabel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.labels["$post"]({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to create label");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Label created");
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
    onError: () => {
      toast.error("Failed to create label");
    },
  });

  return mutation;
};
