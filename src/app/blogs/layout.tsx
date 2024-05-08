import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "blogs",
  description: "Stay in the know with all things MEMORY_GIFTS including gift guides, new product launches, features, and upcoming events memory_gifts BLOG",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
