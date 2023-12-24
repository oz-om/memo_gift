"use client";

import { toggleDialog } from "@/utils";

type boxStateType = {
  o: string[];
  x: string[];
};
// step two client components
function toggleBuiltBox(action: "o" | "x") {
  let boxState: boxStateType = {
    o: ["left-0", "left-[100vw]"],
    x: ["left-[100vw]", "left-0"],
  };
  document.querySelector("aside.chosed_collection_section")?.classList.add(boxState[action][0]);
  document.querySelector("aside.chosed_collection_section")?.classList.remove(boxState[action][1]);
  document.body.classList.toggle("overflow-hidden");
}
export function OpenBuiltBoxButton() {
  return (
    <div onClick={() => toggleBuiltBox("o")} className='built_box_show fixed right-0 bottom-0 grid py-1 px-2 rounded-l-lg bg-teal-900 cursor-pointer sm:hidden'>
      <span className='text-teal-400 inline-flex items-center'>
        <lord-icon src='https://cdn.lordicon.com/pgmktfgp.json' style={{ width: "30px", height: "30px" }} trigger='hover' colors='primary:#9cf4df,secondary:#848484'></lord-icon>
        <span>YourBox</span>
      </span>
    </div>
  );
}
export function CloseBuiltBoxButton() {
  return (
    <div onClick={() => toggleBuiltBox("x")} className='close_built_box_container basis-1/12 grid place-content-center cursor-pointer sm:hidden'>
      <i className='bx bx-chevron-right text-3xl'></i>
    </div>
  );
}

export function OpenPreview() {
  return (
    <div onClick={() => toggleDialog("dialog_quick_view")} className='quick_view px-2 text-xs grid place-content-center bg-teal-400 text-white rounded-sm cursor-pointer'>
      View
    </div>
  );
}
export function ClosePreview() {
  return (
    <div onClick={() => toggleDialog("dialog_quick_view")} className='close_preview w-5 h-5 my-1 ml-auto rounded-md bg-red-200 grid place-content-center cursor-pointer border border-red-500'>
      <i className='bx bx-x text-red-500 text-2xl'></i>
    </div>
  );
}
