"use client";
import { usePathname } from "next/navigation";
import React from "react";

export default function SearchBar() {
  const path = usePathname();
  if (path !== "/dashboard/products") {
    return <></>;
  }
  return (
    <search className=' mt-3'>
      <div className='input max-w-xs mx-auto relative'>
        <input type='search' name='' id='' className='w-full h-full py-2 px-2 bg-transparent rounded outline-teal-100 focus:outline focus:outline-2  border' placeholder='search' />
        <i className='bx bx-search-alt absolute right-0  bg-slate-100 text-teal-400 h-full flex items-center bx-sm before:relative before:top-2 before:mx-1 rounded cursor-pointer'></i>
      </div>
    </search>
  );
}
