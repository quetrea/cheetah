"use client";
import { EditRecoveryPassword } from "@/features/auth/components/recover-password-form";
import { useRecoverySecretId } from "@/features/auth/hooks/use-recovery-secret-id";

const ResetPasswordClient = () => {
  const { secret, userId } = useRecoverySecretId();
  return (
    <>
      {secret && userId && (
        <EditRecoveryPassword secret={secret} initialValues={{ id: userId }} />
      )}
    </>
  );
};

export default ResetPasswordClient;
