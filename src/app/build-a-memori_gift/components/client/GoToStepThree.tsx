"use client";
import { toastStyles } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { setCustomGiftIntoCartItem } from "../../actions";

export default function GoToStepThree({ className, pack, customGiftId }: { className: string; pack: string; customGiftId: string }) {
  const router = useRouter();

  let alert = toast;
  async function nextStepHandler() {
    alert.loading("just as second...", {
      style: toastStyles,
    });
    let res = await setCustomGiftIntoCartItem();
    alert.dismiss();
    if (!res.success) {
      alert.error(`${res.error}`, {
        style: toastStyles,
      });
      return;
    }

    router.push("?step=three&pack=" + pack + "&cgid=" + customGiftId + "&catitmid=" + res.cartItemId);
  }
  return (
    <button onClick={nextStepHandler} className={className}>
      Next Step
    </button>
  );
}
