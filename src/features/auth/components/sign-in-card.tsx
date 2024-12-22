"use client";
import { z } from "zod";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";

import { DottedSeparator } from "@/components/dotted-separator";
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
import { loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";
import { signUpWithGoogle } from "@/lib/oauth";
import { useTranslation } from "react-i18next";

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

export const SignInCard = () => {
  const { t } = useTranslation();
  const { mutate, isPending } = useLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({
      json: values,
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full flex items-start justify-center py-4 md:py-8"
    >
      <Card className="w-full md:w-[487px] overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/50 dark:border-neutral-800/50 mb-20 md:mb-0  p-6">
        <CardHeader className="space-y-4 pb-0">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("auth.signIn.title")}
            </CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription className="text-center text-base">
              {t("auth.signIn.description")}
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="p-6 pt-0 md:p-8 space-y-6">
          <Form {...form}>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            disabled={isPending}
                            className="pl-10 h-10"
                            placeholder={t("auth.signIn.formField.email")}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            disabled={isPending}
                            type="password"
                            className="pl-10 h-10"
                            placeholder={t("auth.signIn.formField.password")}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {t("auth.signIn.title")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </Form>

          <div className="relative">
            <DottedSeparator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-muted-foreground text-sm">
              {t("auth.alt-info")}
            </span>
          </div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              onClick={() => signUpWithGoogle()}
              disabled={isPending}
              variant="outline"
              className="w-full h-10 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              {t("auth.google")}
            </Button>
          </motion.div>

          {/* Desktop için sign up link */}
          <motion.div
            variants={itemVariants}
            className="text-center text-sm text-muted-foreground hidden md:block"
          >
            {t("auth.warning-info")} {"  "}
            <Link
              href="/sign-up"
              className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
            >
              {t("auth.signUp.title")}
            </Link>
          </motion.div>

          {/* Şifremi unuttum linki */}
          <motion.div
            variants={itemVariants}
            className="text-center text-xs text-muted-foreground"
          >
            <Link
              href="/forgot-password"
              className="hover:text-foreground underline underline-offset-4"
            >
              {t("auth.forgotPassword.alt")}
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
