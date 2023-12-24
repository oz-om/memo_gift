"use client";
import { signal } from "signals-react-safe";
import React from "react";
import { z } from "zod";
import { zodFields } from "@/utils";
import { toast } from "react-hot-toast";

let fieldsSchema = z.object({
  ...zodFields,
});
type fieldsType = z.infer<typeof fieldsSchema>;

export const fields = signal<fieldsType>({
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  password: "",
});

type inputProps = {
  type: string;
  placeholder: string;
  name: fieldsNames;
  className?: string;
  checkable?: boolean;
};

type fieldsNames = keyof fieldsType;
export function Input({ type, placeholder, name, className, checkable = false }: inputProps) {
  function checkInput({ target: inputElement }: React.ChangeEvent<HTMLInputElement>) {
    if (!checkable) return;
    let input = inputElement;
    let validation = zodFields[name].safeParse(input.value);
    fields.value[name] = input.value;
    if (validation.success) {
      input.classList.add("outline-teal-100");
      input.classList.remove("outline-red-400");
    } else {
      input.classList.remove("outline-teal-100");
      input.classList.add("outline-red-400");
    }
  }
  return (
    <div className='input_field relative border rounded mt-8 h-10 w-full'>
      <input onInput={checkInput} name={name} type={type} className={"absolute w-full h-full z-[2]  py-2 pl-2 bg-transparent rounded outline-teal-100 focus:outline focus:outline-2  " + className} placeholder=' ' />
      <label htmlFor={name} className='block absolute top-1/2 -translate-y-1/2 z-[1] transition-all text-slate-400 scale-75 select-none'>
        {placeholder}
      </label>
    </div>
  );
}

export function Submit({ name }: { name: string }) {
  function checkAllInputs(e: React.MouseEvent) {
    let allValid = fieldsSchema.safeParse(fields.value);

    if (!allValid.success) {
      toast.error("you inputs is invalid, check your inputs again!", {
        position: "top-right",
        style: {
          backgroundColor: "#ffe6e6",
          padding: "1px 2px",
          fontSize: "12px",
        },
      });
      e.preventDefault();
      return;
    }
  }

  return (
    <button onClick={checkAllInputs} type='submit' className='block w-40 text-center mx-auto mt-5 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-400'>
      {name}
    </button>
  );
}
