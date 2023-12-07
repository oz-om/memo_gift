import type { Metadata } from "next";
import Add_nav_type from "./components/Add_nav_type";
export const metadata: Metadata = {
  title: "dashboard | add new",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className='mb-4'>
        <p className='text-xs text-slate-400 ml-2'>add new:</p>
        <Add_nav_type />
      </nav>
      {children}
    </>
  );
}
