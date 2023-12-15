import { includeItemType } from "@/types/types";
import Image from "next/image";
import React from "react";
import { setPremadeInput } from "../../type/Premade_gift";

export default function Chosed_item({ id, images, name, price, includes }: includeItemType & { includes: includeItemType[] }) {
  function removeFromIncludesHandler() {
    let updatedIncludes = includes.filter((item) => item.id !== id);
    setPremadeInput("includes", updatedIncludes);
  }
  return (
    <div className='item rounded-md overflow-hidden shadow w-20 relative'>
      <figure>
        <Image src={"/images/" + images} alt={name} width={720} height={720} />
      </figure>
      <div className='item_details px-2 pb-2'>
        <h4 className='line-clamp-3 text-xs'>{name}</h4>
        <span className='font-sans text-xs'>{price}$</span>
      </div>
      <i onClick={removeFromIncludesHandler} className='bx bx-x mx-sm bx-border absolute top-0 right-0 bg-red-200 text-red-600 cursor-pointer'></i>
    </div>
  );
}
