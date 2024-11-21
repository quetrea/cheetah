import { useQueryState, parseAsString } from "nuqs";

export const useRecoverySecretId = () => {
  const [secret] = useQueryState("secret", parseAsString);
  const [userId] = useQueryState("userId", parseAsString);
  const [expire] = useQueryState("expire", parseAsString);

  return {
    secret,
    userId,
    expire,
    isValid: Boolean(secret && userId && expire),
  };
};
