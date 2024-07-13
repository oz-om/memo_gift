import { Suspense } from "react";
import NavTypeSwitch from "./components/NavTypeSwitch";
import Loading from "@/app/loading";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className='mb-4'>
        <NavTypeSwitch />
      </nav>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </>
  );
}
