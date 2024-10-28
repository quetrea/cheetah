import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.labels)[":labelId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.labels)[":labelId"]["$patch"]
>;

export const useUpdateLabel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.labels[":labelId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update label");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Label updated");
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      queryClient.invalidateQueries({ queryKey: ["label", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update label");
    },
  });

  return mutation;
};
