"use client";
import React, { useState } from "react";
import { T_PostcardProductType } from "../[postcard_id]/page";
import { postcardUpdateDetails } from "./UpdatePostcardDetails";

export default function PostcardDetails({ postcard }: { postcard: T_PostcardProductType }) {
  const { name, image } = postcard;
  const [postcardInputs, setPostcardInputs] = useState({
    name: name,
    image: image,
  });

  function setNewPostcardData(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.currentTarget;
    let inputType = input.name as "name";

    let value = input.value;
    setPostcardInputs((prev) => ({
      ...prev,
      [inputType]: value,
    }));
    postcardUpdateDetails.value[inputType] = value;
  }
  function editInput(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    let editButton = e.currentTarget;
    let targetInput: HTMLTextAreaElement | HTMLInputElement | null = null;

    targetInput = document.querySelector(`input[name='${editButton.dataset.input}'`);

    targetInput!.disabled = false;
    targetInput!.focus();
  }

  function disableInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    let input = e.currentTarget;
    input.disabled = true;
  }

  return (
    <>
      <div className='name my-2'>
        <h4 className='flex justify-between'>
          <span className='text-slate-600'>name:</span> <i onClick={editInput} data-input='name' className='bx bxs-edit-alt text-2xl text-blue-400 cursor-pointer'></i>
        </h4>
        <div>
          <input onChange={setNewPostcardData} onBlur={disableInput} value={postcardInputs.name} className='flex-1 bg-transparent rounded w-full outline-teal-100 focus:outline focus:outline-2' name='name' type='text' disabled={true} />
        </div>
      </div>
    </>
  );
}
