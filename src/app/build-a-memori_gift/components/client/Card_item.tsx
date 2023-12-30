"use client";

import { toggleDialog } from "@/utils";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { setPostCard } from "../../actions";

type cardItemProps = {
  [key: string]: string;
};
export default function Card_item({ id, image, name, boxId }: cardItemProps) {
  async function ChoseCard() {
    let loading = toast;
    loading.loading(`just a second...`, {
      style: {
        padding: "2px",
        fontSize: "12px",
      },
    });
    let res = await setPostCard(boxId, id);
    loading.dismiss();
    toggleDialog("PostCardsModal");
    if (!res.success) {
      loading.error(`${res.error}`, {
        style: {
          padding: "2px",
          fontSize: "12px",
        },
      });
      return;
    }

    toast.success(`done!`, {
      style: {
        padding: "2px",
        fontSize: "12px",
      },
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

export function RemovePostCard({ boxId }: { boxId: string }) {
  async function removePostCard() {
    let loading = toast;
    loading.loading(`just a second...`, {
      style: {
        padding: "2px",
        fontSize: "12px",
      },
    });
    let res = await setPostCard(boxId, null);
    loading.dismiss();
    toggleDialog("PostCardsModal");
    if (!res.success) {
      loading.error(`${res.error}`, {
        style: {
          padding: "2px",
          fontSize: "12px",
        },
      });
      return;
    }
    toast.success(`done!`, {
      style: {
        padding: "2px",
        fontSize: "12px",
      },
    });
  }
  return (
    <div onClick={removePostCard} className='card grid place-content-center rounded border'>
      <h4>Without Card</h4>
    </div>
  );
}
