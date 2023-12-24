import { authOptions } from "@/utils/nextAuthOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { AccountIcon } from "./client/Navbar";

export default async function NavBar_lg_sc() {
  const login = await getServerSession(authOptions);

  return (
    <nav className='header_navigate relative hidden md:block mb-2'>
      <ul className='flex items-center text-sm'>
        <Link className='px-2 capitalize whitespace-nowrap hover:text-teal-300' href={"/build-a-memori_gift?step=one"}>
          build a MemoryGift
        </Link>
        <Link className='px-2 capitalize whitespace-nowrap hover:text-teal-300' href={"/collections?type=premade"}>
          marketplace
        </Link>
        <Link className='px-2 capitalize whitespace-nowrap hover:text-teal-300' href={"/"}>
          corporate gifting
        </Link>
        <Link className='px-2 capitalize whitespace-nowrap  hover:text-teal-300' href={"/"}>
          Contact
        </Link>
        {!login ? (
          <>
            <Link href={"/sign-in"} className='px-2  hover:text-teal-300 ml-auto flex flex-col items-center'>
              <i className='bx bx-user-circle text-[25px]'></i>
              <span className='text-[8px]'>Login</span>
            </Link>
            <Link href={"/sign-up"} className='px-2  hover:text-teal-300 flex flex-col items-center'>
              <i className='bx bx-plug text-[25px]'></i>
              <span className='text-[8px]'>Sign-up</span>
            </Link>
          </>
        ) : (
          <button className='ml-auto relative'>
            <AccountIcon user={login.user} />
          </button>
        )}
      </ul>
    </nav>
  );
}
