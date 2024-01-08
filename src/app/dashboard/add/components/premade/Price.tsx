"use client";
import { useEffect, useRef, useState } from "react";
import { signal, useSignalEffect } from "signals-react-safe";
import { premade, setPremadeInput } from "../../type/Premade_gift";
let price = signal(0);
export default function Price() {
  console.log("rendering price");
  const priceRef = useRef<HTMLInputElement>(null);
  let [includesPrice, setIncludesPrice] = useState<{ count: number; totalPrice: number }>({
    count: 0,
    totalPrice: 0,
  });

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
    if (priceRef.current) {
      priceRef.current.value = `${includesPrice.totalPrice}`;
    }
  }, [includesPrice.totalPrice]);

  function toggleReadOnly() {
    if (priceRef.current) {
      priceRef.current.readOnly = !priceRef.current.readOnly;
      priceRef.current.focus();
    }
  }
  function setNewPrice(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.target;
    price.value = +input.value;
    setPremadeInput("price", price.value);
  }
  return (
    <div className='price flex items-center gap-x-2 ml-4 mt-2'>
      <input ref={priceRef} onInput={setNewPrice} type='number' className='font-semibold w-14 border outline-none' readOnly placeholder={`${price.value}`} />$
      <button onClick={toggleReadOnly} className='text-xs text-teal-500'>
        edit
      </button>
    </div>
  );
}
