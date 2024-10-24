"use client";

import { UpgradePlanForm } from "@/features/plans/components/upgrade-plan-form";

interface AccountPageUpgradeClientProps {
  userId: string;
}

export const AccountPlanUpgradeClient = ({
  userId,
}: AccountPageUpgradeClientProps) => {
  return (
    <div>
      <UpgradePlanForm userId={userId} />
    </div>
  );
};
