"use client";

import { toastStyles } from "@/utils";
import React, { useTransition } from "react";
import { toast } from "react-hot-toast";
import { addItemToCustomGift } from "../../actions";

export default function AddToCustomGift({ className, itemId }: { className?: string; itemId: string }) {
  const [pending, startTransition] = useTransition();
  async function addToCustomGift() {
    let res = await addItemToCustomGift(itemId);
    if (!res.add) {
      toast.error(`${res.error}`, {
        style: toastStyles,
      });
      return;
    }
  }
  return (
    <button onClick={() => startTransition(addToCustomGift)} disabled={pending} className={className + " disabled:text-teal-800/25 disabled:border-teal-800/25"}>
      {pending ? <i className='bx bx-loader bx-spin'></i> : "add"}
    </button>
  );
}
