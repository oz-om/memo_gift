"use client";
import { setAsRejected, setAsShipped } from "@/app/dashboard/_actions/controlOrder";
import { toastStyles } from "@/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";

export function SetAsShipped({ orderId }: { orderId: number }) {
  const [submitting, setSSubmitting] = useState(false);
  async function switchToShipped() {
    const alert = toast;
    alert.loading("Please wait...", { style: toastStyles });
    setSSubmitting(true);
    const switchRes = await setAsShipped(orderId);
    alert.remove();
    setSSubmitting(false);
    if (!switchRes.success) {
      alert.error("something went wrong!", { style: toastStyles });
    }
    alert.success("Success!", { style: toastStyles });
  }
  return (
    <div className='set_as_shipped'>
      <button disabled={submitting} onClick={switchToShipped} className={"shipped  px-2 py-1 rounded " + (submitting ? "bg-teal-200 pointer-events-none" : "bg-teal-400")}>
        convert to shipped
      </button>
    </div>
  );
}

export function SetAsRejected({ orderId }: { orderId: number }) {
  const [submitting, setSSubmitting] = useState(false);
  async function switchToRejected() {
    const alert = toast;
    alert.loading("Please wait...", { style: toastStyles });
    setSSubmitting(true);
    const switchRes = await setAsRejected(orderId);
    alert.remove();
    setSSubmitting(false);
    if (!switchRes.success) {
      alert.error("something went wrong!", { style: toastStyles });
    }
    alert.success("Success!", { style: toastStyles });
  }
  return (
    <div className='reject_order'>
      <button disabled={submitting} onClick={switchToRejected} className={"reject  px-2 py-1 rounded " + (submitting ? "bg-red-200 pointer-events-none" : "bg-red-400")}>
        reject order
      </button>
    </div>
  );
}
