"use client";
import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useConfirm } from "@/hooks/use-confirm";

import { toast } from "sonner";

import { useGetMembers } from "@/features/members/api/use-get-members";

import { useUpdatePlan } from "../api/use-update-plan";
import { updatePlanSchema } from "../schemas";
import { Plan, PlanType } from "../types";
import { User } from "@/features/auth/types";
import { LightningBoltIcon } from "@radix-ui/react-icons";

interface UpgradePlanFormProps {
  onCancel?: () => void;
  userId: string;
}

export const UpgradePlanForm = ({ onCancel, userId }: UpgradePlanFormProps) => {
  const router = useRouter();

  const { mutate, isPending } = useUpdatePlan();

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  const onSubmit = () => {
    mutate({
      json: {
        planType: PlanType.PREMIUM,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      param: {
        userId: userId,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-y-4 select-none">
        <Card className="w-full h-full shadow-none border select-none border-red-500">
          <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
            <Button
              size={"sm"}
              disabled={isPending}
              variant={"secondary"}
              onClick={onCancel ? onCancel : () => router.push(`/account`)}
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-xl font-bold">
              Account status - Upgrade Plan
            </CardTitle>
          </CardHeader>
          <div className="px-7">
            <DottedSeparator />
          </div>
          <CardContent className="p-7 flex flex-col gap-y-4">
            <div className="flex flex-col  gap-y-2 p-4 border rounded-lg text-sm font-medium group transition hover:shadow-lg hover:shadow-neutral-300/50 cursor-pointer ">
              <p>Upgrading to Premium Plan</p>
              <div className="list-disc flex px-6 p-4 flex-col gap-y-4">
                <li>
                  Convenience options
                  <div className="px-6 list-disc">
                    <li>Duplicate previous tasks and set to next day</li>
                    <li>Set reminders for important tasks</li>
                    <li>Customize task labels and colors</li>
                    <li>Priority support for any issues</li>
                  </div>
                </li>
                <li>
                  Enhanced features
                  <div className="px-6 list-disc">
                    <li>Access to exclusive templates</li>
                    <li>More storage for files and documents</li>
                    <li>Advanced analytics for your projects</li>
                  </div>
                </li>
              </div>
              <div className="border-dashed group-hover:border-red-500 transition group-hover:shadow-lg shadow-transparent group-hover:shadow-red-500/50 group-hover:text-red-500 border-2 rounded-lg p-4 text-xl items-center">
                Just <span>5$</span> - one-time payment
              </div>
            </div>

            <DottedSeparator className="my-4" />

            <Button
              size={"lg"}
              className="w-full font-medium shadow-md shadow-transparent  hover:shadow-red-500/30 transition hover:bg-white"
              // onClick={onSubmit}
              variant={"secondary"}
            >
              <LightningBoltIcon className="size-5 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
