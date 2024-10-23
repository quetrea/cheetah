import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["current"]["password-recovery"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["current"]["password-recovery"]["$post"]
>;

export const useCreatePasswordRecovery = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.auth["current"]["password-recovery"][
        "$post"
      ]({
        form,
      });

      if (!response.ok) {
        throw new Error("Failed to update Email");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Recovery sentted your email. ");

      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to create recovery");
    },
  });

  return mutation;
};
