import "./styles/style.css";
import NavBar from "./components/NavBar";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/nextAuthOptions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "memory-gift | Dashboard",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let session = await getServerSession(authOptions);
  if (!session || session?.user.role !== "admin") {
    return redirect("/not-found");
  }
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className='dashboard sm:ml-10 md:ml-40'>{children}</main>
    </>
  );
}
