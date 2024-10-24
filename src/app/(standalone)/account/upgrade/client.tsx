"use client";

import { UpgradePlanForm } from "@/features/plans/components/upgrade-plan-form";

interface AccountPageUpgradeClientProps {
  userId: string;
}

export const AccountPlanUpgradeClient = ({
  userId,
}: AccountPageUpgradeClientProps) => {
  return (
    <div className="dark:bg-neutral-900">
      <UpgradePlanForm userId={userId} />
    </div>
  );
};
