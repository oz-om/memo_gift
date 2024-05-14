"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import createNewUser from "../action";
import getErrorMessage from "@/utils/getErrorMessage";
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

export async function signupHandler(formData: FormData) {
  let create = await createNewUser(formData);
  if (!create.create) {
    throw new Error(create.error);
  }
  try {
    await loginHandler(formData);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function loginHandler(formData: FormData) {
  const login = await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: false,
    callbackUrl: "/",
  });
  if (!login?.ok) {
    throw new Error(login?.error as string);
  }
}
