import AdBanner from "@/components/adsense/AdBanner";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex h-full gap-x-4 w-full ">
      <Tabs
        className="flex w-full flex-col lg:flex-row   gap-4 overflow-y-auto"
        defaultValue="how-to-use"
      >
        <Card className="w-full lg:1/3 xl:w-1/5  flex  flex-col p-4">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Blogs</CardTitle>
            <CardDescription className="text-lg">
              Explore our latest blogs and insights on various topics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DottedSeparator className="my-2" />
            <ul className="gap-y-5 flex flex-col">
              <TabsList className="flex-col flex h-full gap-y-2">
                <p className="text-lg p-2">Introduction</p>
                <TabsTrigger
                  value="how-to-use"
                  className="w-full shadow py-3 px-2 text-sm border rounded-md hover:shadow-md transition cursor-pointer"
                >
                  How to use?
                </TabsTrigger>
                <TabsTrigger
                  value="how-to-create-workspace"
                  className="w-full shadow py-3 px-2 text-sm border rounded-md hover:shadow-md transition cursor-pointer"
                >
                  How to create a workspace?
                </TabsTrigger>
              </TabsList>
            </ul>
          </CardContent>
        </Card>
        <Card className="w-full p-4 flex flex-col">
          <CardContent className="transition h-full">
            <TabsContent value="how-to-use">
              <CardHeader className="p-2">
                <CardTitle className="text-3xl font-bold">
                  How to Use Effectively?
                </CardTitle>
                <CardDescription className="text-lg">
                  A comprehensive guide to get the most out of our platform.
                </CardDescription>
              </CardHeader>
              <DottedSeparator className="my-2" />
              <AdBanner
                dataAdFormat="autorelaxed"
                dataFullWidthResponsive
                dataAdSlot="3712205875"
                pId="5888317157317698"
              />
              <Accordion type="multiple">
                <AccordionItem value="create-account">
                  <AccordionTrigger className="text-lg font-semibold">
                    1. Create an Account
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      To start using our platform, you first need to{" "}
                      <strong>
                        <Link href={"/sign-in"}>create an account</Link>
                      </strong>
                      . By creating an account, you accept our Privacy Policy
                      and Terms of Service, which enables you to set up multiple
                      workspaces as needed.
                    </p>
                    <Alert className="my-2">
                      Tip: Creating an account unlocks additional features for
                      workspace management!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
                <AdBanner
                  dataAdFormat="autorelaxed"
                  dataFullWidthResponsive
                  dataAdSlot="3712205875"
                  pId="5888317157317698"
                />
                <AccordionItem value="workspace-overview">
                  <AccordionTrigger className="text-lg font-semibold">
                    2. Setting Up Your First Workspace
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Once you&apos;ve created an account, the next step is to{" "}
                      <strong>
                        <Link href={"/"}>set up your workspace</Link>
                      </strong>
                      . You will be taken to the workspace setup screen where
                      you can give your workspace a unique name and, if desired,
                      add a visual icon or image.
                    </p>
                    <p>
                      You can think of the workspace as a virtual office space,
                      allowing you to organize your projects and tasks in one
                      place.
                    </p>
                    <Alert className="my-2">
                      Note: A well-named workspace can help you and your team
                      members stay organized and focused!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <AdBanner
              dataAdFormat="autorelaxed"
              dataFullWidthResponsive
              dataAdSlot="3712205875"
              pId="5888317157317698"
            />
            <TabsContent value="how-to-create-workspace">
              <CardHeader className="p-2">
                <CardTitle className="text-3xl font-bold">
                  How to Create a Workspace
                </CardTitle>
                <CardDescription className="text-lg">
                  A step-by-step guide to creating and managing your workspace.
                </CardDescription>
              </CardHeader>
              <DottedSeparator className="my-2" />
              <Accordion type="multiple">
                <AccordionItem value="workspace-methods">
                  <AccordionTrigger className="text-lg font-semibold">
                    1. Workspace Creation Methods
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      There are two ways to create a workspace on our platform:
                    </p>
                    <ul className="list-disc ml-4">
                      <li>
                        <strong>Route:</strong> Navigate to{" "}
                        <code>/workspaces/create</code> to set up a new
                        workspace from scratch.
                      </li>
                      <li>
                        <strong>Sidebar:</strong> After creating your first
                        workspace, you can add more workspaces by clicking the
                        &quot;+&quot; icon next to the &quot;Workspaces&quot;
                        title in the sidebar. This opens a modal where you can
                        quickly fill in workspace details.
                      </li>
                    </ul>
                    <AdBanner
                      dataAdFormat="autorelaxed"
                      dataFullWidthResponsive
                      dataAdSlot="3712205875"
                      pId="5888317157317698"
                    />
                    <Alert className="my-2" variant="info">
                      Quick tip: Use the sidebar for fast access when managing
                      multiple workspaces!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="workspace-tips">
                  <AccordionTrigger className="text-lg font-semibold">
                    2. Tips for Effective Workspace Use
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Here are some tips to make the most out of your workspace:
                    </p>
                    <ul className="list-disc ml-4">
                      <li>
                        Give each workspace a clear and concise name for easy
                        identification.
                      </li>
                      <li>
                        Use visual icons or images to personalize and quickly
                        recognize workspaces.
                      </li>
                      <li>
                        Organize projects within each workspace based on themes
                        or clients for streamlined task management.
                      </li>
                    </ul>
                    <AdBanner
                      dataAdFormat="autorelaxed"
                      dataFullWidthResponsive
                      dataAdSlot="3712205875"
                      pId="5888317157317698"
                    />
                    <Alert className="my-2" variant="warning">
                      Reminder: Upgrading to the Pro Plan allows you to
                      collaborate with team members on workspaces and projects
                      more effectively!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Page;
