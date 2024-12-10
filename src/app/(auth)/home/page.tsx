import { Metadata } from "next/types";
import { Content } from "./content";
import { Header } from "./header";
import AdBanner from "@/components/adsense/AdBanner";

export const metadata: Metadata = {
  title: "Home",
  description: "Create workspaces for your team and create beautiful works",
  keywords: "workspace, team, collaboration",
  authors: {
    name: "Illusion",
  },
};

const Home = () => {
  return (
    <div className="w-full h-full">
      <Header />
      <Content />
    </div>
  );
};

export default Home;
