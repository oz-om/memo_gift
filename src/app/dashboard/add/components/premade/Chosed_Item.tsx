import { includeItemType } from "@/types/types";
import Image from "next/image";
import React, { useState } from "react";
import { setPremadeInput } from "../../type/Premade_gift";

export default function Chosed_item({ id, images, name, price, includes, quantity }: includeItemType & { includes: includeItemType[] }) {
  function removeFromIncludesHandler() {
    let updatedIncludes = includes.filter((item) => item.id !== id);
    setPremadeInput("includes", updatedIncludes);
  }
  function quantityControl(type: "increment" | "decrement") {
    const targetIncluded = includes.find((item) => item.id == id);

    if (targetIncluded) {
      if (type == "decrement" && targetIncluded.quantity == 1) return;
      const updatedItem = {
        ...targetIncluded,
        quantity: type == "increment" ? (quantity += 1) : (quantity -= 1),
      };
      const updatedIncludes = includes.map((item) => (item.id == targetIncluded.id ? updatedItem : item));
      setPremadeInput("includes", updatedIncludes);
    }
  }

  return (
    <div className='item rounded-md overflow-hidden shadow w-20 relative'>
      <figure>
        <Image src={images} alt={name} width={720} height={720} />
      </figure>
      <div className='item_details px-2 pb-2'>
        <h4 className='line-clamp-3 text-xs'>{name}</h4>
        <span className='font-sans text-xs'>{price}$</span>
      </div>
      <i onClick={removeFromIncludesHandler} className='bx bx-x mx-sm bx-border absolute top-0 right-0 bg-red-200 text-red-600 cursor-pointer'></i>
      <div className='quantity_control grid place-content-center'>
        <div className='chosed_item_quantity flex items-center gap-x-3'>
          <div>
            <i onClick={() => quantityControl("decrement")} className='bx bx-minus border grid place-content-center h-5 rounded-md font-bold cursor-pointer  hover:border-slate-700'></i>
          </div>
          <span className='chosed_item_quantity text-center text-xl'>{quantity}</span>
          <div>
            <i onClick={() => quantityControl("increment")} className='bx bx-plus border grid place-content-center h-5 rounded-md font-bold cursor-pointer hover:border-slate-700'></i>
          </div>
        </div>
      </div>
    </div>
  );
}
