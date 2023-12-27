"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Auth_provider({ name, icon, bg }: { [key: string]: string }) {
  let router = useRouter();
  async function authHandler() {
    let res = await signIn(name, {
      redirect: true,
      callbackUrl: "/sign-in",
    });
    if (res?.ok) {
      router.push("/");
      router.refresh();
    }
  }
  return (
    <li onClick={authHandler} className='cursor-pointer'>
      <i className={icon + " bx bx-border-circle w-8 h-8 relative text-white hover:scale-105 transition-[transform] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 " + bg}></i>
    </li>
  );
}
