"use client";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useCreatePasswordRecovery } from "@/features/auth/api/use-create-recovery-password";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

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
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const MotionCard = motion(Card);
const MotionDiv = motion.div;

export const ForgotPasswordClient = () => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: resetPassword, isPending } = useCreatePasswordRecovery();

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    resetPassword(
      {
        json: {
          email: values.email,
          url: `${process.env.NEXT_PUBLIC_APP_URL}/forgot-password/recovery`,
        },
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full flex items-start justify-center py-4 md:py-8"
      >
        <MotionCard className="w-full md:w-[400px] overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="space-y-1 p-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription className="text-base">
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </CardDescription>
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="name@example.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </MotionDiv>

                <MotionDiv
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </MotionDiv>
              </form>
            </Form>

            <MotionDiv
              variants={itemVariants}
              className="text-center text-sm text-muted-foreground"
            >
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-1 text-purple-600 hover:text-purple-700 hover:underline font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </MotionDiv>
          </CardContent>
        </MotionCard>
      </MotionDiv>
    </AnimatePresence>
  );
};
