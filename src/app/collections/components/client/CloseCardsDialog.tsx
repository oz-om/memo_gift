"use client";
import { toggleDialog } from "@/utils";
import React from "react";

export default function CloseCardsDialog() {
  function closeCardsDialog(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    toggleDialog("collections-cards-dialog");
  }
  return (
    <div>
      <button onClick={closeCardsDialog} className=' text-red-700 border border-red-200 text-center px-4 py-2 rounded-md mx-auto min-w-max w-2/5 block cursor-pointer'>
        cancel
      </button>
    </div>
  );
}
