import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {

  title: "AI Spend Audit",

  description:
    "Audit your AI tool spending and discover savings instantly.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="en">

      <body>

        {children}

      </body>

    </html>
  );
}