import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.subtasks)[":subTaskId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.subtasks)[":subTaskId"]["$patch"]
>;

export const useUpdateSubTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.subtasks[":subTaskId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update subtask");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Subtask updated");

      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["subtasks"] });
      queryClient.invalidateQueries({ queryKey: ["subtask", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update subtask");
    },
  });

  return mutation;
};
