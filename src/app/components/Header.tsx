"use client";
import { usePathname } from "next/navigation";
import Header_hero from "../home/components/Header_hero";

export default function Header({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (/^\/dashboard(?:[\/?].*)?$/.test(path)) return <></>;
  return (
    <header className={"" + (path == "/" && "header_wrapper relative  text-white  bg-center bg-cover pb-16")}>
      {path == "/" && <div className='header__layer absolute left-0 top-0 w-full h-full bg-black/20'></div>}
      <div className='container'>
        {children}
        {path == "/" && <Header_hero />}
      </div>
    </header>
  );
}
