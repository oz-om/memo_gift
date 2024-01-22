"use client";
import { useRef } from "react";
import { premade, setPremadeInput } from "../../type/Premade_gift";

type checkboxProps = {
  id: string;
  value: string;
  name: string;
  reset: boolean;
};

export default function Custom_Checkbox({ id, value, name, reset }: checkboxProps) {
  let checkbox = useRef<HTMLInputElement | null>(null);
  function handleChecked({ target: checkbox }: React.ChangeEvent<HTMLInputElement>) {
    let variants = premade.value.variants;
    if (checkbox.checked) {
      setPremadeInput("variants", [
        ...variants,
        {
          id,
        },
      ]);
    } else {
      let update = variants.filter((variant) => variant.id !== checkbox.id);
      setPremadeInput("variants", update);
    }
  }
  if (reset) {
    checkbox.current!.checked = false;
  }

  return (
    <div className='box-variant flex items-center gap-x-2 mb-2 shadow-md rounded p-2'>
      <input ref={checkbox} onChange={handleChecked} id={id} type='checkbox' hidden />
      <div className='custom_checkbox checkbox-circle relative inline-block w-5 h-5 rounded-full border transition-all'>
        <svg viewBox='0 0 52 52' className='checkmark absolute top-0 left-0 fill-none stroke-white stroke-2 opacity-0 transition-all' strokeLinecap='round' strokeLinejoin='round'>
          <circle fill='none' r='25' cy='26' cx='26' className='checkmark-circle [transition:_stroke-dashoffset_0.3s]' strokeDasharray='166' strokeDashoffset='166'></circle>
          <path d='M16 26l9.2 8.4 17.4-21.4' className='checkmark-kick [transition:_stroke-dashoffset_0.3s]' strokeDasharray='50' strokeDashoffset='50'></path>
        </svg>
      </div>
      <label htmlFor={id} className={"flex p-1 rounded cursor-pointer "} style={{ backgroundColor: value }}>
        <span className='block w-6 h-6'></span>
        <p className='bg-white rounded px-1'>{name}</p>
      </label>
    </div>
  );
}
