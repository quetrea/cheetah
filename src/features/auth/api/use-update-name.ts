import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.auth)[":userId"]["update-name"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)[":userId"]["update-name"]["$patch"]
>;

export const useUpdateAccountName = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.auth[":userId"]["update-name"][
        "$patch"
      ]({
        form,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update username");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Your name updated");

      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to update username");
    },
  });

  return mutation;
};
