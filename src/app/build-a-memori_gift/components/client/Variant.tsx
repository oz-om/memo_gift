"use client";
import { toastStyles } from "@/utils";
import { Variant } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { setVariantAndAddCartItemToCart } from "../../actions";

export default function Variants({ variant, cartItemId }: { variant: Variant; cartItemId: string }) {
  let router = useRouter();
  async function completeTheCustomGift() {
    let alert = toast;
    alert.loading("just a second...", {
      style: {
        backgroundColor: "#ddf3f3",
        ...toastStyles,
      },
    });
    let res = await setVariantAndAddCartItemToCart(cartItemId, variant.id);
    alert.dismiss();
    if (!res.success) {
      alert.error(`something went wrong during completing create operation`, {
        style: toastStyles,
      });
      return;
    }
    router.push("?step=four");
  }
  return (
    <button onClick={completeTheCustomGift}>
      <figure className='cursor-pointer'>
        <Image src={`${variant.preview}`} alt={variant.name} width={350} height={280} />
        <figcaption className='text-center'>{variant.name}</figcaption>
      </figure>
    </button>
  );
}
