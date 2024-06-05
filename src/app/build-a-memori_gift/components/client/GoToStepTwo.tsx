"use client";
import { toastStyles } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { setCustomGiftIntoCartItem } from "../../actions";

export default function GoToStepTwo({ className, customGiftId }: { className: string; customGiftId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const params = useSearchParams();
  let alert = toast;
  const cartItemId = params.get("catitmid");
  async function nextStepHandler() {
    alert.loading("just as second...", {
      style: toastStyles,
    });
    setPending(true);
    try {
      let res = await setCustomGiftIntoCartItem(customGiftId, cartItemId);
      alert.remove();
      setPending(false);
      if (!res.success) {
        alert.error(`${res.error}`, { style: toastStyles });
        return;
      }
      router.push("?step=two&cgid=" + customGiftId + "&catitmid=" + res.cartItemId);
    } catch (error) {
      alert.remove();
      setPending(false);
      alert.error(`something went wrong, please try agin!`, { style: toastStyles });
    }
  }
  return (
    <button disabled={pending} onClick={nextStepHandler} className={className}>
      Next Step
    </button>
  );
}
