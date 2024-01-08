"use client";
import { toastStyles } from "@/utils";
import React, { useTransition } from "react";
import { toast } from "react-hot-toast";
import { duplicate } from "../cart/actions";

export default function Duplicate({ cartItemId }: { cartItemId: string }) {
  const [pending, startTransition] = useTransition();
  async function duplicateAction() {
    let alert = toast;
    alert.loading("just a second...", {
      style: toastStyles,
    });
    let res = await duplicate(cartItemId);
    alert.remove();
    if (!res.success) {
      alert.error(res.error, {
        style: toastStyles,
      });
      return;
    }
  }
  return (
    <div onClick={() => startTransition(duplicateAction)} className='duplicate px-4 grid place-content-center rounded-md border border-blue-400 text-blue-400 cursor-pointer hover:bg-blue-50'>
      {pending ? <i className='bx bx-loader bx-spin'></i> : <span>duplicate</span>}
    </div>
  );
}
