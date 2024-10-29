"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { usePathname } from "next/navigation";

const links = [
  { label: "Home", path: "/home", deActive: false },
  { label: "About Us", path: "/about", deActive: true },
  { label: "Privacy Policy", path: "/privacy", deActive: true },
];

export const PageList = () => {
  const pathname = usePathname();
  return (
    <div className="list-none flex items-center justify-center px-5 sm:px-2 gap-x-4 sm:gap-x-2">
      {Object.values(links).map((item) => {
        const isActive = item.path === pathname;
        return (
          <li
            key={item.path}
            className={cn(
              "hover:border-neutral-300 py-1 px-2 cursor-pointer transition-all border-none border-transparent",
              isActive && "border-neutral-900 border-b",
              item.deActive && "hidden"
            )}
          >
            <Link href={item.path}>{item.label}</Link>
          </li>
        );
      })}
    </div>
  );
};
