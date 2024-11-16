"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useJoinWorkspace } from "../api/use-join-workspace";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useInviteCode } from "../hooks/use-invite-code";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

export const JoinWorkspaceForm = ({
  initialValues,
}: JoinWorkspaceFormProps) => {
  const inviteCode = useInviteCode();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="w-full h-full border-none shadow-none">
        <motion.div variants={itemVariants}>
          <CardHeader className="p-7">
            <CardTitle className="text-xl font-bold">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Join Workspace
              </motion.span>
            </CardTitle>
            <CardDescription>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                You&apos;ve been invited to join{" "}
                <strong>{initialValues.name}</strong>
              </motion.span>
            </CardDescription>
          </CardHeader>
        </motion.div>

        <motion.div variants={itemVariants} className="px-7">
          <DottedSeparator />
        </motion.div>

        <motion.div variants={itemVariants}>
          <CardContent className="p-7">
            <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full lg:w-fit"
              >
                <Button
                  variant={"secondary"}
                  type="button"
                  asChild
                  size={"lg"}
                  className="w-full lg:w-fit"
                  disabled={isPending}
                >
                  <Link href={`/`}>Cancel</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full lg:w-fit"
              >
                <Button
                  onClick={onSubmit}
                  size={"lg"}
                  className="w-full lg:w-fit"
                  type="button"
                  disabled={isPending}
                >
                  Join Workspace
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
};
