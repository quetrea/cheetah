import { Metadata } from "next";
import { PrivacyClient } from "./client";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Create workspaces for your team and create beautiful works",
  keywords: "workspace, team, collaboration", // Anahtar kelimeler eklendi
  authors: {
    name: "Illusion",
  },
};

const Privacy = () => {
  return (
    <div className=" flex items-center justify-center border w-full h-full">
      <div className="max-w-3xl">
        <PrivacyClient />
      </div>
    </div>
  );
};

export default Privacy;
