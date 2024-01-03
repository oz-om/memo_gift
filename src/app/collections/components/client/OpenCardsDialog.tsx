"use client";
import { toggleDialog } from "@/utils";
import React from "react";

export default function OpenCardsDialog() {
  function openCardsDialog() {
    toggleDialog("collections-cards-dialog");
  }
  return (
    <button onClick={openCardsDialog} className='w-52 mx-auto sm:mr-0 block text-sm font-semibold bg-teal-500 text-white rounded-lg px-4 py-2 hover:bg-teal-400 uppercase'>
      set Card / add to Cart
    </button>
  );
}
