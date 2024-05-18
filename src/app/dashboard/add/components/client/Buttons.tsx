"use client";
import { toggleDialog } from "@/utils";
import React, { Dispatch, SetStateAction } from "react";

export function OpenAddPremadeIncludesDialog(props: { isImported: boolean; importDialog: Dispatch<SetStateAction<boolean>> }) {
  const { importDialog, isImported } = props;
  function openDialog() {
    if (isImported) {
      toggleDialog("items_dialog_wrapper");
    } else {
      importDialog(true);
      document.body.classList.toggle("overflow-hidden");
      document.body.classList.toggle("sm:overflow-auto");
    }
  }
  return (
    <button onClick={openDialog} className='px-4 py-1 border border-teal-400 text-teal-500 rounded-md w-28 block ml-auto mb-4 hover:bg-teal-50'>
      add item
    </button>
  );
}

export function CloseAddPremadeIncludesDialog() {
  return <i onClick={() => toggleDialog("items_dialog_wrapper")} className='bx bx-x bx-sm bx-border mt-1 mr-1 cursor-pointer'></i>;
}
