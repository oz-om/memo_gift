import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Card_item, { ChoseCardButton, RemovePostCard } from "../components/client/Card_item";
import FriendlyMessageForm from "../components/client/friendlyMessageForm";
import Step_intro from "../components/Step_intro";

export default async function Step_three({ searchParams }: { searchParams: { id: string } }) {
  let { id } = searchParams;
  if (!id || id.trim().length == 0) {
    redirect("/build-a-memori_gift?step=one");
  }
  let customGift = await prisma.customGift.findUnique({
    where: {
      id: id,
    },
    select: {
      postCard: true,
    },
  });

  let postCards = await prisma.postCard.findMany();
  return (
    <section className='step_three_section'>
      <div className='container'>
        <Step_intro step='3' title='CHOOSE YOUR CARD' desc='Choose the perfect card for the occasion from our selection of exclusive designs. Our team handwrites each and every note to keep your gifts personal. (Plus, we have great handwriting.)' />
      </div>
      <section className='step_three_content'>
        <div className='container friendly_massage_wrapper px-3 mt-3 md:flex md:justify-center md:gap-x-5'>
          <figure className='max-w-xs mx-auto md:mx-0'>
            {customGift?.postCard == null ? (
              <div className='w-60 h-full grid place-content-center border rounded'>
                <p className='text-center'>no chosed card</p>
              </div>
            ) : (
              <Image src={`${customGift?.postCard?.image}`} alt={`${customGift?.postCard?.name}`} width={400} height={350} />
            )}
            <div className='change_post_card'>
              <ChoseCardButton />
            </div>
          </figure>
          <FriendlyMessageForm boxId={id} />
        </div>

        <dialog className='PostCardsModal fixed overflow-auto left-0 top-0 w-full h-full py-5 custom-scroll-bar overscroll-contain'>
          <div className='cards_wrapper'>
            <div className='container'>
              <div className='cards grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-10'>
                <RemovePostCard boxId={id} />
                {postCards.map((postcard) => {
                  return <Card_item key={postcard.id} id={postcard.id} boxId={id} image={postcard.image} name={postcard.name} />;
                })}
                {/* <Card_item image={"/images/card_item_01.png"} name={"Postcard  | Congrats Sparkle"} />
                <Card_item image={"/images/card_item_02.png"} name={"Postcard  | Bon Anniversaire"} />
                <Card_item image={"/images/card_item_03.png"} name={"Postcard  | Merci Green"} />
                <Card_item image={"/images/card_item_04.png"} name={"Postcard  | Happy Holidays Red"} />
                <Card_item image={"/images/card_item_05.png"} name={"Postcard  | Just Say Yes"} />
                <Card_item image={"/images/card_item_06.png"} name={"Postcard  | Dude"} />
                <Card_item image={"/images/card_item_08.png"} name={"Postcard  | Blank"} />
                <Card_item image={"/images/card_item_09.png"} name={"Postcard  | Be My Bridesmaid"} />
                <Card_item image={"/images/card_item_10.png"} name={"Postcard  | Be My Maid of Honor"} />
                <Card_item image={"/images/card_item_11.png"} name={"Postcard  | Cheers Espresso Martini"} />
                <Card_item image={"/images/card_item_12.png"} name={"Postcard  | Bon Anniversaire"} />
                <Card_item image={"/images/card_item_13.png"} name={"Postcard  | Get Well Soon"} /> */}
              </div>
            </div>
          </div>
        </dialog>
      </section>
    </section>
  );
}
