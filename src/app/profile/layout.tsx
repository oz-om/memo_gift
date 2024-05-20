import type { Metadata } from "next";
import Profile_nav from "./components/Profile_nav";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile MEMORY_GIFT user profile",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Profile_nav />
      {children}
    </main>
  );
}
