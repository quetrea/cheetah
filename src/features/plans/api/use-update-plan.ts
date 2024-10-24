import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.plans)["plan"][":userId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.plans)["plan"][":userId"]["$patch"]
>;

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.plans["plan"][":userId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to update plan");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Congratulations, you are now a premium owner.");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update plan");
    },
  });

  return mutation;
};
