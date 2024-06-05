"use client";

import { toastStyles } from "@/utils";
import React, { useTransition } from "react";
import { toast } from "react-hot-toast";
import { addItemToCustomGift } from "../../actions";
import { useSearchParams } from "next/navigation";

export default function AddToCustomGift({ className, itemId }: { className?: string; itemId: string }) {
  const params = useSearchParams();
  const customGiftId = params.get("cgid");
  const [pending, startTransition] = useTransition();
  async function addToCustomGift() {
    let res = await addItemToCustomGift(itemId, customGiftId);
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
