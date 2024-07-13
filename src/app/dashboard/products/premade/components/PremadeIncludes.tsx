import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
type T_Includes = Prisma.includesGetPayload<{
  include: {
    item: true;
  };
}>;
export default function PremadeIncludes({ includes }: { includes: T_Includes[] }) {
  return (
    <div className='p-2 rounded'>
      <h4 className='text-slate-600'>includes: </h4>
      <div className='includes flex gap-4 bg-white px-2 py-3 rounded-md shadow'>
        {includes.map((include) => {
          let quantity: number = 1;
          if ("orderedCustomGift_id" in include) {
            quantity = include.quantity;
          }
          return (
            <div key={include.item_id} className='item flex flex-col border rounded p-2 flex-1'>
              <figure className='item_image overflow-hidden rounded relative'>
                {quantity >= 1 && <span className='include_item_quantity absolute top-0 left-0 text-[10px] w-4 h-4 pt-[1px] grid place-content-center font-semibold border border-teal-50 bg-teal-500 text-teal-50 rounded-full '>{quantity}</span>}
                <Image src={`${JSON.parse(include.item!.images)[0]}`} alt={"item image"} width={220} height={220} className='aspect-square' />
              </figure>
              <div className='item_name text-sm'>{include.item?.name}</div>
              <div className='view mt-auto'>
                <Link href={"/dashboard/products/item/" + include.item_id} className='bg-blue-400 text-white rounded px-2 flex items-center w-fit'>
                  <span>view</span> <i className='bx bx-arrow-back bx-flip-horizontal'></i>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
