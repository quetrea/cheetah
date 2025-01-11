import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { DottedSeparator } from "../dotted-separator";
import { Form } from "react-hook-form";
import { useCurrent } from "@/features/auth/api/use-current";
import LoadingPage from "@/app/loading";

export const CreateProfileForm = () => {
  const { data, isLoading } = useCurrent();

  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <Card className="h-full w-full border-none select-none shadow-none ">
      <CardHeader className=" flex p-8 flex-col gap-y-4">
        <CardTitle className="text-3xl font-bold">
          Hey 👋 <p> {data?.user.name ?? "User"}</p>
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <Card className="border-none rounded-none w-full px-8">
        <CardHeader className="px-4">
          <CardTitle className="text-xl">What is the Profile</CardTitle>
          <DottedSeparator className="py-4" />
          <CardDescription>
            <ul className="list-disc flex items-center justify-center flex-col  text-md space-y-4">
              <li>
                When you create a profile, you get additional features to your
                regular account.
              </li>
              <li>
                For example, you get access to the Explore page and discover
                what people like you are doing.
              </li>{" "}
              <li>
                This is your work community, and working with people is the best
                part.
              </li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent></CardContent>
    </Card>
  );
};
