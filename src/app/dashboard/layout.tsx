import "./styles/style.css";
import NavBar from "./components/NavBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/nextAuthOptions";
import { redirect } from "next/navigation";
import QueryCtProvider from "./components/client/QueryCtProvider";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let session = await getServerSession(authOptions);
  if (!session || session?.user.role !== "admin") {
    return redirect("/not-found");
  }
  return (
    <>
      <QueryCtProvider>
        <header>
          <NavBar session={session} />
        </header>
        <main className='dashboard relative sm:ml-10 md:ml-40 px-2   '>{children}</main>
      </QueryCtProvider>
    </>
  );
}
