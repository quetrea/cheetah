import { useState, useEffect } from "react";

const RECENT_PROJECTS_KEY = "recent-projects";
const MAX_RECENT_PROJECTS = 3;

interface RecentProject {
  id: string;
  name: string;
  imageUrl?: string;
  workspaceId: string;
  lastVisited: number;
}

export const useRecentProjects = () => {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_PROJECTS_KEY);
    if (stored) {
      setRecentProjects(JSON.parse(stored));
    }
  }, []);

  const addRecentProject = (project: Omit<RecentProject, "lastVisited">) => {
    setRecentProjects((current) => {
      const filtered = current.filter((p) => p.id !== project.id);
      const updated = [
        { ...project, lastVisited: Date.now() },
        ...filtered,
      ].slice(0, MAX_RECENT_PROJECTS);

      localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    recentProjects,
    addRecentProject,
  };
};
