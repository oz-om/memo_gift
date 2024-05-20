import { formatDate } from "@/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";
type Order = Prisma.ConfirmedOrderGetPayload<{
  include: {
    order: {
      include: {
        product: {
          include: {
            customGift: true;
            premade: true;
            item: true;
            variant: true;
          };
        };
      };
    };
  };
}>;

export default function Order({ confirmed }: { confirmed: Order }) {
  const { order, createdAt } = confirmed;
  const { item, premade, customGift, quantity } = order.product;
  const product = item ? item : premade ? premade : customGift ? customGift : null;

  console.log(product?.name, product?.name?.trim().length);

  return (
    <div className='order p-2 mb-5 rounded border shadow flex flex-col gap-y-2 sm:flex-row sm:justify-around gap-x-5 xl:justify-around '>
      <div className='block_A flex gap-x-2 basis-3/4'>
        <div className='block_A_1 flex flex-col items-center md:flex-row basis-1/4'>
          <div className='order_id min-w-28'>
            <p className='tracking-wider text-lg'>#{confirmed.id}</p>
            <p className='text-slate-500 text-sm'>on: {formatDate(`${createdAt}`)}</p>
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
            <p className='flex items-center gap-x-2 basis-1/4'>
              <span className='text-sm text-slate-700 '>type:</span> <span className='text-teal-400 bg-teal-50 border border-teal-200 rounded px-2'>{item ? "item" : premade ? "premade" : "custom-gift"}</span>
            </p>
          </div>
          <div className='block_A_2-2 basis-2/5x flex flex-col md:justify-evenly lg:flex-row lg:items-center gap-x-2'>
            <p className=''>
              <span className='text-sm text-slate-700'>quantity:</span> <span className='text-teal-500 text-lg'>{quantity}</span>{" "}
            </p>
            <p className=''>
              <span className='text-sm text-slate-700'>total:</span> <span className='text-lg text-teal-500'>{product!.price * quantity}$</span>
            </p>
          </div>
        </div>
      </div>
      <div className='Block_B status flex justify-between sm:flex-col sm:justify-evenly lg:flex-row lg:items-center gap-x-10 basis-1/4'>
        <p className='text-sm px-2 bg-orange-100 border border-orange-300 text-orange-500 rounded w-28 text-center'>{order.order_status}</p>
        <p className='order_status text-green-500 border border-green-300 px-2 flex items-center gap-x-1 rounded w-28 justify-center'>
          <span>payed</span>
          <i className='bx bx-check-circle'></i>
        </p>
      </div>
    </div>
  );
}
