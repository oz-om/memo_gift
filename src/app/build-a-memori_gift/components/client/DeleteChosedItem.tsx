"use client";
import React, { useTransition } from "react";
import { toast } from "react-hot-toast";
import { removeItem } from "../../actions";

export default function DeleteChosedItem({ itemId, customGiftId }: { itemId: string; customGiftId: string }) {
  const [pending, startTransition] = useTransition();
  async function removeChosedItem() {
    let res = await removeItem(itemId, customGiftId);
    if (!res.deleted) {
      toast.error(`${res.error}`, {
        style: {
          padding: "2px",
          fontSize: "12px",
        },
      });
    }
  }
  return (
    <button onClick={() => startTransition(removeChosedItem)} className='delete_chosed_item text-sm bg-red-100 text-red-600 tracking-wider rounded-md py-1 px-2 border border-transparent hover:border-red-600'>
      {pending ? <i className='bx bx-loader bx-spin w-12'></i> : <span>delete</span>}
    </button>
  );
}
