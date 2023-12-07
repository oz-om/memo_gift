import Image from "next/image";
import React from "react";

type chosedItemProps = {
  image: string;
  name: string;
  quantity: number;
  totalPrice: number;
};
export default function Chosed_Item({ image, name, quantity, totalPrice }: chosedItemProps) {
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
          <i className='bx bx-plus border grid place-content-center h-5 rounded-md font-bold cursor-pointer  hover:border-slate-700'></i>
          <span className='chosed_item_quantity text-center text-xl'>{quantity}</span>
          <i className='bx bx-minus border grid place-content-center h-5 rounded-md font-bold cursor-pointer hover:border-slate-700'></i>
        </div>
        <div className='chosed_item_total_price'>
          <span className='chosed_item_total_price text-xl font-bold text-teal-400 text-center'>{totalPrice}$</span>
        </div>
        <div className='chosed_item_rm justify-center gap-y-2'>
          <button className='delete_chosed_item text-sm bg-red-100 text-red-600 tracking-wider rounded-md py-1 px-2 border border-transparent hover:border-red-600'>delete</button>
        </div>
      </div>
    </div>
  );
}
