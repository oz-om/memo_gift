import { prisma } from "@/lib/db/prisma";
import Card_item, { Collections_ChoseCardButton, RemovePostCard } from "@/app/components/client/card_item";
import Image from "next/image";
import React from "react";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import FriendlyMessageForm from "@/app/components/client/FriendlyMessageForm";
type TcartItem = Prisma.cartItemGetPayload<{
  include: {
    postcard: true;
  };
}> | null;
export default async function ChoseCardDialog({ productId, called }: { productId: string; called: "premade" | "item" }) {
  let postCards = await prisma.postCard.findMany();
  let cartItemId = cookies().get("cartItemId")?.value;
  let cartItem: TcartItem = null;
  if (cartItemId) {
    cartItem = await prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
      include: {
        postcard: true,
      },
    });
  }

  return (
    <dialog className='collections-cards-dialog'>
      <div className='collections-cards-dialog-error-message hidden fixed px-5 py-2 bg-red-50 text-red-400 text-sm font-semibold top-0 left-0 right-0 w-80 mx-auto z-20 rounded text-center border-red-200 shadow mt-2 '></div>
      <div className='content fixed left-0 right-0 top-0 bottom-0 border w-[95%] h-[95%] max-w-7xl z-10 m-auto px-5 pt-5 bg-slate-50 shadow-md rounded-md overflow-auto custom-scroll-bar overscroll-contain lg:flex gap-x-3'>
        <div className='from_to_form max-w-3xl flex flex-col mx-auto lg:basis-1/2'>
          <div className='part-one sm:flex gap-x-2 lg:flex-col xl:flex-row'>
            <figure className='w-3/4 max-w-60 mx-auto border rounded overflow-hidden flex flex-col'>
              {!cartItem || !cartItem.postcard ? (
                <div className=' w-full h-60 max-w-60 grid place-content-center border rounded'>
                  <p className='text-center'>no chosed card</p>
                </div>
              ) : (
                <Image src={`${cartItem.postcard.image}`} alt={`${cartItem.postcard.name}`} width={400} height={350} />
              )}
              <div className='change_post_card lg:hidden'>
                <Collections_ChoseCardButton />
              </div>
            </figure>
            <FriendlyMessageForm called={called} productId={productId} />
          </div>
        </div>
        <aside className='cards hidden absolute  w-full h-full bg-gray-50  top-0 left-0 border px-5 py-3 lg:-mt-3 rounded overflow-auto custom-scroll-bar overscroll-contain lg:block lg:basis-1/2 lg:relative'>
          <div className='cards_list relative grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))] gap-10 '>
            <div className='waiting-set-card-promise hidden absolute top-0 left-1/2 -translate-x-1/2 z-10'>
              <i className='bx bx-loader bx-spin text-teal-400'></i>
            </div>
            <RemovePostCard called='premade' />
            {postCards.map(({ id, image, name }) => {
              return <Card_item key={id} id={id} image={image} name={name} called='premade' />;
            })}
          </div>
        </aside>
      </div>
    </dialog>
  );
}
