"use client";
import React from "react";
import { toast } from "react-hot-toast";
import { removeItem } from "../../actions";

export default function DeleteChosedItem({ itemId, boxId }: { itemId: string; boxId: string }) {
  async function removeChosedItem() {
    let res = await removeItem(itemId, boxId);
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
    <button onClick={removeChosedItem} className='delete_chosed_item text-sm bg-red-100 text-red-600 tracking-wider rounded-md py-1 px-2 border border-transparent hover:border-red-600'>
      delete
    </button>
  );
}
