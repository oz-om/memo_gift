"use client";
import { useEffect, useState } from "react";
import { useSignalEffect } from "signals-react-safe";
import { premade, setPremadeInput } from "../../type/Premade_gift";

export default function Price() {
  let [includesPrice, setIncludesPrice] = useState<{ count: number; totalPrice: number }>({
    count: 0,
    totalPrice: 0,
  });
  console.log("rendering price");

  useSignalEffect(() => {
    if (premade.value.includes.length !== includesPrice.count) {
      let totalPrice = premade.value.includes.reduce((sum, nextItem) => sum + nextItem.price, 0);
      setIncludesPrice({
        count: premade.value.includes.length,
        totalPrice: totalPrice,
      });
    }
  });
  useEffect(() => {
    setPremadeInput("price", includesPrice.totalPrice);
  }, [includesPrice.totalPrice]);
  return (
    <div className='price flex items-center gap-x-2 ml-4 mt-2'>
      <input className='font-semibold w-14 border outline-none' readOnly value={includesPrice.totalPrice} />$<button className='text-xs text-teal-500'>edit</button>
    </div>
  );
}
