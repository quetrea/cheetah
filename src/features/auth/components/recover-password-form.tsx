"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { updatePasswordRecovery } from "../schemas";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useUpdateRecoveryPassword } from "../api/use-update-recovery-password";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const MotionCard = motion(Card);
const MotionDiv = motion.div;

interface EditRecoveryPasswordProps {
  secret: string;
  initialValues: {
    id: string;
  };
}

export const EditRecoveryPassword = ({
  secret,
  initialValues,
}: EditRecoveryPasswordProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: updatePassword, isPending } = useUpdateRecoveryPassword();

  const form = useForm<z.infer<typeof updatePasswordRecovery>>({
    resolver: zodResolver(updatePasswordRecovery),
    defaultValues: {
      userId: initialValues.id,
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof updatePasswordRecovery>) => {
    console.log({ values, initialValues, secret });
    updatePassword({
      json: {
        userId: initialValues.id,
        password: values.password,
      },
      param: {
        secret: secret,
      },
    });
  };

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="w-full flex items-start justify-center py-4 md:py-8"
      >
        <MotionCard
          className="w-full md:w-[400px] overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/50 dark:border-neutral-800/50"
          whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
          transition={{ duration: 0.3 }}
        >
          <CardHeader className="space-y-1 p-6">
            <MotionDiv
              variants={itemVariants}
              className="flex items-center gap-2 mb-2"
            >
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
              >
                <KeyRound className="h-6 w-6 text-purple-600" />
              </motion.div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Reset Your Password
              </CardTitle>
            </MotionDiv>
            <MotionDiv variants={itemVariants}>
              <CardDescription className="text-base">
                Enter your new password below to regain access to your account
              </CardDescription>
            </MotionDiv>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <MotionDiv variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              disabled={isPending}
                              placeholder="Enter new password"
                              className="pl-10 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </MotionDiv>

                <MotionDiv
                  variants={itemVariants}
                  className="flex items-center justify-between gap-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => router.push("/sign-in")}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </MotionDiv>
              </form>
            </Form>
          </CardContent>
        </MotionCard>
      </MotionDiv>
    </AnimatePresence>
  );
};
