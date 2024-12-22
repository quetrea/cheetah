"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

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
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
              {t("common.goBack")}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t("privacy.lastUpdated")}: {new Date().toLocaleDateString()}
            </span>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("privacy.title")}
          </CardTitle>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            {t("privacy.description")}
          </p>
        </CardHeader>

        <DottedSeparator />

        <CardContent className="p-8 space-y-6">
          <PolicySection title={t("privacy.sections.dataCollection.title")}>
            <p>{t("privacy.sections.dataCollection.description")}</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <span className="font-medium text-foreground">
                  {t("privacy.sections.dataCollection.items.personal.title")}:
                </span>{" "}
                {t(
                  "privacy.sections.dataCollection.items.personal.description"
                )}
              </li>
              <li>
                <span className="font-medium text-foreground">
                  {t("privacy.sections.dataCollection.items.usage.title")}:
                </span>{" "}
                {t("privacy.sections.dataCollection.items.usage.description")}
              </li>
              <li>
                <span className="font-medium text-foreground">
                  {t("privacy.sections.dataCollection.items.technical.title")}:
                </span>{" "}
                {t(
                  "privacy.sections.dataCollection.items.technical.description"
                )}
              </li>
            </ul>
          </PolicySection>

          <PolicySection title={t("privacy.sections.dataUsage.title")}>
            <p>{t("privacy.sections.dataUsage.description")}</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>{t("privacy.sections.dataUsage.items.0")}</li>
              <li>{t("privacy.sections.dataUsage.items.1")}</li>
              <li>{t("privacy.sections.dataUsage.items.2")}</li>
              <li>{t("privacy.sections.dataUsage.items.3")}</li>
            </ul>
          </PolicySection>

          <PolicySection title={t("privacy.sections.dataProtection.title")}>
            <p>{t("privacy.sections.dataProtection.description")}</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>{t("privacy.sections.dataProtection.items.0")}</li>
              <li>{t("privacy.sections.dataProtection.items.1")}</li>
              <li>{t("privacy.sections.dataProtection.items.2")}</li>
              <li>{t("privacy.sections.dataProtection.items.3")}</li>
            </ul>
          </PolicySection>

          <PolicySection title={t("privacy.sections.yourRights.title")}>
            <p>{t("privacy.sections.yourRights.description")}</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>{t("privacy.sections.yourRights.items.0")}</li>
              <li>{t("privacy.sections.yourRights.items.1")}</li>
              <li>{t("privacy.sections.yourRights.items.2")}</li>
              <li>{t("privacy.sections.yourRights.items.3")}</li>
            </ul>
          </PolicySection>

          <PolicySection title={t("privacy.sections.contactUs.title")}>
            <p>{t("privacy.sections.contactUs.description")}</p>
            <div className="bg-muted p-4 rounded-lg mt-2">
              <p className="font-medium">
                {t("privacy.sections.contactUs.contact.email")}
              </p>
            </div>
          </PolicySection>
        </CardContent>
      </Card>
    </motion.div>
  );
};
