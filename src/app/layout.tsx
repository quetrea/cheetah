import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AdSense } from "@/components/adsense/AdSense";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const titleSite = "Cheetah";

export const metadata: Metadata = {
  title: {
    default: `${titleSite}`,
    template: `%s | ${titleSite}`,
  },
  description: "Create workspaces for your team and create beautiful works",
  keywords: "workspace, team, collaboration", // Anahtar kelimeler eklendi
  authors: {
    name: "Illusion",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdSense pId="5888317157317698" />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5888317157317698`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <QueryProvider>
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <AdSense pId="5888317157317698" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
