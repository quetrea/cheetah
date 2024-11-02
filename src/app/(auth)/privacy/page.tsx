import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";

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
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Privacy Policy</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <h2 className="text-lg font-semibold">1. Information We Collect</h2>
        <p>When you visit our site, we collect the following information:</p>
        <ul className="list-disc pl-5">
          <li>
            Personal Information: Information such as your name, email address,
            and phone number.
          </li>
          <li>
            Usage Data: Information about how the site is used (pages visited,
            click data, etc.).
          </li>
          <li>Cookies: Small data files stored in your browser.</li>
        </ul>

        <h2 className="text-lg font-semibold mt-5">
          2. How We Use Your Information
        </h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul className="list-disc pl-5">
          <li>To provide and maintain our services.</li>
          <li>To improve user experience.</li>
          <li>For advertising and marketing purposes.</li>
          <li>To comply with legal obligations.</li>
        </ul>

        <h2 className="text-lg font-semibold mt-5">3. Advertisements</h2>
        <p>
          Our site may contain third-party advertisements. These advertisements
          may use cookies and other tracking technologies to deliver content
          tailored to users' interests.
        </p>

        <h2 className="text-lg font-semibold mt-5">4. Memberships</h2>
        <p>
          You may need to create a membership to access certain services on our
          site. The information we collect during membership registration will
          be used to personalize user experience and improve our services.
        </p>

        <h2 className="text-lg font-semibold mt-5">
          5. How We Protect Your Data
        </h2>
        <p>
          We take necessary security measures to protect your personal data.
          However, we cannot guarantee that data transmission over the internet
          is completely secure.
        </p>

        <h2 className="text-lg font-semibold mt-5">
          6. Changes to This Privacy Policy
        </h2>
        <p>
          We may update our privacy policy from time to time. When changes are
          made, we will publish the updated policy on this page.
        </p>

        <div className="flex justify-end mt-5">
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Privacy;
