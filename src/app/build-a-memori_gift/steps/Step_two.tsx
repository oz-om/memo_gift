import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { ChoseCardButton } from "@/app/components/client/card_item";
import FriendlyMessageForm from "../../components/client/FriendlyMessageForm";

import Step_intro from "../components/Step_intro";
import PostCardsList from "../components/PostCardsList";
import LoadingSpin from "@/app/components/LoadingSpin";

export default async function Step_two({ searchParams }: { searchParams: { cgid: string; catitmid: string } }) {
  let { cgid, catitmid } = searchParams;

  if (!catitmid || catitmid.trim().length == 0) {
    redirect("/build-a-memori_gift?step=one&cgid=" + cgid);
  }
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
              <div className='w-60 h-full min-h-60 mx-auto grid place-content-center border rounded'>
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
          <div className='collections-cards-dialog-error-message hidden fixed px-5 py-2 bg-red-50 text-red-400 text-sm font-semibold top-0 left-0 right-0 w-80 mx-auto z-20 rounded text-center border-red-200 shadow mt-2 '></div>
          <div className='cards_wrapper relative'>
            <div className='waiting-set-card-promise hidden fixed top-5 left-1/2 -translate-x-1/2 z-10'>
              <i className='bx bx-loader bx-spin text-teal-400'></i>
            </div>
            <div className='container'>
              <Suspense fallback={<LoadingSpin />}>
                {/* @ts-ignore async component */}
                <PostCardsList />
              </Suspense>
            </div>
          </div>
        </dialog>
      </section>
    </section>
  );
}
