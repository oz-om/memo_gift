"use client";
import { T_setInputsValue } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { signal, useSignalEffect } from "signals-react-safe";
import { premade } from "../../type/Premade_gift";
let price = signal(0);
export default function Price({ readOnly = false, setValue }: { readOnly?: boolean; setValue: T_setInputsValue }) {
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
    setValue("price", includesPrice.totalPrice);
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
    setValue("price", price.value);
  }
  return (
    <div className='price flex items-center gap-x-2 ml-4 mt-2'>
      <input ref={priceRef} onInput={setNewPrice} type='number' className='font-semibold w-14 border outline-none' readOnly={readOnly} placeholder={`${price.value}`} />$
      {readOnly && (
        <button onClick={toggleReadOnly} className='text-xs text-teal-500'>
          edit
        </button>
      )}
    </div>
  );
}
