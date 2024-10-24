"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useCurrent } from "@/features/auth/api/use-current";
import { EditAccountSettings } from "@/features/auth/components/edit-account-user-form";

export const AccountUserClient = () => {
  const { data: data, isLoading } = useCurrent();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Account not found" />;
  }

  return (
    <div>
      <EditAccountSettings
        initialValues={{
          name: data.user.name,
          email: data.user.email,
          id: data.user.$id,
        }}
      />
    </div>
  );
};
