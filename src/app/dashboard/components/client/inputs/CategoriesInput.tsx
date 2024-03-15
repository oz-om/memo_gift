"use client";
import { T_setInputsValue } from "@/types/types";
import { useEffect, useState } from "react";

type inputProps = {
  name?: string;
  className?: string;
  setValue: T_setInputsValue;
  reset: boolean;
};
export function CategoriesInput({ name = "categories", className, setValue, reset }: inputProps) {
  console.log("render categories input");
  const [categories, updateCategories] = useState<string[]>([]);
  function addCategory(value: string) {
    updateCategories((prev) => [...prev, value]);
    setValue("categories", [...categories, value]);
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

  useEffect(() => {
    if (reset) {
      updateCategories([]);
      setValue("categories", []);
    }
  }, [reset]);
  return (
    <div className={"categories_wrapper py-4 " + className}>
      <h4 className='pb-2 capitalize text-sm'>{name}:</h4>
      <div className='categories_input border w-fit flex flex-wrap gap-x-3 gap-y-2 p-1'>
        <input onKeyDownCapture={onInter} onBlur={onBlur} type='text' className='basis-32 w-full border rounded outline-none pl-1' placeholder='tag' />
        {categories.map((category, i) => (
          <Category key={i} name={category} cats={categories} remove={setValue} updateCategories={updateCategories} />
        ))}
        {categories.length == 0 && <p className='text-slate-400 text-center text-xs'>there is noe {name} added yet</p>}
      </div>
    </div>
  );
}

type categoryProps = {
  name: string;
  cats: string[];
  remove: T_setInputsValue;
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
    remove("categories", update);
  }
  return (
    <div className='flex items-center px-2 py-1 bg-yellow-50 whitespace-nowrap rounded shadow'>
      <span>{name}</span>
      <i id={name} onClick={removeCat} className='bx bx-x cursor-pointer ml-2 text-xl'></i>
    </div>
  );
}
