"use client";
import { signIn } from "next-auth/react";

export async function loginAction(formData: FormData) {
  let res = await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: false,
    callbackUrl: "/",
  });

  if (!res?.ok) {
    throw new Error(res?.error as string);
  }
}
