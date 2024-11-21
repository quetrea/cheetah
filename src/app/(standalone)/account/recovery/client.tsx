"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useCurrent } from "@/features/auth/api/use-current";
import { EditRecoveryPassword } from "@/features/auth/components/recover-password-form";
import { useRecoverySecretId } from "@/features/auth/hooks/use-recovery-secret-id";

export const AccountRecoveryClient = () => {
  const { secret, userId } = useRecoverySecretId();
  const { data: user, isLoading: isLoadingUser } = useCurrent();

  if (isLoadingUser) {
    return <PageLoader />;
  }

  if (!user) {
    return <PageError message="User not found" />;
  }

  return (
    <div className="dark:bg-neutral-900">
      {secret && userId && (
        <EditRecoveryPassword secret={secret} initialValues={{ id: userId }} />
      )}
    </div>
  );
};
