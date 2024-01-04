"use client";

import { setPostCardIntoCartItem } from "@/app/build-a-memori_gift/actions";
import { toastStyles, toggleDialog } from "@/utils";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { showErrorMessage } from "./FriendlyMessageForm";

type cardItemProps = {
  [key: string]: string;
};
function setACtiveCardStyle(card: EventTarget & HTMLDivElement) {
  let allCards = document.querySelectorAll(".cards_list .card_item");
  allCards.forEach((cardEle) => {
    cardEle.classList.remove("chosed-card-item");
  });
  card.classList.add("chosed-card-item");
}
export default function Card_item({ id, image, name, called }: cardItemProps) {
  async function ChoseCard(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setACtiveCardStyle(e.currentTarget);
    // cause the toast can't display over dialog se we set custom loader
    document.querySelector(".waiting-set-card-promise")?.classList.toggle("hidden");

    let loading = toast;
    loading.loading(`just a second...`, {
      style: toastStyles,
    });
    let res = await setPostCardIntoCartItem(id);
    loading.dismiss();
    if (called == "customGift") {
      toggleDialog("PostCardsModal");
    } else {
      toggleCardsList("hidden", "block");
    }
    document.querySelector(".waiting-set-card-promise")?.classList.toggle("hidden");

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
    <div onClick={ChoseCard} className='card_item cursor-pointer border-2 rounded overflow-hidden'>
      <figure>
        <Image src={image} alt={name} width={650} height={650} />
      </figure>
      <h4 className='px-3'>{name}</h4>
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
function toggleCardsList(o: string, x: string) {
  document.querySelector(".collections-cards-dialog .cards")?.classList.remove(x);
  document.querySelector(".collections-cards-dialog .cards")?.classList.add(o);
}
export function Collections_ChoseCardButton() {
  function openCardList() {
    toggleCardsList("block", "hidden");
  }
  return (
    <button onClick={openCardList} className='w-40 py-2 text-center text-teal-400 mx-auto block cursor-pointer'>
      Chose PostCard
    </button>
  );
}
export function RemovePostCard({ called }: { called: "customGift" | "premade" | "item" }) {
  async function removePostCard(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setACtiveCardStyle(e.currentTarget);
    // cause the toast can't display over dialog se we set custom loader
    document.querySelector(".waiting-set-card-promise")?.classList.toggle("hidden");

    let loading = toast;
    loading.loading(`just a second...`, {
      style: toastStyles,
    });
    let res = await setPostCardIntoCartItem(null);
    loading.dismiss();
    // if card item is called in create custom gift process we open card list dialog cause we don't hav it in premade & item
    if (called == "customGift") {
      toggleDialog("PostCardsModal");
    } else {
      toggleCardsList("hidden", "block");
    }
    document.querySelector(".waiting-set-card-promise")?.classList.toggle("hidden");
    if (!res.success) {
      loading.error(`${res.error}`, {
        style: toastStyles,
      });
      called !== "customGift" && showErrorMessage(`${res.error}`);
      return;
    }
    toast.success(`done!`, {
      style: toastStyles,
    });
  }
  return (
    <div onClick={removePostCard} className='card_item grid place-content-center rounded border-2 chosed-card-item cursor-pointer '>
      <h4>Without Card</h4>
    </div>
  );
}
