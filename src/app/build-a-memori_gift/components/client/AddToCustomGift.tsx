"use client";

import { toastStyles } from "@/utils";
import React from "react";
import { toast } from "react-hot-toast";
import { addItemToCustomGift } from "../../actions";

export default function AddToCustomGift({ itemId }: { itemId: string }) {
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
    <div onClick={addToCustomGift} className='add text-teal-500 border border-teal-400 px-2 text-xs gird place-content-center rounded-sm cursor-pointer'>
      add
    </div>
  );
}
