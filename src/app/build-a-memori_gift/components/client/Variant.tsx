"use client";
import { toastStyles } from "@/utils";
import { Variant } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { setVariantAndAddCartItemToCart } from "../../actions";
import { useCartContent } from "@/app/components/cart/context/CartCtProvider";
import { getCartContent } from "@/app/components/cart/actions";

export default function Variants({ variant, cartItemId, customGiftId }: { variant: Variant; cartItemId: string; customGiftId: string }) {
  let router = useRouter();
  const { setCartContent } = useCartContent();

  async function completeTheCustomGift() {
    let alert = toast;
    alert.loading("just a second...", { style: toastStyles });
    try {
      let res = await setVariantAndAddCartItemToCart(customGiftId, cartItemId, variant.id);
      alert.remove();
      if (!res.success) {
        alert.error(`something went wrong during completing create operation`, {
          style: toastStyles,
        });
        return;
      }
      getCartContent()
        .then((cartContent) => {
          if (!cartContent.success) {
            alert.error(`${cartContent.error}`, { style: toastStyles });
            return;
          }
          setCartContent(cartContent.cart);
        })
        .catch(() => {
          alert.error(`can't update cart content`, { style: toastStyles });
        });

      router.push("?step=four");
    } catch (error) {
      alert.remove();
      alert.error(`something went wrong, please try agin!`, { style: toastStyles });
    }
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
