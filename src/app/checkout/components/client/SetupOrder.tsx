"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { toastStyles } from "@/utils";
import { useRouter } from "next/navigation";
import { T_Orders } from "../CheckoutList";
import { initOrder } from "../../actions/action";

export default function SetupOrder({ orders }: { orders: T_Orders }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function setupOrder() {
    let ordersId = orders.map((order) => order.cartItem.id);
    let alert = toast;
    alert.loading("just a second...", { style: toastStyles });
    setIsSubmitting(true);
    let res = await initOrder(ordersId);
    alert.remove();
    if (!res.success) {
      alert.error(res.error, { style: toastStyles });
      setIsSubmitting(false);
      return;
    }
    router.push("/checkout/payment");
    router.refresh();
  }
  return (
    <button disabled={isSubmitting} onClick={setupOrder} className={"uppercase px-8 py-2 text-teal-300 border border-teal-500 rounded-md  " + (isSubmitting ? "pointer-events-none bg-slate-500" : "bg-slate-800 hover:bg-slate-700")}>
      {isSubmitting ? "pleas wait..." : "complete order"}
    </button>
  );
}
