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
    <li onClick={authHandler} className='flex flex-col items-center cursor-pointer'>
      <i className={icon + " bx bx-border-circle text-white hover:scale-105 transition-[transform] " + bg}></i>
    </li>
  );
}
