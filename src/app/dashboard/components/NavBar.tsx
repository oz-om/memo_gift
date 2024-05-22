import Image from "next/image";
import Link from "next/link";
import { Navigate_link, Close_menu, Open_menu } from "./client/Navbar";
import { Session } from "next-auth";

export default function NavBar({ session }: { session: Session }) {
  return (
    <nav className='relative'>
      <div className='pt-4 pb-5 md:relative'>
        <div className='nav-row flex justify-between items-center px-2 mb-2'>
          <div className='navigation '>
            <Open_menu />
            <ul className='nave_menu flex flex-col bg-teal-50 fixed z-10 bg-sky-300/10 w-0 max-w-[13rem] left-0 top-0 h-full overflow-hidden sm:overflow-visible sm:w-10 sm:pt-10 md:w-40 transition-[width]'>
              <Close_menu />
              <Navigate_link name={"Dashboard"} to='/dashboard' icon={"bx-home-circle"} />
              <Navigate_link name={"Orders"} to='/dashboard/orders' icon={"bxs-store"} />
              <Navigate_link name={"Products"} to='/dashboard/products' icon={"bxs-package"} />
              <Navigate_link name={"Add"} to='/dashboard/add' icon={"bx-customize"} />
              <Navigate_link name={"Blogs"} to='/dashboard/blogs' icon={"bx-text"} />
            </ul>
          </div>
          <div className='logo'>
            <Link href={"/"}>
              <p className='font-extrabold text-xl'>
                <span className='text-teal-400'>Gifts</span>-memori
              </p>
            </Link>
          </div>
          <div className='account'>
            <div className='account_toggle flex items-center justify-center cursor-pointer'>
              <figure className='w-6 h-6 rounded-full overflow-hidden'>
                <Image src={`${session?.user.profile_pic ?? ""}`} alt={"profile picture"} width={50} height={50} />
              </figure>
              <i className='bx bx-chevron-down'></i>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
