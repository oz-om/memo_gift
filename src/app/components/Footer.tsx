"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
export default function Footer() {
  const path = usePathname();
  if (/^\/dashboard(?:[\/?].*)?$/.test(path)) return <></>;
  return (
    <footer className='bg-slate-800 text-white pt-5 mt-10'>
      <div className='container'>
        <div className='footer_logo mb-5'>
          <div className='logo'>
            <p className='font-extrabold text-xl'>
              <span className='text-teal-400'>Gifts</span>-memori
            </p>
          </div>
        </div>
        <div className='footer_content grid sm:grid-cols-2 md:grid-cols-3'>
          <div className='helpful_links mb-5'>
            <h4 className='font-medium uppercase flex items-center'>
              <span>helpful links</span>
              <i className='bx bxs-chevron-right ml-3 text-2xl'></i>
            </h4>
            <ul className='text-sm ml-4'>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>FAQ</Link>
              </li>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>ABOUT</Link>
              </li>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>CONTACT</Link>
              </li>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>BLOG</Link>
              </li>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>THE FOX FLEET</Link>
              </li>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>ACCESSIBILITY</Link>
              </li>
            </ul>
          </div>
          <div className='footer_menu mb-5'>
            <h4 className='font-medium uppercase flex items-center'>
              <span>menu</span>
              <i className='bx bxs-chevron-right ml-3 text-2xl'></i>
            </h4>
            <ul className='text-sm ml-4'>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>HOLIDAY 2023</Link>
              </li>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>Build a Memory_gift</Link>
              </li>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>SHOP</Link>
              </li>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>ABOUT</Link>
              </li>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>CORPORATE</Link>
              </li>
              <li className='py-1 hover:border-b hover:border-teal-300 w-fit h-6'>
                <Link href={"/"}>GIFTING</Link>
              </li>
            </ul>
          </div>
          <div className='contact_info text-sm mb-5'>
            <div className='location py-2'>
              <i className='bx bx-current-location mr-3'></i>
              <a href='/'>5819 6th Ave S, Seattle, WA 98108</a>
            </div>
            <div className='phone_number py-2'>
              <i className='bx bxs-phone mr-3'></i>
              <a href='tel:123'>206-557-4525</a>
            </div>
            <div className='email py-2'>
              <i className='bx bxs-envelope mr-3'></i>
              <a href='mailto:mail'>help@knackshops.com</a>
            </div>
          </div>
        </div>
      </div>
      <div className='rights_policy bg-slate-950 mt-5 py-2'>
        <div className='container text-xs'>
          <span>Copyright © 2023 Ubuy Co. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
