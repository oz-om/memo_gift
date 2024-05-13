// import { prisma } from "@/lib/db/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utils/nextAuthOptions";
// import { Prisma } from "@prisma/client";
// import { cookies } from "next/headers";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cart_item from "./Cart_item";
// import { useSession } from "next-auth/react";
import { T_cart, getCartContent } from "@/app/action";

export default function CartItems() {
  // let session = await getServerSession(authOptions);
  const [cart, setCart] = useState<T_cart>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    getCartContent().then((res) => {
      if (res.success) {
        setTotalPrice(res.totalPrice);
        setCart(res.cart);
      }
    });
  }, []);
  return (
    <>
      <div className='cart_items  overflow-y-auto h-[calc(100%_-_100px)] custom-scroll-bar overscroll-contain'>
        {cart.map(({ cartItem }) => {
          return <Cart_item key={cartItem.id} cartItem={cartItem} />;
        })}
        {!cart.length && (
          <div className='h-[50vh] grid place-content-center'>
            <p className='text-center text-slate-500'>empty</p>
          </div>
        )}
      </div>
      <div className='total_price_checkout absolute bottom-0 bg-sky-100 w-full flex justify-between p-2'>
        <div className='price'>
          <span className='text-xl'>Total Price:</span>
          <span className='text-xl ml-2'>${totalPrice}</span>
        </div>
        <div className='checkout'>
          <Link href={"/checkout"} className='text-xl text-slate-600 text-center border border-sky-500 py-1 px-2 rounded-md'>
            Checkout
          </Link>
        </div>
      </div>
    </>
  );
}
