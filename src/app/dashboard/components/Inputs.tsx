"use client";
import React, { useState } from "react";
import { useSignalEffect } from "signals-react-safe";
import { premade } from "../add/type/Premade_gift";

type inputProps = {
  name?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  setValue: ({ fieldType, value }: { fieldType: string; value: any }) => void;
};
export default function Input({ name, type, placeholder, className = "", setValue }: inputProps) {
  console.log("render", placeholder);
  function handleInput({ target: input }: React.ChangeEvent<HTMLInputElement>) {
    setValue({
      fieldType: "name",
      value: input.value,
    });
  }
  return (
    <div className={"input_field relative border rounded mt-8 h-10 w-full " + className}>
      <input onInput={handleInput} name={name} type={type} className={"absolute w-full h-full z-[2]  py-2 pl-2 bg-transparent rounded outline-teal-100 focus:outline focus:outline-2  "} placeholder=' ' />
      <label htmlFor={name} className='block absolute top-1/2 -translate-y-1/2 z-[1] transition-all text-slate-400 scale-75 select-none capitalize'>
        {placeholder}
      </label>
    </div>
  );
}

export function Textarea({ name, placeholder, className, setValue }: inputProps) {
  console.log("render", placeholder);
  function textAreaAutoResize({ target: textarea }: React.ChangeEvent<HTMLTextAreaElement>) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.parentElement!.style.height = textarea.scrollHeight + "px";

    setValue({
      fieldType: "desc",
      value: textarea.value,
    });
  }
  return (
    <div className={"input_field relative mt-8 h-16 w-full " + className}>
      <textarea onInput={textAreaAutoResize} name={name} className={"absolute w-full h-full z-[2]  py-2 pl-2 bg-transparent border rounded outline-teal-100 focus:outline focus:outline-2 resize-none custom-scroll-bar "} placeholder=' '></textarea>
      <label htmlFor={name} className='block absolute top-1/2 -translate-y-1/2 z-[1] transition-all text-slate-400 scale-75 select-none capitalize'>
        {placeholder}
      </label>
    </div>
  );
}

export function CategoriesInput({ className, setValue }: inputProps) {
  console.log("render categories input");
  const [categories, updateCategories] = useState<string[]>([]);
  function addCategory(value: string) {
    updateCategories((prev) => [...prev, value]);
    setValue({
      fieldType: "categories",
      value: [...categories, value],
    });
  }
  function onInter({ code, target: inputElement }: React.KeyboardEvent) {
    let input = inputElement as HTMLInputElement;
    if (code == "Enter" && input.value.trim().length !== 0) {
      addCategory(input.value);
      input.value = "";
    }
  }
  function onBlur({ target: input }: React.ChangeEvent<HTMLInputElement>) {
    if (input.value.trim().length !== 0) {
      addCategory(input.value);
      input.value = "";
    }
  }

  return (
    <div className={"categories_wrapper py-4 " + className}>
      <h4 className='pb-2 capitalize text-sm'>categories:</h4>
      <div className='categories_input border w-fit flex flex-wrap gap-x-3 gap-y-2 p-1'>
        <input onKeyDownCapture={onInter} onBlur={onBlur} type='text' className='basis-32 w-full border rounded outline-none pl-1' placeholder='tag' />
        {categories.map((category, i) => (
          <Category key={i} name={category} cats={categories} remove={setValue} updateCategories={updateCategories} />
        ))}
        {categories.length == 0 && <p className='text-slate-400 text-center text-xs'>there is noe categories added yet</p>}
      </div>
    </div>
  );
}

type categoryProps = {
  name: string;
  cats: string[];
  remove: ({ fieldType, value }: { fieldType: string; value: any }) => void;
  updateCategories: React.Dispatch<React.SetStateAction<string[]>>;
};
function Category({ name, cats, remove, updateCategories }: categoryProps) {
  function removeCat({
    target,
  }: React.MouseEvent<HTMLElement> & {
    target: HTMLElement;
  }) {
    let currentCat = target.id;
    let update = cats.filter((category) => category !== currentCat);
    updateCategories(update);
    remove({
      fieldType: "categories",
      value: update,
    });
  }
  return (
    <div className='flex items-center px-2 py-1 bg-yellow-50 whitespace-nowrap rounded shadow'>
      <span>{name}</span>
      <i id={name} onClick={removeCat} className='bx bx-x cursor-pointer ml-2 text-xl'></i>
    </div>
  );
}

export function UploadInput() {
  console.log("render upload input");
  return (
    <label htmlFor='file' className='cursor-pointer flex flex-col border-2 border-slate-400 border-dashed rounded-md'>
      <svg className='h-28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
        <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
        <g id='SVGRepo_iconCarrier'>
          <path d='M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15' stroke='#b8ccc8' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>{" "}
        </g>
      </svg>
      <p className='text-center text-[#b8ccc8]'>Browse File to upload!</p>
      <input id='file' type='file' className='hidden' />
    </label>
  );
}
