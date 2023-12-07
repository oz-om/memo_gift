import Link from "next/link";

export default function NavBar_lg_sc() {
  const login = false;
  return (
    <nav className='header_navigate relative hidden md:block mb-2'>
      <ul className='flex'>
        <Link className='px-2  hover:text-teal-300' href={"/"}>
          Home
        </Link>
        {login && (
          <Link className='px-2  hover:text-teal-300' href={"/favorites"}>
            Favorites
          </Link>
        )}
        <Link className='px-2  hover:text-teal-300' href={"/services"}>
          Services
        </Link>
        <Link className='px-2  hover:text-teal-300' href={"/about"}>
          About
        </Link>
        <Link className='px-2  hover:text-teal-300' href={"/contact"}>
          Contact
        </Link>
        {!login ? (
          <>
            <Link href={"/auth?type=login"} className='px-2  hover:text-teal-300 ml-auto flex flex-col items-center'>
              <i className='bx bx-user-circle text-[25px]'></i>
              <span className='text-[8px]'>Login</span>
            </Link>
            <Link href={"/auth?type=sign-up"} className='px-2  hover:text-teal-300 flex flex-col items-center'>
              <i className='bx bx-plug text-[25px]'></i>
              <span className='text-[8px]'>Sign-up</span>
            </Link>
          </>
        ) : (
          <Link className='px-2  hover:text-teal-300' href={"/account"}>
            Account
          </Link>
        )}
      </ul>
    </nav>
  );
}
