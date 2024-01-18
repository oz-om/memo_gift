"use client";
import { toastStyles } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { setCustomGiftIntoCartItem } from "../../actions";

export default function GoToStepTwo({ className, customGiftId, customGiftPrice }: { className: string; customGiftId: string; customGiftPrice: number }) {
  const router = useRouter();

  let alert = toast;
  async function nextStepHandler() {
    alert.loading("just as second...", {
      style: toastStyles,
    });

    let res = await setCustomGiftIntoCartItem(customGiftId, customGiftPrice);
    alert.dismiss();
    if (!res.success) {
      alert.error(`${res.error}`, {
        style: toastStyles,
      });
      return;
    }

    router.push("?step=two&cgid=" + customGiftId + "&catitmid=" + res.cartItemId);
  }
  return (
    <button onClick={nextStepHandler} className={className}>
      Next Step
    </button>
  );
}
