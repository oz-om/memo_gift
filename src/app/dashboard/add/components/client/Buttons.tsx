"use client";
import { toggleDialog } from "@/utils";
import React from "react";

export function OpenDialog() {
  return (
    <button onClick={() => toggleDialog("items_dialog_wrapper")} className='px-4 py-1 border border-teal-400 text-teal-500 rounded-md w-28 block ml-auto mb-4 hover:bg-teal-50'>
      add item
    </button>
  );
}

export function CloseDialog() {
  return <i onClick={() => toggleDialog("items_dialog_wrapper")} className='bx bx-x bx-sm bx-border mt-1 mr-1 cursor-pointer'></i>;
}
