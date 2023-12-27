import { Item } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { OpenPreview } from "./client/Buttons";
import Quick_view from "./Quick_view";

export default function Product_item({ item }: { item: Item }) {
  let { id, name, images, price } = item;
  let firstImage = JSON.parse(images)[0];
  return (
    <div className='item shadow-sm relative group/prodItem'>
      <figure className='relative overflow-hidden'>
        <Image src={firstImage} alt='FELLOW CARTER MOVE MUG 12OZ | CORDUROY RED' width={616} height={616} />
        <div className='on_hover_options absolute -bottom-5 w-full bg-teal-500/10 flex justify-evenly h-5  group-hover/prodItem:bottom-0 transition-[bottom]'>
          <OpenPreview id={id} />
          <div className='add_to'>
            <div className='add text-teal-500 border border-teal-400 px-2 text-xs gird place-content-center rounded-sm cursor-pointer'>add</div>
            <div className='add_controls justify-center w-12 h-full mx-auto hidden'>
              <span className='increment basis-1/4 min-w-[20px] grid place-content-center text-xl bg-slate-200 border border-slate-400 rounded-l-md cursor-pointer'>+</span>
              <span className='count basis-3/5 min-w-[20px] bg-white grid place-content-center'>1</span>
              <span className='decrement basis-1/4 min-w-[20px] grid place-content-center text-xl bg-slate-200 border border-slate-400 rounded-r-md cursor-pointer'>-</span>
            </div>
          </div>
        </div>
      </figure>
      <div className='item_details'>
        <h4 className='text-sm'>{name}</h4>
        <span className='font-sans'>{price}$</span>
      </div>
      <div className='added_count absolute top-0 left-0 w-4 h-4 rounded-lg bg-teal-500 text-white leading-4 text-center hidden'>
        <span>1</span>
      </div>
      <Quick_view item={item} />
    </div>
  );
}
