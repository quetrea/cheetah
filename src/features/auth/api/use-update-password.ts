import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["current"]["update-password"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["current"]["update-password"]["$patch"]
>;

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.auth["current"]["update-password"][
        "$patch"
      ]({
        form,
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Your password updated");

      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to update password");
    },
  });

  return mutation;
};
