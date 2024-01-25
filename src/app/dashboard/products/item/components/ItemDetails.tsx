"use client";
import React, { useEffect, useRef, useState } from "react";
import { T_ItemProductType } from "../[item_id]/page";
import { itemUpdateDetails } from "./UpdateItemDetails";

export default function ItemDetails({ item }: { item: T_ItemProductType }) {
  const { name, price, desc, images, categories } = item;
  const [itemInputs, setItemInputs] = useState({
    name: name,
    price: `${price}`,
    desc: desc,
    images: images,
    categories: categories.map(({ cat }) => cat.name),
  });
  const textAreaDesc = useRef<HTMLTextAreaElement | null>(null);

  function setNewItemData(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    let input = e.currentTarget;
    let inputType = input.name as "name" | "price" | "desc";

    let value = input.value;
    setItemInputs((prev) => ({
      ...prev,
      [inputType]: value,
    }));
    if (inputType == "price") {
      let price = Number(value);
      if (isNaN(price)) {
        return;
      }
      itemUpdateDetails.value.price = price;
    } else {
      itemUpdateDetails.value[inputType] = value;
    }
  }
  function editInput(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    let editButton = e.currentTarget;
    let targetInput: HTMLTextAreaElement | HTMLInputElement | null = null;
    if (editButton.dataset.input == "desc") {
      targetInput = document.querySelector(`textarea[name='${editButton.dataset.input}'`);
    } else {
      targetInput = document.querySelector(`input[name='${editButton.dataset.input}'`);
    }
    targetInput!.disabled = false;
    targetInput!.focus();
  }

  function disableInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    let input = e.currentTarget;
    input.disabled = true;
  }
  useEffect(() => {
    const textarea = textAreaDesc.current;
    if (textarea) {
      textarea.value = item?.desc ?? "";
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, []);

  return (
    <>
      <div className='name my-2'>
        <h4 className='flex justify-between'>
          <span className='text-slate-600'>name:</span> <i onClick={editInput} data-input='name' className='bx bxs-edit-alt text-2xl text-blue-400 cursor-pointer'></i>
        </h4>
        <div>
          <input onChange={setNewItemData} onBlur={disableInput} value={itemInputs.name} className='flex-1 bg-transparent rounded w-full outline-teal-100 focus:outline focus:outline-2' name='name' type='text' disabled={true} />
        </div>
      </div>
      <div className='price my-2'>
        <h4 className='flex justify-between'>
          <span className='text-slate-600'>price:</span> <i onClick={editInput} data-input='price' className='bx bxs-edit-alt text-2xl text-blue-400 cursor-pointer'></i>
        </h4>
        <div className='flex'>
          <span>$</span>
          <input onChange={setNewItemData} onBlur={disableInput} value={itemInputs.price} className='flex-1 bg-transparent rounded w-full outline-teal-100 focus:outline focus:outline-2' type='text' name='price' disabled={true} />
        </div>
      </div>
      <div className='desc my-2'>
        <h4 className='flex justify-between'>
          <span className='text-slate-600'>description:</span> <i onClick={editInput} data-input='desc' className='bx bxs-edit-alt text-2xl text-blue-400 cursor-pointer'></i>
        </h4>
        <div>
          <textarea ref={textAreaDesc} name='desc' onBlur={disableInput} onChange={setNewItemData} disabled={true} className='resize-none w-full border rounded px-2 outline-teal-100 focus:outline focus:outline-2 custom-scroll-bar' />
        </div>
      </div>
    </>
  );
}
