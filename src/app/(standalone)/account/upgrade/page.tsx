import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { AccountPlanUpgradeClient } from "./client";
import { getPlan } from "@/features/plans/utils";
import { PlanType } from "@/features/plans/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upgrade Plan",
  description: "Upgrade your plan",
};

const AccountPlanUpgradePage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const plan = await getPlan({ userId: user.$id });
  if (plan.planType === PlanType.PREMIUM) redirect("/");

  return <AccountPlanUpgradeClient userId={user.$id} />;
};

export default AccountPlanUpgradePage;
