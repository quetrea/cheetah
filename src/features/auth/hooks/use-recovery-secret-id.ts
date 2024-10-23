import { useQueryState, parseAsString } from "nuqs";

export const useRecoverySecretId = () => {
  const [secretId] = useQueryState("secret", parseAsString);

  return {
    secretId,
  };
};
