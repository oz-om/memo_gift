"use client";
import { useUrlChanged } from "@/app/hooks/useUrlChanged";
import Link from "next/link";
import { usePathname } from "next/navigation";

function toggleMenu() {
  document.querySelector(".nave_menu")?.classList.toggle("w-0");
  document.querySelector(".nave_menu")?.classList.toggle("w-full");
}

export function Navigate_link({ className, to, icon, name }: { [key: string]: string }) {
  let path = usePathname();
  let activeLink = path == to;
  return (
    <li>
      <Link className={"px-2 py-2 text-sky-900 hover:bg-sky-300/5 hover:text-sky-600 flex items-center gap-x-2 " + (activeLink && "bg-sky-300/20 text-teal-400 ") + className} href={to}>
        <i className={"bx text-2xl " + icon}></i>
        <span className='font-medium'>{name}</span>
      </Link>
    </li>
  );
}

export function Open_menu() {
  return <i onClick={toggleMenu} className='bx bx-menu-alt-left text-teal-400 text-3xl font-extrabold cursor-pointer sm:hidden'></i>;
}

export function Close_menu() {
  useUrlChanged({
    eleClass: ".nave_menu",
    openClass: "w-full",
    resetFn: toggleMenu,
  });
  return (
    <div className='close_menu text-end sm:hidden' onClick={toggleMenu}>
      <i className='bx bx-x text-black text-3xl cursor-pointer'></i>
    </div>
  );
}
