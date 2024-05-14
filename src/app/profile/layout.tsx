import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile MEMORY_GIFT user profile",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}