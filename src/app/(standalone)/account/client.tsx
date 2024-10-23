"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useCurrent } from "@/features/auth/api/use-current";
import { EditAccountSettings } from "@/features/auth/components/edit-account-user-form";

export const AccountUserClient = () => {
  const { data: user, isLoading } = useCurrent();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <PageError message="Account not found" />;
  }
  const { name, email, $id } = user;
  return (
    <div>
      <EditAccountSettings initialValues={{ name, email, id: $id }} />
    </div>
  );
};
