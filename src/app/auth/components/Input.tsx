"use client";
import { signal } from "signals-react-safe";
// @ts-ignore
import inputValidation from "@oz-om/verify-inputs";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

type configurationType = {
  valid: boolean;
  requirements:
    | {
        maxLength: number;
        hasSymbols: boolean;
      }
    | string;
};

type fieldsType = {
  firstname: configurationType;
  lastname: configurationType;
  username: configurationType;
  email: configurationType;
  password: configurationType;
};
type fieldsKeys = keyof fieldsType;
export const fields = signal<fieldsType>({
  firstname: {
    valid: false,
    requirements: {
      maxLength: 3,
      hasSymbols: false,
    },
  },
  lastname: {
    valid: false,
    requirements: {
      maxLength: 3,
      hasSymbols: false,
    },
  },
  username: {
    valid: false,
    requirements: {
      maxLength: 4,
      hasSymbols: false,
    },
  },
  email: {
    valid: false,
    requirements: "default",
  },
  password: {
    valid: false,
    requirements: "default",
  },
});

function checkInput({ target: inputElement }: React.FormEvent<HTMLInputElement>) {
  let input = inputElement as HTMLInputElement;
  let inputName = input.name;
  let checkValue;
  if (input.name == "firstname" || input.name == "lastname") {
    inputName = "username";
  }
  if (fields.value[input.name as fieldsKeys].requirements == "default") {
    checkValue = inputValidation({ name: inputName, value: input.value });
  } else {
    checkValue = inputValidation({ name: inputName, value: input.value }, fields.value[input.name as fieldsKeys].requirements);
  }

  checkValue.then((result: boolean | string) => {
    if (result == true) {
      fields.value[input.name as fieldsKeys].valid = result;
      input.classList.add("outline-teal-100");
      input.classList.remove("outline-red-400");
    } else {
      fields.value[input.name as fieldsKeys].valid = false;
      input.classList.remove("outline-teal-100");
      input.classList.add("outline-red-400");
    }
  });
}

type inputProps = { [key: string]: string };

export function Input({ type, placeholder, name, className }: inputProps) {
  let params = useSearchParams();
  return (
    <div className='input_field relative border rounded mt-8 h-10 w-full'>
      <input
        onInput={(e) => {
          params.get("type") == "sign-up" && checkInput(e);
        }}
        name={name}
        type={type}
        className={"absolute w-full h-full z-[2]  py-2 pl-2 bg-transparent rounded outline-teal-100 focus:outline focus:outline-2  " + className}
        placeholder=' '
      />
      <label htmlFor={name} className='block absolute top-1/2 -translate-y-1/2 z-[1] transition-all text-slate-400 scale-75 select-none'>
        {placeholder}
      </label>
    </div>
  );
}

function checkAllInputs(e: React.MouseEvent) {
  let allValid = true;
  for (const input in fields.value) {
    if (!fields.value[input as fieldsKeys].valid) {
      allValid = false;
      break;
    }
  }
  if (!allValid) {
    e.preventDefault();
  }
}

export function Submit({ name }: { name: string }) {
  return (
    <button onClick={checkAllInputs} type='submit' className='block w-40 text-center mx-auto mt-5 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-400'>
      {name}
    </button>
  );
}
