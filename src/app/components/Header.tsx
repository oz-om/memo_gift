"use client";
import { usePathname } from "next/navigation";
import Header_hero from "../home/components/Header_hero";
import { useSession } from "next-auth/react";
import { AccountIcon, Close_menu, LogOut, Open_cart, Open_menu } from "./client/Navbar";
import Link from "next/link";
import Image from "next/image";
import BuiltNewCustomGift from "../home/components/client/BuiltNewCustomGift";

export default function Header({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (/^\/dashboard(?:[\/?].*)?$/.test(path)) return <></>;
  const { data: login } = useSession();
  return (
    <header className={"" + (path == "/" && "header_wrapper relative  text-white  bg-center bg-cover pb-16")}>
      {path == "/" && <div className='header__layer absolute left-0 top-0 w-full h-full bg-black/20'></div>}
      <div className='container'>
        <nav className='relative'>
          <div className='pt-4 pb-5 md:relative'>
            <div className='nav-row flex justify-between px-2 mb-2'>
              {/* // nav bar appear only on small screens */}
              <div className='navigation md:hidden'>
                <Open_menu />
                <ul className='nave_menu flex flex-col bg-white fixed z-10 bg-sky-300/10 overflow-hidden w-0 max-w-xs left-0 top-0 h-full  transition-[width]'>
                  <li className='flex justify-between'>
                    {!!login && (
                      <Link href={"/profile"}>
                        <div className='user flex items-center ml-2 mt-2 gap-x-2 mb-4'>
                          <figure className='w-8 rounded-full overflow-hidden'>
                            <Image src={`${login?.user.profile_pic}`} alt={"user profile"} width={100} height={100} />
                          </figure>

                          <p className='text-black'>{login?.user.username}</p>
                        </div>
                      </Link>
                    )}
                    <Close_menu />
                  </li>
                  <Navigate_link name={"Home"} to='/' icon={"bx-home-circle"} />
                  <li className='px-2 py-2 text-sky-900 hover:bg-skys-900/70 hover:text-sky-500 flex items-center gap-x-2'>
                    <i className={"bx text-2xl bx-customize"}></i>
                    <BuiltNewCustomGift className='font-medium capitalize' />
                  </li>
                  <Navigate_link name={"marketplace"} to='/collections/premade' icon={"bxs-package"} />

                  <Navigate_link name={"blogs"} to='/blogs' icon={"bxs-pen"} />
                  <Navigate_link name={"about"} to='/' icon={"bx-info-circle"} />
                  {!login ? (
                    <>
                      <Navigate_link name={"Login"} to='/sign-in' icon={"bx-user-circle"} className='mt-auto' />
                      <Navigate_link name={"Sign-up"} to='/sign-up' icon={"bx-plug"} />
                    </>
                  ) : null}
                  {!!login && <LogOut className='px-2 py-2 mt-auto text-red-900 hover:text-red-500 flex items-center gap-x-2 cursor-pointer' iconStyle='text-2xl' />}
                </ul>
              </div>
              {/* // appear always  */}
              <div className='logo'>
                <Link href={"/"}>
                  <p className='font-extrabold text-xl'>
                    <span className='text-teal-400'>Gifts</span>-memori
                  </p>
                </Link>
              </div>
              <div className='basket_wrapper flex gap-x-2'>
                <div className='basket'>
                  <Open_cart />
                  {/* // the childe is cart component which is  a server component*/}
                  {children}
                  {/* <Cart_wrapper cartContent={cart} totalPrice={totalPrice} loading={isLoading} /> */}
                </div>
                {!!login && (
                  <div className='user'>
                    <AccountIcon user={login.user} />
                  </div>
                )}
              </div>
            </div>
            <div className='search md:absolute md:mx-auto md:top-5 md:left-1/2 md:-translate-x-1/2 md:w-2/3'>
              <div className='search-bar relative flex justify-center items-center w-9/12 max-w-screen-sm ml-auto mr-auto'>
                <input type='text' className='shadow-[0px_0px_0px_1px_#2dcfb38c] outline-none rounded-md w-full pl-2 py-1 font-semibold text-sm bg-transparent placeholder:text-emerald-200' placeholder='search...' />
                <i className='bx bx-search-alt text-teal-400 absolute right-0 cursor-pointer mx-2'></i>
              </div>
            </div>
          </div>
        </nav>
        {/* // nav bar appear from medium screens  */}
        <nav className='header_navigate relative hidden md:block mb-2'>
          <ul className='flex items-center text-sm'>
            <BuiltNewCustomGift className='px-2 capitalize whitespace-nowrap hover:text-teal-300' />
            <Link className='px-2 capitalize whitespace-nowrap hover:text-teal-300' href={"/collections/premade"}>
              marketplace
            </Link>
            <Link className='px-2 capitalize whitespace-nowrap  hover:text-teal-300' href={"/blogs"}>
              blogs
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
            ) : null}
          </ul>
        </nav>
        {path == "/" && <Header_hero />}
      </div>
    </header>
  );
}

type NavigateLinkProps = {
  className?: string;
  to: string;
  icon: string;
  name: string;
};
function Navigate_link({ className, to, icon, name }: NavigateLinkProps) {
  return (
    <li>
      <Link className={"px-2 py-2 text-sky-900 hover:bg-skys-900/70 hover:text-sky-500 flex items-center gap-x-2 " + className} href={to}>
        <i className={"bx text-2xl " + icon}></i>
        <span className='font-medium capitalize'>{name}</span>
      </Link>
    </li>
  );
}
