"use client";
import { T_setInputsValue } from "@/types/types";
import React, { useRef } from "react";

type inputProps = {
  name: "name" | "desc" | "price" | "value";
  type?: string;
  placeholder?: string;
  className?: string;
  setValue: T_setInputsValue;
  reset: boolean;
};
export default function Input({ name, type, placeholder, className = "", setValue, reset }: inputProps) {
  console.log("render", placeholder);
  let inputEle = useRef<HTMLInputElement | null>(null);
  if (reset) {
    setValue(name, "");
    if (inputEle.current) {
      inputEle.current.value = "";
    }
  }
  function handleInput({ target: input }: React.ChangeEvent<HTMLInputElement>) {
    // setValue(placeholder || "name", input.value);
    setValue(name, input.value);
  }
  return (
    <div className={"input_field relative border rounded mt-8 h-10 w-full " + className}>
      <input ref={inputEle} onInput={handleInput} name={name} type={type} className={"absolute w-full h-full z-[2]  py-2 pl-2 bg-transparent rounded outline-teal-100 focus:outline focus:outline-2  "} placeholder=' ' />
      <label htmlFor={name} className='block absolute top-1/2 -translate-y-1/2 z-[1] transition-all text-slate-400 scale-75 select-none capitalize'>
        {placeholder}
      </label>
    </div>
  );
}

export function Textarea({ name, placeholder, className, setValue, reset }: inputProps) {
  console.log("render", placeholder);
  let areaInputEle = useRef<HTMLTextAreaElement | null>(null);
  if (reset) {
    setValue("desc", "");
    if (areaInputEle.current) {
      areaInputEle.current.value = "";
    }
  }
  function textAreaAutoResize({ target: textarea }: React.ChangeEvent<HTMLTextAreaElement>) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.parentElement!.style.height = textarea.scrollHeight + "px";

    setValue("desc", textarea.value);
  }
  return (
    <div className={"input_field relative mt-8 h-16 w-full " + className}>
      <textarea ref={areaInputEle} onInput={textAreaAutoResize} name={name} className={"absolute w-full h-full z-[2]  py-2 pl-2 bg-transparent border rounded outline-teal-100 focus:outline focus:outline-2 resize-none custom-scroll-bar "} placeholder=' '></textarea>
      <label htmlFor={name} className='block absolute top-1/2 -translate-y-1/2 z-[1] transition-all text-slate-400 scale-75 select-none capitalize'>
        {placeholder}
      </label>
    </div>
  );
}
