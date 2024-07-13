import { formatDate } from "@/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";
type Order = Prisma.OrderGetPayload<{
  include: {
    product: {
      include: {
        orderedCustomGift: {
          include: {
            includes: {
              include: {
                item: true;
              };
            };
          };
        };
        premade: {
          include: {
            includes: {
              include: {
                item: true;
              };
            };
          };
        };
        item: true;
        variant: true;
      };
    };
  };
}>;

export default function Order({ order }: { order: Order }) {
  const { createdAt } = order.product;
  const { item, premade, orderedCustomGift, quantity } = order.product;
  const product = item ? item : premade ? premade : orderedCustomGift ? orderedCustomGift : null;
  let includes = premade?.includes ?? orderedCustomGift?.includes;
  return (
    <div className={"order_wrapper mb-5 rounded border " + (order.order_status == "shipped" ? "border-teal-300" : order.order_status == "rejected" && "border-red-300")}>
      <div className='order p-2 rounded border shadow flex flex-col gap-y-2 sm:flex-row sm:justify-around gap-x-5 xl:justify-around '>
        <div className='block_A flex gap-x-2 basis-3/4'>
          <div className='block_A_1 flex flex-col items-center md:flex-row basis-1/4'>
            <div className='order_id min-w-28'>
              <p className='tracking-wider text-lg'>#{order.id}</p>
              <p className='text-slate-500 text-sm'>{formatDate(`${createdAt}`)}</p>
            </div>
            <figure className='overflow-hidden size-40 md:size-24 rounded border p-2'>
              <Image className='rounded' src={item ? JSON.parse(item.images)[0] : order.product.variant?.preview} alt={`${product?.name}`} width={240} height={240} />
            </figure>
          </div>
          <div className='block_A_2 md:flex basis-3/4 gap-x-2'>
            <div className='block_A_2-1 basis-2/3 flex flex-col md:justify-around lg:flex-row lg:items-center gap-x-3'>
              <h3 className='tracking-wider basis-3/4x line-clamp-2'>
                {product?.name} {product?.name == null && "custom gift"}
              </h3>
              <p className='flex items-center gap-x-2 basis-1/4 whitespace-nowrap'>
                <span className='text-sm text-slate-700 '>type:</span> <span className='text-teal-400 bg-teal-50 border border-teal-200 rounded px-2'>{item ? "item" : premade ? "premade" : "custom-gift"}</span>
              </p>
            </div>
            <div className='block_A_2-2 basis-2/5x flex flex-col md:justify-evenly lg:flex-row lg:items-center gap-x-2'>
              <p className='whitespace-nowrap'>
                <span className='text-sm text-slate-700'>quantity:</span> <span className='text-teal-500 text-lg'>{quantity}</span>{" "}
              </p>
              <p className='whitespace-nowrap'>
                <span className='text-sm text-slate-700'>total:</span> <span className='text-lg text-teal-500'>{product!.price * quantity}$</span>
              </p>
            </div>
          </div>
        </div>
        <div className='block_B status flex justify-between sm:flex-col sm:justify-evenly lg:flex-row lg:items-center gap-x-10 basis-1/4'>
          <p className={"text-sm px-2  border rounded w-28 text-center " + (order.order_status == "pending" ? "border-orange-300 text-orange-500 bg-orange-100" : order.order_status == "shipped" ? "bg-teal-100 border-teal-300 text-teal-500" : "border-red-500 bg-red-100 text-red-500")}>{order.order_status}</p>
          <p className='order_status text-green-500 border border-green-300 px-2 flex items-center gap-x-1 rounded w-28 justify-center'>
            <span>{order.order_status == "rejected" ? "refunded" : "payed"}</span>
            <i className='bx bx-check-circle'></i>
          </p>
        </div>
      </div>
      <div className='order_address bg-slate-50'>
        <h3 className='text-lg uppercase px-2 font-light'>Address:</h3>
        <p className='text-xs text-zinc-800 font-light pl-2'> {order.product.address?.split("<*>").join(" ")}</p>
      </div>
      {(!!orderedCustomGift || !!premade) && (
        <button className='toggle_button w-full  justify-center relative bg-slate-100 border hidden'>
          <i className='bx bxs-chevron-down'></i>
        </button>
      )}
      {(!!orderedCustomGift || !!premade) && (
        <div className=' includes-wrapper rounded-b border  bg-slate-50 '>
          <h3 className='text-lg uppercase px-2 font-light'>includes:</h3>
          <div className='includes '>
            {includes?.map((include, i) => {
              let quantity = 1;
              if ("orderedCustomGift_id" in include) {
                quantity = include.quantity;
              }
              const { item } = include;
              return (
                <div key={i} className='include flex divide-y'>
                  <figure className='overflow-hidden size-20 rounded p-2 basis-20 shrink-0 '>
                    <Image src={JSON.parse(item.images)[0]} alt={item.name} className='rounded' width={240} height={240} />
                  </figure>
                  <div className='include_details  w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3  sm:items-center sm:justify-items-center'>
                    <h3 className='tracking-wider line-clamp-2 w-full'>{item.name}</h3>
                    <span>
                      <span className='text-slate-400 text-sm'>price:</span> <span className='text-lg'>{item.price}$</span>
                    </span>
                    <span>
                      <span className='text-slate-400 text-sm'>quantity:</span> <span className='text-lg'>{quantity}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
