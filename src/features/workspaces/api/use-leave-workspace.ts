import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["leave"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["leave"]["$post"]
>;

export const useLeaveWorkspace = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["leave"][
        "$post"
      ]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to leave from workspace");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(`${t("API_MESSAGES.workspace.leave.message", data.name)}`);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error(`${t("API_MESSAGES.workspace.leave.failed-message")}`);
    },
  });

  return mutation;
};
