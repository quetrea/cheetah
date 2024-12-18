import Image from "next/image";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassname?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClassname,
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn(
          "size-5 relative bg-white rounded-md overflow-hidden group-hover:opacity-75 transition",
          className
        )}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "text-white bg-blue-600 font-semibold text-sm uppercase rounded-md group-hover:opacity-75 transition",
          fallbackClassname
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
