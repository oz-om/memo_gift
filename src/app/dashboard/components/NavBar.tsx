import { authOptions } from "@/utils/nextAuthOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Navigate_link, Close_menu, Open_menu } from "./client/Navbar";

export default async function NavBar() {
  let login = await getServerSession(authOptions);

  return (
    <nav className='relative'>
      <div className='pt-4 pb-5 md:relative'>
        <div className='nav-row flex justify-between items-center px-2 mb-2'>
          <div className='navigation '>
            <Open_menu />
            <ul className='nave_menu flex flex-col bg-teal-50 fixed z-10 bg-sky-300/10 overflow-hidden w-0 max-w-[13rem] left-0 top-0 h-full sm:w-10 sm:pt-10 md:w-40 transition-[width]'>
              <Close_menu />
              <Navigate_link name={"Dashboard"} to='/dashboard' icon={"bx-home-circle"} />
              <Navigate_link name={"Orders"} to='/dashboard/orders' icon={"bxs-store"} />
              <Navigate_link name={"Products"} to='/dashboard/products' icon={"bxs-package"} />
              <Navigate_link name={"Add new"} to='/dashboard/add' icon={"bx-customize"} />
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
                <Image src={`${login?.user.profile_pic}`} alt={"profile picture"} width={50} height={50} />
              </figure>
              <i className='bx bx-chevron-down'></i>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
