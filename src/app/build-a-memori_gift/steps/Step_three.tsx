import Image from "next/image";
import Link from "next/link";
import React from "react";
import Card_item, { ChoseCardButton } from "../components/client/Card_item";
import Step_intro from "../components/Step_intro";

export default function Step_three() {
  return (
    <section className='step_three_section'>
      <div className='container'>
        <Step_intro step='3' title='CHOOSE YOUR CARD' desc='Choose the perfect card for the occasion from our selection of exclusive designs. Our team handwrites each and every note to keep your gifts personal. (Plus, we have great handwriting.)' />
      </div>
      <section className='step_three_content'>
        <div className='container friendly_massage_wrapper px-3 mt-3 md:flex md:justify-center md:gap-x-5'>
          <figure className='max-w-xs mx-auto md:mx-0'>
            <Image src={"/images/card_item_01.png"} alt='' width={650} height={650} />
            <div className='change_post_card'>
              <ChoseCardButton />
            </div>
          </figure>
          <div className='from_to_form max-w-lg flex flex-col mx-auto md:mx-0'>
            <div className='inputs grid grid-cols-2 gap-10'>
              <div className='to_input'>
                <label htmlFor='to'>to</label>
                <input type='text' id='to' placeholder='to' className='w-full px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light' />
              </div>
              <div className='form_input'>
                <label htmlFor='from'>from</label>
                <input type='text' id='from' placeholder='from' className='w-full px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light' />
              </div>
              <div className='massage col-span-2'>
                <textarea name='massage' id='massage' placeholder='friendly message' className='w-full resize-none px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light'></textarea>
              </div>
            </div>
            <div className='other_options'>
              <div className='opt'>
                <input type='checkbox' id='blank-card' />
                <label htmlFor='blank-card'>Leave card intentionally blank and we&apos;ll tuck the card in the bow for you to do what you need</label>
              </div>
              <div className='opt'>
                <input type='checkbox' id='no-card' />
                <label htmlFor='no-card'>No card needed! Just a to/from is fine!</label>
              </div>
            </div>
            <div className='complete_box flex justify-center items-center gap-x-5 mt-5 md:mt-auto'>
              <Link href={"?step=four"} className='add_to_cart py-1 px-3 border border-teal-400 text-teal-400 rounded'>
                add to cart
              </Link>
              <Link href={"/checkout"} className='checkout py-1 px-3 border bg-teal-400 text-white rounded'>
                checkout
              </Link>
            </div>
          </div>
        </div>

        <dialog className='fixed overflow-auto left-0 top-0 w-full h-full py-5 custom-scroll-bar'>
          <div className='cards_wrapper'>
            <div className='container'>
              <div className='cards grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-10'>
                <div className='card grid place-content-center rounded border'>
                  <h4>Without Card</h4>
                </div>
                <Card_item image={"/images/card_item_01.png"} name={"Postcard  | Congrats Sparkle"} />
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
                <Card_item image={"/images/card_item_13.png"} name={"Postcard  | Get Well Soon"} />
              </div>
            </div>
          </div>
        </dialog>
      </section>
    </section>
  );
}
