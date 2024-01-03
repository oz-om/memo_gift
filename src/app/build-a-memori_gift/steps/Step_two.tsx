import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import Card_item, { ChoseCardButton, RemovePostCard } from "@/app/components/client/card_item";
import FriendlyMessageForm from "../../components/client/FriendlyMessageForm";

import Step_intro from "../components/Step_intro";

export default async function Step_two({ searchParams }: { searchParams: { cgid: string; catitmid: string } }) {
  let { cgid, catitmid } = searchParams;

  if (!catitmid || catitmid.trim().length == 0) {
    redirect("/build-a-memori_gift?step=one&cgid=" + cgid);
  }

  let postCards = await prisma.postCard.findMany();
  let cartItem = await prisma.cartItem.findUnique({
    where: {
      id: catitmid,
    },
    include: {
      postcard: true,
    },
  });

  if (!cartItem) {
    redirect("/build-a-memori_gift?step=one&cgid=" + cgid);
  }

  return (
    <section className='step_three_section'>
      <div className='container'>
        <Step_intro step='2' title='CHOOSE YOUR CARD' desc='Choose the perfect card for the occasion from our selection of exclusive designs. Our team handwrites each and every note to keep your gifts personal. (Plus, we have great handwriting.)' />
      </div>
      <section className='step_two_content'>
        <div className='container friendly_massage_wrapper px-3 mt-3 md:flex md:justify-center md:gap-x-5'>
          <figure className='max-w-xs mx-auto md:mx-0'>
            {cartItem?.postcard == null ? (
              <div className='w-60 h-full grid place-content-center border rounded'>
                <p className='text-center'>no chosed card</p>
              </div>
            ) : (
              <Image src={`${cartItem?.postcard?.image}`} alt={`${cartItem?.postcard?.name}`} width={400} height={350} />
            )}
            <div className='change_post_card'>
              <ChoseCardButton />
            </div>
          </figure>
          <FriendlyMessageForm called='customGift' productId={null} />
        </div>

        <dialog className='PostCardsModal fixed overflow-auto left-0 top-0 w-full h-full py-5 custom-scroll-bar overscroll-contain'>
          <div className='cards_wrapper'>
            <div className='container'>
              <div className='cards_list grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-10'>
                <RemovePostCard called='customGift' />
                {postCards.map((postcard) => {
                  return <Card_item key={postcard.id} id={postcard.id} called='customGift' image={postcard.image} name={postcard.name} />;
                })}
              </div>
            </div>
          </div>
        </dialog>
      </section>
    </section>
  );
}
