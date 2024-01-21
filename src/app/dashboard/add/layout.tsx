import Loading from "@/app/components/LoadingSpin";
import type { Metadata } from "next";
import { Suspense } from "react";
import NavTypeSwitch from "../components/client/NavTypeSwitch";
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
          <NavTypeSwitch />
        </nav>
        {children}
      </Suspense>
    </>
  );
}
