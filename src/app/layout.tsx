import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "StackAudit — AI Spend Audit",
  description:
    "Free 60-second audit of your AI tool spend. Find out where you're overpaying and how much you could save.",
  openGraph: {
    title: "StackAudit — AI Spend Audit",
    description:
      "Find out if you're overpaying for AI tools. Free. No signup required.",
    type: "website",
    siteName: "StackAudit",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackAudit — AI Spend Audit",
    description:
      "Find out if you're overpaying for AI tools. Free. No signup required.",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}