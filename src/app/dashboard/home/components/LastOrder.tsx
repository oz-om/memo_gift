import { timeDetails } from "@/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
export type T_Order = Prisma.OrderGetPayload<{
  include: {
    product: {
      include: {
        item: true;
        premade: {
          include: {
            includes: true;
          };
        };
        orderedCustomGift: {
          include: {
            includes: true;
          };
        };
        variant: true;
      };
    };
  };
}>;
export default function LastOrder({ order }: { order: T_Order }) {
  let product = order.product;
  let targetProduct = product.premade ?? product.orderedCustomGift ?? product.item;
  let productType = product.premade ? "premade" : product.orderedCustomGift ? "customGift" : "item";
  let isCustomGift = !!product.orderedCustomGift;
  const { hours, minutes, day, dayOfMonth, monthNumber, year } = timeDetails(order.createdAt);

  let withIncludes = product.premade ?? product.orderedCustomGift;
  return (
    <div className={"order sm:flex gap-x-3  mb-3 rounded px-2 py-1 border  " + (order.order_status === "shipped" ? "opacity-55 odd:bg-blue-50" : order.order_status === "rejected" ? "bg-red-50" : "odd:bg-blue-50")}>
      <div className='order_main_details flex gap-x-3 basis-2/5'>
        <figure className='bg-white border w-24 h-24 rounded relative overflow-hidden'>
          {product.quantity >= 1 && <span className='include_item_quantity absolute top-0 left-0 text-[10px] w-4 h-4 pt-[1px] grid place-content-center font-semibold border border-teal-50 bg-teal-500 text-teal-50 rounded-full '>{product.quantity}</span>}
          <Image src={!!withIncludes ? product.variant?.preview : JSON.parse(product.item!.images)[0]} alt={"order-cover"} width={100} height={100} />
        </figure>
        <div className='name'>
          <h4>{isCustomGift ? "custom gift" : targetProduct?.name}</h4>
          <p className='text-slate-400 text-xs flex flex-col'>
            <span>
              {day} at {hours}:{minutes}
            </span>
            <span>
              {dayOfMonth} - {monthNumber} - {year}
            </span>
          </p>
        </div>
      </div>
      <div className='order_extra_details flex gap-x-3 justify-around grow basis-3/5'>
        <div className='order_type flex-1'>
          <p className='mb-2'>type</p>
          <span className={"p-1 rounded text-white text-center text-xs " + (productType == "premade" ? "bg-teal-400" : productType == "customGift" ? "bg-blue-400" : "bg-orange-400")}>{productType}</span>
        </div>
        <div className='includes_count flex-1 flex flex-col items-center'>
          <p className='mb-2'>includes</p>
          <span className='text-center block'>{withIncludes ? withIncludes.includes.length : "single"}</span>
        </div>
        <div className='price text flex-1 flex flex-col items-center'>
          <p className='mb-2'>price</p>
          <span className='text-center block'>{(targetProduct!.price * product.quantity).toFixed(2)}$</span>
        </div>
        <div className='go_to flex flex-1 gap-x-2 items-center justify-center '>
          <Link href={"/dashboard/orders/" + order.id} className='px-2 py-1 rounded bg-violet-500 text-white text-xs cursor-pointer'>
            manage
          </Link>
          <div className='order_status text-2xl'>{order.order_status === "pending" ? <i title='pending' className='bx bxs-time-five text-orange-400'></i> : order.order_status === "shipped" ? <i title='shipped' className='bx bxs-check-circle text-teal-400'></i> : <i title='rejected' className='bx bxs-error text-red-400'></i>}</div>
        </div>
      </div>
    </div>
  );
}
