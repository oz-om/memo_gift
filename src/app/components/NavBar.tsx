"use client";
import Image from "next/image";
import Link from "next/link";
import BuiltNewCustomGift from "../home/components/client/BuiltNewCustomGift";
import Cart_wrapper from "./cart/Cart_wrapper";
import { AccountIcon, Close_menu, LogOut, Open_cart, Open_menu } from "./client/Navbar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { T_cart, getCartContent } from "../action";

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

export default function Navbar() {
  const { data: login } = useSession();
  const [cart, setCart] = useState<T_cart>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function setCartContent() {
    if (!cart.length) {
      setIsLoading(true);
      getCartContent()
        .then((res) => {
          setIsLoading(false);
          if (res.success) {
            setCart(res.cart);
            setTotalPrice(res.totalPrice);
          }
        })
        .catch(() => setIsLoading(false));
    }
  }
  return (
    <nav className='relative'>
      <div className='pt-4 pb-5 md:relative'>
        <div className='nav-row flex justify-between px-2 mb-2'>
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
          <div className='logo'>
            <Link href={"/"}>
              <p className='font-extrabold text-xl'>
                <span className='text-teal-400'>Gifts</span>-memori
              </p>
            </Link>
          </div>
          <div className='basket_wrapper flex gap-x-2'>
            <div className='basket'>
              <Open_cart setCartContent={setCartContent} />
              <Cart_wrapper cartContent={cart} totalPrice={totalPrice} loading={isLoading} />
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
  );
}
