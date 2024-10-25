import { getCurrent } from "@/features/auth/queries";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create workspaces for your team and create beautiful works",
  keywords: "workspace, team, collaboration", // Anahtar kelimeler eklendi
  authors: {
    name: "Illusion",
  },
};

const SignUpPage = async () => {
  const user = await getCurrent();

  if (user) redirect("/");
  return <SignUpCard />;
};

export default SignUpPage;
