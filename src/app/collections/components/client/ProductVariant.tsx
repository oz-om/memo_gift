"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductVariant({ variantId, value }: { variantId: string; value: string }) {
  let params = useSearchParams();
  let router = useRouter();
  let currentVariant = params.get("v");

  function addVariantToCartItem() {
    router.push("?v=" + variantId);
  }
  return <li onClick={addVariantToCartItem} className={(currentVariant == variantId && "ring-1 ring-offset-1 ring-teal-400") + " min-h-[20px] cursor-pointer px-3 py-1 rounded-md border "} style={{ backgroundColor: value }}></li>;
}
