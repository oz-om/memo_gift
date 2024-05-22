import type { Metadata } from "next";
import Profile_nav from "./components/Profile_nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/nextAuthOptions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile MEMORY_GIFT user profile",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/sign-in");
  return (
    <main>
      <Profile_nav />
      {children}
    </main>
  );
}
