import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { AccountRecoveryClient } from "./client";
import { useRecoverySecretId } from "@/features/auth/hooks/use-recovery-secret-id";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Password Recovery",
  description: "Reset your password",
};

const AccountRecoveryPage = async () => {
  return <AccountRecoveryClient />;
};

export default AccountRecoveryPage;
