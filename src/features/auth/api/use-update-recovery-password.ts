import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth)[":userId"][":secret"]["password-update-recovery"]["$put"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)[":userId"][":secret"]["password-update-recovery"]["$put"]
>;

export const useUpdateRecoveryPassword = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.auth[":userId"][":secret"][
        "password-update-recovery"
      ]["$put"]({
        form,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update recovery");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Password changed");

      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to create recovery");
    },
  });

  return mutation;
};
