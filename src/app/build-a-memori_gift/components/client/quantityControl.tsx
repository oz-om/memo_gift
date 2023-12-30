"use client";
import React from "react";
import { toast } from "react-hot-toast";
import { controlQuantity } from "../../actions";

export async function Increment({ itemId, boxId }: { itemId: string; boxId: string }) {
  async function incrementQuantity() {
    let res = await controlQuantity(boxId, itemId, "increment");
    if (!res.success) {
      toast.error(`${res.error}`, {
        style: {
          padding: "2px",
          fontSize: "12px",
        },
      });
    }
  }
  return <i onClick={incrementQuantity} className='bx bx-plus border grid place-content-center h-5 rounded-md font-bold cursor-pointer hover:border-slate-700'></i>;
}
export async function Decrement({ itemId, boxId }: { itemId: string; boxId: string }) {
  async function decrementQuantity() {
    let res = await controlQuantity(boxId, itemId, "decrement");
    if (!res.success) {
      toast.error(`${res.error}`, {
        style: {
          padding: "2px",
          fontSize: "12px",
        },
      });
    }
  }
  return <i onClick={decrementQuantity} className='bx bx-minus border grid place-content-center h-5 rounded-md font-bold cursor-pointer  hover:border-slate-700'></i>;
}
