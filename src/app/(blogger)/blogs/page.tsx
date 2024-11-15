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
import { cn } from "@/lib/utils";

const Page = () => {
  return (
    <div className="flex h-full gap-x-4 w-full">
      <Tabs
        className="flex w-full flex-col lg:flex-row gap-4 overflow-y-auto"
        defaultValue="how-to-use"
      >
        <Card className="w-full lg:1/3 xl:w-1/5 flex flex-col p-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-3xl font-bold dark:text-white">
              Blogs
            </CardTitle>
            <CardDescription className="text-lg dark:text-neutral-400">
              Explore our latest blogs and insights on various topics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DottedSeparator className="my-2" />
            <ul className="gap-y-5 flex flex-col">
              <TabsList className="flex-col flex h-full gap-y-2 bg-transparent">
                <p className="text-lg p-2 dark:text-neutral-200">
                  Getting Started
                </p>
                <TabsTrigger
                  value="how-to-use"
                  className={cn(
                    "w-full shadow py-3 px-2 text-sm border rounded-md hover:shadow-md transition cursor-pointer",
                    "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200",
                    "data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-700"
                  )}
                >
                  How to use?
                </TabsTrigger>
                <TabsTrigger
                  value="how-to-create-workspace"
                  className={cn(
                    "w-full shadow py-3 px-2 text-sm border rounded-md hover:shadow-md transition cursor-pointer",
                    "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200",
                    "data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-700"
                  )}
                >
                  Workspace Setup
                </TabsTrigger>

                <p className="text-lg p-2 mt-4 dark:text-neutral-200">
                  Features
                </p>
                <TabsTrigger
                  value="project-management"
                  className={cn(
                    "w-full shadow py-3 px-2 text-sm border rounded-md hover:shadow-md transition cursor-pointer",
                    "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200",
                    "data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-700"
                  )}
                >
                  Project Management
                </TabsTrigger>
                <TabsTrigger
                  value="task-management"
                  className={cn(
                    "w-full shadow py-3 px-2 text-sm border rounded-md hover:shadow-md transition cursor-pointer",
                    "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200",
                    "data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-700"
                  )}
                >
                  Task Management
                </TabsTrigger>
                <TabsTrigger
                  value="team-collaboration"
                  className={cn(
                    "w-full shadow py-3 px-2 text-sm border rounded-md hover:shadow-md transition cursor-pointer",
                    "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200",
                    "data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-700"
                  )}
                >
                  Team Collaboration
                </TabsTrigger>

                <p className="text-lg p-2 mt-4 dark:text-neutral-200">
                  Advanced
                </p>
                <TabsTrigger
                  value="pro-features"
                  className={cn(
                    "w-full shadow py-3 px-2 text-sm border rounded-md hover:shadow-md transition cursor-pointer",
                    "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200",
                    "data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-700"
                  )}
                >
                  Pro Features
                </TabsTrigger>
                <TabsTrigger
                  value="integrations"
                  className={cn(
                    "w-full shadow py-3 px-2 text-sm border rounded-md hover:shadow-md transition cursor-pointer",
                    "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200",
                    "data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-700"
                  )}
                >
                  Integrations
                </TabsTrigger>
              </TabsList>
            </ul>
          </CardContent>
        </Card>
        <Card className="w-full p-4 flex flex-col bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <CardContent className="transition h-full">
            <AdBanner
              dataAdFormat="fluid"
              dataFullWidthResponsive
              dataAdSlot="3712205875"
              pId="5888317157317698"
            />
            <TabsContent value="how-to-use">
              <CardHeader className="p-2">
                <CardTitle className="text-3xl font-bold dark:text-white">
                  How to Use Effectively?
                </CardTitle>
                <CardDescription className="text-lg dark:text-neutral-400">
                  A comprehensive guide to get the most out of our platform.
                </CardDescription>
              </CardHeader>
              <DottedSeparator className="my-2" />

              <Accordion type="multiple">
                <AccordionItem value="create-account">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    1. Create an Account
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p>
                      To start using our platform, you first need to{" "}
                      <strong>
                        <Link
                          href={"/sign-in"}
                          className="text-blue-600 dark:text-blue-400"
                        >
                          create an account
                        </Link>
                      </strong>
                      . By creating an account, you accept our Privacy Policy
                      and Terms of Service.
                    </p>
                    <Alert className="my-2 dark:bg-neutral-800 dark:text-neutral-200">
                      Tip: Creating an account unlocks additional features for
                      workspace management!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="user-features">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    2. User Features & Capabilities
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p className="mb-2">As a user, you can:</p>
                    <ul className="list-disc ml-4 space-y-2">
                      <li>Create and manage multiple workspaces</li>
                      <li>Customize your profile and preferences</li>
                      <li>Set notification preferences</li>
                      <li>Access personal dashboard</li>
                      <li>Track your activities and contributions</li>
                    </ul>
                    <Alert className="my-2 dark:bg-neutral-800 dark:text-neutral-200">
                      Pro Tip: Set up your notification preferences early to
                      stay updated on important changes!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="effective-usage">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    3. Tips for Effective Usage
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p className="mb-2">
                      Maximize your productivity with these tips:
                    </p>
                    <ul className="list-disc ml-4 space-y-2">
                      <li>Use keyboard shortcuts for common actions</li>
                      <li>Organize tasks with labels and priorities</li>
                      <li>
                        Utilize the search function to find content quickly
                      </li>
                      <li>Set up recurring tasks for regular activities</li>
                      <li>Use filters to focus on relevant tasks</li>
                    </ul>
                    <Alert className="my-2 dark:bg-neutral-800 dark:text-neutral-200">
                      Pro Tip: Set up automated weekly reports for stakeholders!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

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

                    <Alert className="my-2" variant="warning">
                      Reminder: Upgrading to the Pro Plan allows you to
                      collaborate with team members on workspaces and projects
                      more effectively!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="project-management">
              <CardHeader className="p-2">
                <CardTitle className="text-3xl font-bold dark:text-white">
                  Project Management
                </CardTitle>
                <CardDescription className="text-lg dark:text-neutral-400">
                  Learn how to effectively manage your projects and teams.
                </CardDescription>
              </CardHeader>
              <DottedSeparator className="my-2" />
              <Accordion type="multiple">
                <AccordionItem value="create-project">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    1. Creating Projects
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p>
                      Create new projects easily by clicking the &quot;New
                      Project&quot; button in your workspace. Each project can
                      have its own:
                    </p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>Custom name and description</li>
                      <li>Team members and roles</li>
                      <li>Task lists and milestones</li>
                      <li>Project-specific settings</li>
                    </ul>
                    <Alert className="my-2 dark:bg-neutral-800 dark:text-neutral-200">
                      Pro Tip: Use project templates to quickly set up common
                      project types!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="task-management">
              <CardHeader className="p-2">
                <CardTitle className="text-3xl font-bold dark:text-white">
                  Task Management
                </CardTitle>
                <CardDescription className="text-lg dark:text-neutral-400">
                  Master the art of task organization and tracking.
                </CardDescription>
              </CardHeader>
              <DottedSeparator className="my-2" />
              <Accordion type="multiple">
                <AccordionItem value="task-creation">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    1. Task Creation and Assignment
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p>Create and assign tasks with detailed information:</p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>Task title and description</li>
                      <li>Due dates and priorities</li>
                      <li>Assignees and watchers</li>
                      <li>Labels and categories</li>
                    </ul>
                    <Alert className="my-2 dark:bg-neutral-800 dark:text-neutral-200">
                      Tip: Use bulk actions to manage multiple tasks at once!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="team-collaboration">
              <CardHeader className="p-2">
                <CardTitle className="text-3xl font-bold dark:text-white">
                  Team Collaboration
                </CardTitle>
                <CardDescription className="text-lg dark:text-neutral-400">
                  Work together effectively with your team.
                </CardDescription>
              </CardHeader>
              <DottedSeparator className="my-2" />
              <Accordion type="multiple">
                <AccordionItem value="team-communication">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    1. Communication Tools
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p>
                      Stay connected with your team using our built-in
                      communication tools:
                    </p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>Task comments and discussions</li>
                      <li>Team announcements</li>
                      <li>File sharing</li>
                      <li>@mentions and notifications</li>
                    </ul>
                    <Alert
                      className="my-2 dark:bg-neutral-800 dark:text-neutral-200"
                      variant="info"
                    >
                      Pro users get access to advanced collaboration features!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="pro-features">
              <CardHeader className="p-2">
                <CardTitle className="text-3xl font-bold dark:text-white">
                  Pro Features
                </CardTitle>
                <CardDescription className="text-lg dark:text-neutral-400">
                  Unlock advanced features to supercharge your productivity.
                </CardDescription>
              </CardHeader>
              <DottedSeparator className="my-2" />
              <Accordion type="multiple">
                <AccordionItem value="advanced-analytics">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    1. Advanced Analytics
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p>
                      Get detailed insights into your team&apos;s performance:
                    </p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>Project progress tracking</li>
                      <li>Team productivity metrics</li>
                      <li>Custom report generation</li>
                      <li>Data visualization tools</li>
                    </ul>
                    <Alert className="my-2 dark:bg-neutral-800 dark:text-neutral-200">
                      Pro Tip: Set up automated weekly reports for stakeholders!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>

                <AdBanner
                  dataAdFormat="fluid"
                  dataFullWidthResponsive
                  dataAdSlot="3712205876"
                  pId="5888317157317698"
                />

                <AccordionItem value="custom-workflows">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    2. Custom Workflows
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p>Create tailored workflows for your team:</p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>Automated task assignments</li>
                      <li>Custom approval processes</li>
                      <li>Integrated notifications</li>
                      <li>Workflow templates</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="integrations">
              <CardHeader className="p-2">
                <CardTitle className="text-3xl font-bold dark:text-white">
                  Integrations
                </CardTitle>
                <CardDescription className="text-lg dark:text-neutral-400">
                  Connect with your favorite tools and services.
                </CardDescription>
              </CardHeader>
              <DottedSeparator className="my-2" />
              <Accordion type="multiple">
                <AccordionItem value="available-integrations">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    1. Available Integrations
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p>Seamlessly connect with popular services:</p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>GitHub & GitLab</li>
                      <li>Slack & Microsoft Teams</li>
                      <li>Google Workspace</li>
                      <li>Zoom & Microsoft 365</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="api-access">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    2. API Access
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p>Build custom integrations with our API:</p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>RESTful API endpoints</li>
                      <li>Webhook support</li>
                      <li>Detailed documentation</li>
                      <li>API rate limits</li>
                    </ul>
                    <Alert
                      className="my-2 dark:bg-neutral-800 dark:text-neutral-200"
                      variant="info"
                    >
                      Developer? Check out our API documentation for more
                      details!
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="security">
              <CardHeader className="p-2">
                <CardTitle className="text-3xl font-bold dark:text-white">
                  Security & Privacy
                </CardTitle>
                <CardDescription className="text-lg dark:text-neutral-400">
                  Learn about our security features and data protection
                  measures.
                </CardDescription>
              </CardHeader>
              <DottedSeparator className="my-2" />
              <Accordion type="multiple">
                <AccordionItem value="data-protection">
                  <AccordionTrigger className="text-lg font-semibold dark:text-neutral-200">
                    1. Data Protection
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-neutral-300">
                    <p>We take your data security seriously:</p>
                    <ul className="list-disc ml-4 mt-2">
                      <li>End-to-end encryption</li>
                      <li>Regular security audits</li>
                      <li>GDPR compliance</li>
                      <li>Data backup and recovery</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <AdBanner
              dataAdFormat="fluid"
              dataFullWidthResponsive
              dataAdSlot="3712205877"
              pId="5888317157317698"
            />
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Page;
