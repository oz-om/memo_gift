import Loading from "@/app/components/LoadingSpin";
import type { Metadata } from "next";
import { Suspense } from "react";
import Add_nav_type from "./components/Add_nav_type";
export const metadata: Metadata = {
  title: "Add New - Dashboard",
  robots: {
    index: false,
    nocache: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <nav className='mb-4'>
          <p className='text-xs text-slate-400 ml-2'>add new:</p>
          <Add_nav_type />
        </nav>
        {children}
      </Suspense>
    </>
  );
}
