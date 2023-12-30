"use client";

import { toastStyles, toggleDialog } from "@/utils";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { setPostCard } from "../../actions";

type cardItemProps = {
  [key: string]: string;
};
export default function Card_item({ id, image, name, cartItemId }: cardItemProps) {
  async function ChoseCard() {
    let loading = toast;
    loading.loading(`just a second...`, {
      style: toastStyles,
    });
    let res = await setPostCard(cartItemId, id);
    loading.dismiss();
    toggleDialog("PostCardsModal");
    if (!res.success) {
      loading.error(`${res.error}`, {
        style: toastStyles,
      });
      return;
    }

    toast.success(`done!`, {
      style: toastStyles,
    });
  }
  return (
    <div onClick={ChoseCard} className='card cursor-pointer'>
      <figure>
        <Image src={image} alt={name} width={650} height={650} />
      </figure>
      <h4>{name}</h4>
    </div>
  );
}

export function ChoseCardButton() {
  return (
    <button onClick={() => toggleDialog("PostCardsModal")} className='w-40 py-2 text-center text-teal-400 mx-auto block cursor-pointer'>
      Chose PostCard
    </button>
  );
}

export function RemovePostCard({ cartItemId }: { cartItemId: string }) {
  async function removePostCard() {
    let loading = toast;
    loading.loading(`just a second...`, {
      style: toastStyles,
    });
    let res = await setPostCard(cartItemId, null);
    loading.dismiss();
    toggleDialog("PostCardsModal");
    if (!res.success) {
      loading.error(`${res.error}`, {
        style: toastStyles,
      });
      return;
    }
    toast.success(`done!`, {
      style: toastStyles,
    });
  }
  return (
    <div onClick={removePostCard} className='card grid place-content-center rounded border'>
      <h4>Without Card</h4>
    </div>
  );
}
