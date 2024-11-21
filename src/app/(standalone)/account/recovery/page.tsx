import { getCurrent } from "@/features/auth/queries";
import { AccountRecoveryClient } from "./client";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Account Password Recovery",
  description: "Reset your password",
};

const AccountRecoveryPage = async () => {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");
  return <AccountRecoveryClient />;
};

export default AccountRecoveryPage;
