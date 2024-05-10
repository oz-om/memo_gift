import Link from "next/link";
import React from "react";

export default function Profile_nav() {
  return (
    <nav className='bg-slate-50 sticky top-0 py-2 mb-5'>
      <div className='container'>
        <div className='open_nav hidden'>
          <button>
            <i className='bx bx-menu-alt-left'></i>
          </button>
        </div>
        <ul className='profile_links text-sm flex gap-x-2'>
          <li>
            <Link href={"/"} className=' px-2 border-l bg-teal-50 border-teal-300 text-teal-500'>
              Account
            </Link>
          </li>
          <li>
            <Link href={"/"} className='px-2 border-l '>
              Orders
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
