"use client";
import { toastStyles } from "@/utils";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-hot-toast";
import { controlCartItemQuantity, deleteAction, duplicate, editAction } from "../cart/actions";
import { useCartContent } from "../cart/context/CartCtProvider";

export function IncrementCartItemQuantity({ cartItemId }: { cartItemId: string }) {
  const [pending, startTransition] = useTransition();
  const { increment } = useCartContent();
  async function startIncrement() {
    let alert = toast;
    let res = await controlCartItemQuantity(cartItemId, "increment");
    if (!res.success) {
      alert.error(`${res.error}`, {
        style: toastStyles,
      });
    } else {
      increment(cartItemId);
    }
  }
  return <>{pending ? <i className='bx bx-loader bx-spin'></i> : <i onClick={() => startTransition(startIncrement)} className='bx bx-plus border grid place-content-center h-5 rounded-md font-bold cursor-pointer  hover:border-slate-700'></i>}</>;
}

export function DecrementCartItemQuantity({ cartItemId }: { cartItemId: string }) {
  const [pending, startTransition] = useTransition();
  const { decrement } = useCartContent();
  async function startDecrement() {
    let alert = toast;
    let res = await controlCartItemQuantity(cartItemId, "decrement");
    if (!res.success) {
      alert.error(`${res.error}`, {
        style: toastStyles,
      });
      return;
    }

    decrement(cartItemId);
  }
  return <>{pending ? <i className='bx bx-loader bx-spin'></i> : <i onClick={() => startTransition(startDecrement)} className='bx bx-minus border grid place-content-center h-5 rounded-md font-bold cursor-pointer hover:border-slate-700'></i>}</>;
}

export function DeleteCartItem({ cartItemId }: { cartItemId: string }) {
  const [pending, startTransition] = useTransition();
  const { deleteCartItem } = useCartContent();
  async function deleteCartItemAction() {
    deleteCartItem(cartItemId);
    let alert = toast;
    let res = await deleteAction(cartItemId);
    if (!res.delete) {
      alert.error("something went wrong during deleting this item", {
        style: toastStyles,
      });
    }
  }
  return (
    <button onClick={() => startTransition(deleteCartItemAction)} disabled={pending} className='delete px-4 grid place-content-center rounded-md text-red-400 cursor-pointer hover:bg-red-50 disabled:bg-red-100/25 disabled:text-red-800/25'>
      {pending ? <i className='bx bx-loader bx-spin w-11 text-center'></i> : <span>delete</span>}
    </button>
  );
}

export function EditCartItem({ cartItemId, targetProductType }: { cartItemId: string; targetProductType: "premade" | "customGift" }) {
  const [pending, startTransition] = useTransition();
  async function editCartItem() {
    let res = await editAction(cartItemId, targetProductType);
    if (!res.success) {
      toast.error(res.error, {
        style: toastStyles,
      });
      return;
    }
    redirect("/build-a-memori_gift?step=one&cgid=" + res.cgid);
  }
  return (
    <div onClick={() => startTransition(editCartItem)} className='edit px-4 grid place-content-center rounded-md border border-teal-400 text-teal-400 cursor-pointer hover:bg-teal-50'>
      {pending ? <i className='bx bx-loader bx-spin'></i> : <span>edit</span>}
    </div>
  );
}

export default function Duplicate({ cartItemId }: { cartItemId: string }) {
  const [pending, startTransition] = useTransition();
  const { duplicateCartItem } = useCartContent();
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
    duplicateCartItem(res.cartItem);
  }

  return (
    <div onClick={() => startTransition(duplicateAction)} className='duplicate px-4 grid place-content-center rounded-md border border-blue-400 text-blue-400 cursor-pointer hover:bg-blue-50'>
      {pending ? <i className='bx bx-loader bx-spin'></i> : <span>duplicate</span>}
    </div>
  );
}
