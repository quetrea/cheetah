import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { CreateProfileClient } from "./client";

const CreateProfilePage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/home");
  return <CreateProfileClient />;
};

export default CreateProfilePage;
