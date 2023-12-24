"use client";
import { signIn } from "next-auth/react";
export default function Auth_provider({ name, icon, bg }: { [key: string]: string }) {
  async function authHandler() {
    let res = await signIn(name, {
      redirect: true,
      callbackUrl: "/sign-in",
    });
    console.log(res);
  }
  return (
    <li onClick={authHandler} className='flex flex-col items-center cursor-pointer'>
      <i className={icon + " bx bx-border-circle text-white hover:scale-105 transition-[transform] " + bg}></i>
    </li>
  );
}
