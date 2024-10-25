import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to the cheetah app",
  keywords: "workspace, team, collaboration", // Anahtar kelimeler eklendi
  authors: {
    name: "Illusion",
  },
};

const SignInPage = async () => {
  const user = await getCurrent();

  if (user) redirect("/");
  return <SignInCard />;
};

export default SignInPage;
