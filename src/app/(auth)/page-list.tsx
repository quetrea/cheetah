"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { usePathname } from "next/navigation";

const links = [
  { label: "Home", path: "/home", deActive: false },

  { label: "Blogs", path: "/blogs", deActive: false },
  { label: "Privacy Policy", path: "/privacy", deActive: false },
];

export const PageList = () => {
  const pathname = usePathname();
  return (
    <div className="list-none flex items-center justify-center px-5  sm:px-2 lg:px-6  gap-x-4 sm:gap-x-2">
      {Object.values(links).map((item) => {
        const isActive = item.path === pathname;
        if (isActive) {
          console.log(item.path);
        }
        return (
          <li
            key={item.path}
            className={cn(
              "hover:border-neutral-300 py-1 px-2 cursor-pointer transition-all border-b border-transparent",
              isActive ? "border-neutral-900 border-b" : "border-transparent",
              item.deActive ? "hidden" : "block"
            )}
          >
            <Link href={item.path}>{item.label}</Link>
          </li>
        );
      })}
    </div>
  );
};
