import { authOptions } from "@/utils/nextAuthOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "./styles/style.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let session = await getServerSession(authOptions);
  console.log("server session => ", session);
  if (session) {
    redirect("/");
  }
  return (
    <main className='auth'>
      <div className='container'>{children}</div>
    </main>
  );
}
