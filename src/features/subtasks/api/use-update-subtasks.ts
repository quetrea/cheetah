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

interface UpdateSubTaskOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export const useUpdateSubTask = (
  options: UpdateSubTaskOptions = {
    showSuccessToast: true,
    showErrorToast: true,
  }
) => {
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
      if (options.showSuccessToast) {
        if (data.completed === true) {
          toast.success(`Subtask [${data.name}] completed`);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["subtasks"] });
      queryClient.invalidateQueries({ queryKey: ["subtask", data.$id] });
    },
    onError: () => {
      if (options.showErrorToast) {
        toast.error("Failed to update subtask");
      }
    },
  });

  return mutation;
};
