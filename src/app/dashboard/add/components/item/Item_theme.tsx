"use client";

import { T_setInputsValue } from "@/types/types";
import { useRef } from "react";

export default function Item_theme({ setTheme, reset }: { setTheme: T_setInputsValue; reset: boolean }) {
  let defaultSelected = useRef<HTMLOptionElement | null>(null);
  if (reset) {
    setTheme("theme", "white-to-black");
    if (defaultSelected.current) {
      defaultSelected.current.selected = true;
    }
  }
  function getTheme({ target: selectElement }: React.ChangeEvent) {
    let select = selectElement as HTMLSelectElement;
    setTheme("theme", select.value);
  }
  return (
    <div className='select theme_wrapper flex items-center relative max-w-sm'>
      <span className='capitalize text-sm mr-2'>item theme:</span>
      <select onChange={getTheme} className='filter-by px-2 w-full rounded'>
        <option ref={defaultSelected} value='white-to-black'>
          White-to-Black
        </option>
        <option value='red-to-violet'>Red-to-Violet</option>
        <option value='blue-to-teal'>Blue-to-teal</option>
        <option value='green-to-yellow'>Green-to-Yellow</option>
        <option value='amber-to-vermilion'>Amber-to-Vermilion</option>
      </select>
    </div>
  );
}
