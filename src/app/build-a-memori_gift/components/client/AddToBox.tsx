"use client";

import React from "react";
import { toast } from "react-hot-toast";
import { addItemToBox } from "../../actions";

export default function AddToBox({ itemId }: { itemId: string }) {
  async function addToBox() {
    let res = await addItemToBox(itemId);
    if (!res.add) {
      toast.error(`${res.error}`, {
        style: {
          padding: "2px",
          fontSize: "12px",
        },
      });
      return;
    }
  }
  return (
    <div onClick={addToBox} className='add text-teal-500 border border-teal-400 px-2 text-xs gird place-content-center rounded-sm cursor-pointer'>
      add
    </div>
  );
}
