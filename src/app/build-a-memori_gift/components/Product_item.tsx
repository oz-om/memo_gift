import Image from "next/image";
import React from "react";
import AddToCustomGift from "./client/AddToCustomGift";
import { OpenPreview } from "./client/Buttons";
import Quick_view from "./Quick_view";
import { item } from "../actions";
import { formatCurrency } from "@/utils";

export default function Product_item({ item }: { item: item }) {
  let { id, name, images, price } = item;
  let firstImage = JSON.parse(images)[0];
  return (
    <div className='item shadow-sm max-w-xs relative group/prodItem'>
      <figure className='relative overflow-hidden'>
        <Image src={firstImage} alt='FELLOW CARTER MOVE MUG 12OZ | CORDUROY RED' width={616} height={616} className='aspect-square' />
        <div className='on_hover_options absolute -bottom-6 w-full bg-teal-500/10 flex justify-evenly py-1  group-hover/prodItem:bottom-0 transition-[bottom]'>
          <OpenPreview id={id} />
          <AddToCustomGift itemId={id} className='add text-teal-500 border border-teal-400 px-2 text-xs gird place-content-center rounded-sm cursor-pointer' />
        </div>
      </figure>
      <div className='item_details'>
        <h4 className='text-sm'>{name}</h4>
        <span className='font-sans'>{formatCurrency(price)}</span>
      </div>
      <div className='added_count absolute top-0 left-0 w-4 h-4 rounded-lg bg-teal-500 text-white leading-4 text-center hidden'>
        <span>1</span>
      </div>
      <Quick_view item={item} />
    </div>
  );
}
