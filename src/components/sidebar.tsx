import Link from "next/link";
import Image from "next/image";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 dark:bg-neutral-900 p-4 w-full">
      <Link href={"/"}>
        <div className="hidden dark:block">
          <Image src="/DarkLogo.svg" height={48} width={164} alt="Logo" />
        </div>
        <div className="hidden dark:hidden">
          <Image src="/LightLogo.svg" height={48} width={164} alt="Logo" />
        </div>
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
