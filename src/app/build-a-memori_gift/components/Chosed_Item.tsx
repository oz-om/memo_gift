import Image from "next/image";
import React from "react";
import DeleteChosedItem, { Decrement, Increment } from "./client/quantityControl";

type chosedItemProps = {
  id: string;
  customGiftId: string;
  image: string;
  name: string;
  quantity: number;
  totalPrice: number;
};
export default function Chosed_Item({ id, image, name, quantity, totalPrice, customGiftId }: chosedItemProps) {
  return (
    <div className='chosed_item gap-x-3 py-2 px-4 odd:bg-white odd:my-4'>
      <div className='chosed_item_info flex gap-x-2'>
        <figure className='chosed_item_img border rounded-md flex-[1] '>
          <Image src={image} alt={name} width={713} height={556} />
        </figure>
        <h4 className='chosed_item_name tracking-widest line-clamp-3 flex-[2]  capitalize text-2xl sm:text-base'>{name}</h4>
      </div>
      <div className='chosed_item_details flex justify-evenly sm:justify-between'>
        <div className='chosed_item_quantity flex items-center gap-x-3'>
          {quantity >= 2 && <Decrement itemId={id} customGiftId={customGiftId} />}
          <span className='chosed_item_quantity text-center text-xl'>{quantity}</span>
          <Increment itemId={id} customGiftId={customGiftId} />
        </div>
        <div className='chosed_item_total_price'>
          <span className='chosed_item_total_price text-xl font-bold text-teal-400 text-center'>{totalPrice}$</span>
        </div>
        <div className='chosed_item_rm justify-center gap-y-2'>
          <DeleteChosedItem itemId={id} customGiftId={customGiftId} />
        </div>
      </div>
    </div>
  );
}
