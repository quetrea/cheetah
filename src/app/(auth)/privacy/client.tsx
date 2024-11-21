"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <motion.div variants={item} className="mb-8">
    <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      {title}
    </h2>
    <div className="space-y-3 text-muted-foreground">{children}</div>
  </motion.div>
);

export const PrivacyClient = () => {
  const router = useRouter();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="max-w-4xl mx-auto w-full"
    >
      <Card className="border shadow-lg">
        <CardHeader className="space-y-6 p-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Privacy Policy
          </CardTitle>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            At Cheetah, we take your privacy seriously. This policy describes
            what personal information we collect and how we use it.
          </p>
        </CardHeader>

        <DottedSeparator />

        <CardContent className="p-8 space-y-6">
          <PolicySection title="1. Information We Collect">
            <p>
              We collect various types of information to provide and improve our
              services:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <span className="font-medium text-foreground">
                  Personal Information:
                </span>{" "}
                Name, email address, and contact details
              </li>
              <li>
                <span className="font-medium text-foreground">Usage Data:</span>{" "}
                Interaction with our platform, features used, and preferences
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Technical Data:
                </span>{" "}
                IP address, browser type, device information
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="2. How We Use Your Information">
            <p>Your information helps us provide and improve our services:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Personalize your experience and content</li>
              <li>Process your transactions and maintain your account</li>
              <li>Send important notifications and updates</li>
              <li>Analyze usage patterns to improve our platform</li>
            </ul>
          </PolicySection>

          <PolicySection title="3. Data Protection">
            <p>We implement robust security measures to protect your data:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Encryption of sensitive information</li>
              <li>Regular security assessments and updates</li>
              <li>Strict access controls and authentication</li>
              <li>Compliance with industry security standards</li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Your Rights">
            <p>You have several rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access your personal information</li>
              <li>Request corrections or deletions</li>
              <li>Object to processing of your data</li>
              <li>Download a copy of your data</li>
            </ul>
          </PolicySection>

          <PolicySection title="5. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg mt-2">
              <p className="font-medium">Email: privacy@cheetah.com</p>
              <p className="font-medium">
                Address: 123 Privacy Street, Security City, 12345
              </p>
            </div>
          </PolicySection>
        </CardContent>
      </Card>
    </motion.div>
  );
};
