"use client";
import type { itemDataType } from "@/types/types";
import React from "react";
import { signal } from "signals-react-safe";
import Input, { CategoriesInput, Textarea, UploadInput } from "../../components/Inputs";
import Chosed_image from "../components/Chosed_image";

export const item = signal<itemDataType>({
  name: "",
  desc: "",
  categories: [],
  theme: "white-to-black",
  images: [],
  price: 0,
});

export function setItemInput({ fieldType, value }: { fieldType: string; value: any }) {
  item.value = {
    ...item.value,
    [fieldType]: value,
  };
}

export default function Item({ action }: { action: (data: itemDataType) => Promise<void> }) {
  console.log("render item wrapper");
  function getTheme({ target: selectElement }: React.ChangeEvent) {
    let select = selectElement as HTMLSelectElement;
    setItemInput({
      fieldType: "theme",
      value: select.value,
    });
  }
  function publish() {
    console.log(item.value);
    action(item.value);
  }
  return (
    <div className='add_item_wrapper'>
      <div className='form mb-20 px-3'>
        <div className='about_item md:flex md:gap-x-10'>
          <div className='inputs_wrapper basis-1/2 max-w-lg'>
            <Input name='name' type={"text"} placeholder='name' setValue={setItemInput} />
            <Textarea name='desc' placeholder={"description"} setValue={setItemInput} />
            <CategoriesInput setValue={setItemInput} />
            <div className='item_theme_wrapper'>
              <div className='select theme_wrapper flex items-center relative max-w-sm'>
                <span className='capitalize text-sm mr-2'>item theme:</span>
                <select onChange={getTheme} className='filter-by px-2 w-full rounded'>
                  <option value='white-to-black'>White-to-Black</option>
                  <option value='red-to-violet'>Red-to-Violet</option>
                  <option value='blue-to-teal'>Blue-to-teal</option>
                  <option value='green-to-yellow'>Green-to-Yellow</option>
                  <option value='amber-to-vermilion'>Amber-to-Vermilion</option>
                </select>
              </div>
            </div>
            <div className='price'>
              <Input setValue={setItemInput} name={"price"} type={"number"} placeholder={"price"} />
            </div>
          </div>
          <div className='premade_photos_wrapper basis-1/2 md:max-w-lg'>
            <h4 className='capitalize mb-2 text-sm'>chose images:</h4>
            <UploadInput />
            <div className='chosed_images_wrapper'>
              <div className='images my-2 grid gap-5 grid-cols-[repeat(auto-fit,_theme(width.28))] justify-evenly'>
                {/* <Chosed_image image={"/images/premade_chosed_image_01.png"} />
                <Chosed_image image={"/images/premade_chosed_image_02.png"} />
                <Chosed_image image={"/images/premade_chosed_image_03.png"} />
                <Chosed_image image={"/images/premade_chosed_image_04.png"} /> */}
              </div>
              <p className='text-slate-400 text-center text-xs py-2 border rounded-md mb-2'>there is no images added yet</p>
            </div>
          </div>
        </div>
        <div className='publish_wrapper'>
          <button onClick={publish} className='px-4 py-1 bg-teal-500 text-white rounded-md w-28 block ml-auto mr-5 hover:bg-teal-700'>
            publish
          </button>
        </div>
      </div>
    </div>
  );
}
/*

*/
