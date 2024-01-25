"use client";
import React, { useState } from "react";
import { T_VariantProductType } from "../[variant_id]/page";
import { variantUpdateDetails } from "./UpdateVariantDetails";

export default function VariantDetails({ variant }: { variant: T_VariantProductType }) {
  const { name, preview, value } = variant;
  const [VariantInputs, setVariantInputs] = useState({
    name,
    preview,
    value,
  });

  function setNewVariantData(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.currentTarget;
    let inputType = input.name as "name";

    let value = input.value;
    setVariantInputs((prev) => ({
      ...prev,
      [inputType]: value,
    }));
    variantUpdateDetails.value[inputType] = value;
  }
  function editInput(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    let editButton = e.currentTarget;
    let targetInput: HTMLTextAreaElement | HTMLInputElement | null = null;

    targetInput = document.querySelector(`input[name='${editButton.dataset.input}'`);

    targetInput!.disabled = false;
    targetInput!.focus();
  }

  function disableInput(e: React.FocusEvent<HTMLInputElement>) {
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
          <input onChange={setNewVariantData} onBlur={disableInput} value={VariantInputs.name} className='flex-1 bg-transparent rounded w-full outline-teal-100 focus:outline focus:outline-2' name='name' type='text' disabled={true} />
        </div>
      </div>
      <div className='value my-2'>
        <h4 className='flex justify-between'>
          <span className='text-slate-600'>value:</span> <i onClick={editInput} data-input='value' className='bx bxs-edit-alt text-2xl text-blue-400 cursor-pointer'></i>
        </h4>
        <div>
          <input onChange={setNewVariantData} onBlur={disableInput} value={VariantInputs.value} className='flex-1 bg-transparent rounded w-full outline-teal-100 focus:outline focus:outline-2' name='value' type='text' disabled={true} />
        </div>
      </div>
    </>
  );
}
