import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmailPage = () => {
  const path = `/account`;
  return (
    <div className="flex items-center justify-center w-full h-screen shadow-none border-none">
      <Button asChild variant={"outline"} size={"sm"}>
        <Link href={path}>Back</Link>
      </Button>
      <div className="p-4 border rounded-md ">
        We have received your password reset request. A link to reset your
        password has been sent to your email address. Please check your inbox
        and follow the instructions in the email to reset your password. If you
        do not receive the email within a few minutes, don't forget to check
        your spam or junk folder
      </div>
    </div>
  );
};

export default EmailPage;
