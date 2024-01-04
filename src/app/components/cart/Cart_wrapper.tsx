import Cart_item from "./Cart_item";
import Link from "next/link";
import { Close_cart } from "../client/Navbar";
import CartItems from "./CartItems";
import { Suspense } from "react";
import LoadingSpin from "../LoadingSpin";

export default function Cart_wrapper() {
  return (
    <div className='cart_content fixed top-0 bottom-0 z-10 bg-slate-50 text-black max-w-sm w-full -right-[100vw] transition-[right]'>
      <div className='cart_head flex items-center border-b '>
        <Close_cart />
        <h4 className='tracking-widest text-3xl text-slate-600 text-center mx-auto'>
          <span className='text-teal-400 inline-flex items-center'>
            <lord-icon src='https://cdn.lordicon.com/pgmktfgp.json' style={{ width: "40px", height: "40px" }} trigger='hover' colors='primary:#9cf4df,secondary:#848484'></lord-icon>
            <span>Your Cart</span>
          </span>
        </h4>
      </div>
      <div className='cart_content_wrapper'>
        <Suspense fallback={<LoadingSpin />}>
          {/* @ts-ignore */}
          <CartItems />
        </Suspense>
      </div>
    </div>
  );
}
