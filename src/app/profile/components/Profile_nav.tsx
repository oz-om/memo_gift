"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Profile_nav() {
  const path = usePathname();
  const [activePath, setActivePath] = useState({
    profile: false,
    orders: false,
  });

  useEffect(() => {
    const activePath = path.split("/").pop() as string;
    setActivePath({
      profile: false,
      orders: false,
      [activePath]: true,
    });
  }, [path]);
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
            <Link href={"/profile"} className={" px-2 border-l " + (activePath.profile && "border-teal-300 bg-teal-50 text-teal-500")}>
              Account
            </Link>
          </li>
          <li>
            <Link href={"/profile/orders"} className={"px-2 border-l " + (activePath.orders && "border-teal-300 bg-teal-50 text-teal-500")}>
              Orders
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
