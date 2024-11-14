import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.subtasks)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.subtasks)["$post"]>;

export const useCreateSubTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.subtasks["$post"]({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to create subtask");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Subtask created");
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["subtasks"] });
    },
    onError: () => {
      toast.error("Failed to create subtask");
    },
  });

  return mutation;
};
