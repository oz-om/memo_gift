"use client";
import React, { useTransition } from "react";
import { toast } from "react-hot-toast";
import { controlQuantity } from "../../actions";

export function Increment({ itemId, boxId }: { itemId: string; boxId: string }) {
  const [pending, startTransition] = useTransition();
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
  return <div>{pending ? <i className='bx bx-loader bx-spin'></i> : <i onClick={() => startTransition(incrementQuantity)} className='bx bx-plus border grid place-content-center h-5 rounded-md font-bold cursor-pointer hover:border-slate-700'></i>}</div>;
}

export function Decrement({ itemId, boxId }: { itemId: string; boxId: string }) {
  const [pending, startTransition] = useTransition();
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
  return <div>{pending ? <i className='bx bx-loader bx-spin'></i> : <i onClick={() => startTransition(decrementQuantity)} className='bx bx-minus border grid place-content-center h-5 rounded-md font-bold cursor-pointer  hover:border-slate-700'></i>}</div>;
}
