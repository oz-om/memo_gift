import Link from "next/link";
import Cart_wrapper from "./cart/Cart_wrapper";
import { Close_menu, Open_cart, Open_menu } from "./client/Navbar";

type NavigateLinkProps = {
  className?: string;
  to: string;
  icon: string;
  name: string;
};
function Navigate_link({ className, to, icon, name }: NavigateLinkProps) {
  return (
    <li>
      <Link className={"px-2 py-2 text-sky-900 hover:bg-skys-900/70 hover:text-sky-100 flex items-center gap-x-2 " + className} href={to}>
        <i className={"bx text-2xl " + icon}></i>
        <span className='font-medium'>{name}</span>
      </Link>
    </li>
  );
}

export default function Navbar() {
  const login = false;
  return (
    <nav className='relative'>
      <div className='pt-4 pb-5 md:relative'>
        <div className='nav-row flex justify-between px-2 mb-2'>
          <div className='navigation md:hidden'>
            <Open_menu />
            <ul className='nave_menu flex flex-col bg-white fixed z-10 bg-sky-300/10 overflow-hidden w-0 max-w-md left-0 top-0 h-full  transition-[width]'>
              <Close_menu />
              <Navigate_link name={"Home"} to='/' icon={"bx-home-circle"} />
              <Navigate_link name={"holiday 2023"} to='/' icon={"bxs-hot"} />
              <Navigate_link name={"build a memori_gift"} to='/build-a-memori_gift?step=one' icon={"bx-customize"} />
              <Navigate_link name={"shop"} to='/collections?type=premade' icon={"bxs-package"} />
              <Navigate_link name={"corporate gifting"} to='/' icon={"bx-equalizer"} />
              <Navigate_link name={"about"} to='/' icon={"bx-info-circle"} />
              {!login ? (
                <>
                  <Navigate_link name={"Login"} to='/sign-in' icon={"bx-user-circle"} className='mt-auto' />
                  <Navigate_link name={"Sign-up"} to='/sign-up' icon={"bx-plug"} />
                </>
              ) : (
                <Link className='px-2 py-2 text-sky-900 hover:bg-sky-900/70 hover:text-sky-100' href={"/account"}>
                  Account
                </Link>
              )}
            </ul>
          </div>
          <div className='logo'>
            <Link href={"/"}>
              <p className='font-extrabold text-xl'>
                <span className='text-teal-400'>Gifts</span>-memori
              </p>
            </Link>
          </div>
          <div className='basket'>
            <Open_cart />
            <Cart_wrapper />
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
