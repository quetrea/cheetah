import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateTask } from "../../api/use-update-task";
import { Project } from "@/features/projects/types";

interface ProjectColumnProps {
  project: Project;
  taskId: string;
}

export const ProjectColumn = ({ project, taskId }: ProjectColumnProps) => {
  const { mutate, isPending } = useUpdateTask();
  return (
    <div className="flex items-center gap-x-2 ml-2 text-sm font-medium">
      <ProjectAvatar
        className="size-6"
        image={project.imageUrl}
        name={project.name}
      />
      <p className="line-clamp-1 ">{project.name}</p>
    </div>
  );
};
