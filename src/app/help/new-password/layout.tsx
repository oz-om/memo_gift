import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "set new Password",
  description: "set new password page, restore your password",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
