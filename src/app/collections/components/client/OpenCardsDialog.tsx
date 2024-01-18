"use client";
import { toggleDialog } from "@/utils";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function OpenCardsDialog() {
  const [disabled, setDisabled] = useState(false);
  let params = useSearchParams();
  let path = usePathname();
  function openCardsDialog() {
    toggleDialog("collections-cards-dialog");
  }
  useEffect(() => {
    let targetPath = path.split("/").includes("premade");
    if (targetPath) {
      setDisabled(!params.get("v"));
    }
  }, [params.get("v")]);
  return (
    <button onClick={openCardsDialog} disabled={disabled} className='w-52 mx-auto sm:mr-0 block text-sm font-semibold bg-teal-500 text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-teal-400 uppercase disabled:bg-teal-800/25'>
      set Card / add to Cart
    </button>
  );
}
