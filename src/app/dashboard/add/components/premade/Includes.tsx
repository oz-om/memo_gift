"use client";
import React, { useState } from "react";
import { useSignalEffect } from "signals-react-safe";
import { premade } from "../../type/Premade_gift";
import Item from "../Item";

export default function Includes() {
  console.log("rerender includes");

  let [oldVersionOfIncludes, setOldVersionOfIncludes] = useState(premade.value.includes);
  useSignalEffect(() => {
    if (premade.value.includes.length !== oldVersionOfIncludes.length || JSON.stringify(premade.value.includes) !== JSON.stringify(oldVersionOfIncludes)) {
      setOldVersionOfIncludes(premade.value.includes); // just for rerendering to get last includes
    }
  });

  return (
    <div className='includes_content  px-4'>
      <div className='includes grid gap-5 grid-cols-2 min-[350px]:grid-cols-3 min-[530px]:grid-cols-4 min-[950px]:grid-cols-5 lg:grid-cols-7'>
        {premade.value.includes.map(({ id, name, price, images, quantity }) => {
          return (
            <div className='relative' key={id}>
              <Item id={id} name={name} price={price} images={images} />
              <span className='quantity absolute top-0 right-0  px-[6px] py-px bg-teal-400 text-slate-50 text-xs rounded-full'>{quantity}</span>
            </div>
          );
        })}
      </div>
      {premade.value.includes.length == 0 && <p className='text-slate-400 text-center text-xs py-2 border rounded-md mb-2'>there is no items added yet</p>}
    </div>
  );
}
