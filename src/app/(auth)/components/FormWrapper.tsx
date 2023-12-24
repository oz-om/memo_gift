"use client";

import getErrorMessage from "@/utils/getErrorMessage";
import { revalidatePath } from "next/cache";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";

type formProps = {
  children: React.ReactNode;
  className?: string;
  action: (formData: FormData) => Promise<any>;
  type: "sign-up" | "sign-in";
};

export default function FormWrapper({ children, className, action, type }: formProps) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const router = useRouter();
  async function handelSubmit(formData: FormData) {
    try {
      await action(formData);
      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }
  return (
    <form action={handelSubmit} className={"px-4 " + className}>
      {errorMessage ? <p className='text-red-400 bg-red-100 text-center text-xs font-semibold px-1 py-2 rounded border border-red-300'>{errorMessage}</p> : null}
      {children}
    </form>
  );
}
