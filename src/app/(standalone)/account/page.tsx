import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { AccountUserClient } from "./client";

const AccountUserPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <AccountUserClient />;
};

export default AccountUserPage;
