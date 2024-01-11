"use client";
import React, { useTransition } from "react";
import { toast } from "react-hot-toast";
import { chosedItemControlQuantity, removeItem } from "../../actions";

export function Increment({ itemId, customGiftId }: { itemId: string; customGiftId: string }) {
  const [pending, startTransition] = useTransition();
  async function incrementQuantity() {
    let res = await chosedItemControlQuantity(customGiftId, itemId, "increment");
    if (!res.success) {
      toast.error(`${res.error}`, {
        style: {
          padding: "2px",
          fontSize: "12px",
        },
      });
    }
  }
  return <div>{pending ? <i className='bx bx-loader bx-spin text-teal-800/25'></i> : <i onClick={() => startTransition(incrementQuantity)} className='bx bx-plus border grid place-content-center h-5 rounded-md font-bold cursor-pointer hover:border-slate-700'></i>}</div>;
}

export function Decrement({ itemId, customGiftId }: { itemId: string; customGiftId: string }) {
  const [pending, startTransition] = useTransition();
  async function decrementQuantity() {
    let res = await chosedItemControlQuantity(customGiftId, itemId, "decrement");
    if (!res.success) {
      toast.error(`${res.error}`, {
        style: {
          padding: "2px",
          fontSize: "12px",
        },
      });
    }
  }
  return <div>{pending ? <i className='bx bx-loader bx-spin text-teal-800/25'></i> : <i onClick={() => startTransition(decrementQuantity)} className='bx bx-minus border grid place-content-center h-5 rounded-md font-bold cursor-pointer  hover:border-slate-700'></i>}</div>;
}

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
    <button onClick={() => startTransition(removeChosedItem)} disabled={pending} className='delete_chosed_item text-sm bg-red-100 text-red-600 tracking-wider rounded-md py-1 px-2 border border-transparent hover:border-red-600 overflow-hidden disabled:bg-red-600/25 disabled:text-red-100 disabled:border-transparent'>
      {pending ? <i className='bx bx-loader bx-spin w-12'></i> : <span>delete</span>}
    </button>
  );
}
