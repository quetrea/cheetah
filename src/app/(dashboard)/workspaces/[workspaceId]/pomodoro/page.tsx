import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { PomodoroClient } from "./client";

export default async function PomodoroPage() {
  const signIn = await getCurrent();

  if (!signIn) {
    redirect("/sign-in");
  }

  return <PomodoroClient />;
}
