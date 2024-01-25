import Loading from "@/app/loading";
import { Suspense } from "react";
import NavTypeSwitch from "./components/client/NavTypeSwitch";
import SearchBar from "./components/client/SearchBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className='mb-4'>
        <NavTypeSwitch />
        <SearchBar />
      </nav>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </>
  );
}
