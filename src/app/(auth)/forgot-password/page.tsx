import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { ForgotPasswordClient } from "./client";

const ForgotPasswordPage = async () => {
  const user = await getCurrent();
  if (user) return redirect("/");
  return <ForgotPasswordClient />;
};

export default ForgotPasswordPage;
