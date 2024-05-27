import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import React from "react";
import Chosed_Item from "./Chosed_Item";
import GoToStepTwo from "./client/GoToStepTwo";

export default async function ChosedItems({ customGiftId }: { customGiftId: string }) {
  let customGift = await prisma.customGift.findUnique({
    where: {
      id: customGiftId,
    },
    include: {
      includes: {
        include: {
          item: true,
        },
      },
    },
  });

  if (!customGift) {
    redirect("/");
  }

  let totalPrice = customGift.includes.reduce((acc, include) => {
    acc += include.item.price * include.quantity;
    return +acc.toFixed(2);
  }, 0);

  return (
    <>
      <div className='chosed_items custom-scroll-bar pb-20 sm:pb-0 sm:overflow-auto sm:mb-0'>
        {customGift?.includes.map(({ item, quantity, customGift_id }) => {
          let firstImage = JSON.parse(item.images)[0];
          let TotalPrice = +(item.price * quantity).toFixed(2);
          return <Chosed_Item key={item.id} id={item.id} customGiftId={customGift_id} image={`${firstImage}`} name={item.name} quantity={quantity} totalPrice={TotalPrice} />;
        })}
      </div>
      {customGift?.includes.length == 0 ? (
        <div className='empty h-60 grid place-content-center'>
          <p className='text-sm text-slate-400'>there is no chosed items yet</p>
        </div>
      ) : null}
      <div className='check_out_box fixed bottom-0  bg-teal-50 w-full flex justify-between p-2 mt-auto sm:relative'>
        <div className='price'>
          <span className='text-sm '>Total Price:</span>
          <span className='text-sm ml-2'>${totalPrice}</span>
        </div>
        <div className='next_step'>
          <GoToStepTwo customGiftId={customGift.id} className='bg-teal-400 text-white text-center px-4 py-2 rounded-md mx-auto min-w-max w-2/5 block' />
        </div>
      </div>
    </>
  );
}
