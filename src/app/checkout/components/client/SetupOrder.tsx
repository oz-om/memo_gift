"use client";
import Link from "next/link";
import React from "react";
import { toast } from "react-hot-toast";
import { toastStyles } from "@/utils";
import { useRouter } from "next/navigation";
import { T_Orders } from "../CheckoutList";
import { initOrder } from "../../actions/action";

export default function SetupOrder({ orders }: { orders: T_Orders }) {
  const router = useRouter();
  async function setupOrder(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    let ordersId = orders.map((order) => order.cartItem.id);
    let alert = toast;
    alert.loading("just a second...", { style: toastStyles });
    let res = await initOrder(ordersId);
    alert.remove();
    if (!res.success) {
      alert.error(res.error, { style: toastStyles });
      return;
    }
    router.push("/");
    router.refresh();
  }
  return (
    <Link onClick={setupOrder} href={"/checkout/shipping"}>
      <button className='uppercase px-8 py-2 text-teal-300 bg-slate-800 border border-teal-500 rounded-md hover:bg-slate-700'>complete order</button>
    </Link>
  );
}
