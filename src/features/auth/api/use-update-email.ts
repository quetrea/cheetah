import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["current"]["update-email"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["current"]["update-email"]["$patch"]
>;

export const useUpdateAccountEmail = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.auth["current"]["update-email"][
        "$patch"
      ]({
        form,
      });

      if (!response.ok) {
        throw new Error("Failed to update email");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Your email updated");

      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to update email");
    },
  });

  return mutation;
};
