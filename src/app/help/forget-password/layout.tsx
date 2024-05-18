import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Lost Password Reset",
  description: "lost password reset page, restore your password",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
