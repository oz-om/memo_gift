"use client";

import React, { useEffect, useState } from "react";
import Chosed_item from "./Chosed_Item";
import { CloseAddPremadeIncludesDialog } from "../client/Buttons";
import Item from "../Item";
import { premade, setPremadeInput } from "../../type/Premade_gift";
import { useSignalEffect } from "signals-react-safe";
import { includeItemType } from "@/types/types";
import { toggleDialog } from "@/utils";
import Filter_includes from "./Filter_includes";
import Pagination from "./Pagination";
import { useFilteredData } from "../../context/Filter_Context";

export default function Add_items_dialog({ reset }: { reset: boolean }) {
  console.log("rerender dialog");
  const { filteredData, isPending } = useFilteredData();

  let [chosedItems, setChosedItems] = useState<includeItemType[]>([]);

  useSignalEffect(() => {
    if (premade.value.includes.length !== chosedItems.length) {
      setChosedItems([...premade.value.includes]);
    }
  });

  useEffect(() => {
    if (reset) {
      setPremadeInput("includes", []);
    }
  }, [reset]);

  return (
    <dialog open className='items_dialog_wrapper fixed left-0 right-0 top-0 bottom-0 border w-[95%] h-[95%] z-10 max-w-4xl m-auto bg-slate-50 shadow-md rounded-md overflow-auto custom-scroll-bar overscroll-contain'>
      <div className='close_dialog text-end'>
        <CloseAddPremadeIncludesDialog />
      </div>
      <div className='chosed_items_wrapper'>
        <div className='chosed_items container'>
          <p className='capitalize'>chosed items:</p>
          <div className='items my-2 grid gap-5 grid-cols-[repeat(auto-fit,_theme(width.20))]'>
            {chosedItems.map(({ id, name, images, price }) => {
              return <Chosed_item key={id} id={id} images={images} name={name} price={price} includes={chosedItems} />;
            })}
          </div>
          {chosedItems.length == 0 && <p className='text-slate-400 text-center text-xs py-2 border rounded-md mb-2'>there is no chosed items yet</p>}
          <button onClick={() => toggleDialog("items_dialog_wrapper")} className='block w-20 text-teal-50 bg-teal-500 uppercase ml-auto mb-2 rounded hover:bg-teal-600'>
            done
          </button>
        </div>
      </div>
      <div className='available_items_list'>
        <Filter_includes />
        <div className='items_content_wrapper mt-5'>
          <div className='container'>
            <div className='items_wrapper relative min-h-[160px]'>
              <div className='items grid gap-5 min-[300px]:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-4'>
                {filteredData.map(({ id, name, images, price }) => {
                  let firstImage = JSON.parse(images);
                  return <Item key={id} id={id} images={firstImage[0]} name={name} price={price} setPremade={setPremadeInput} includes={chosedItems} />;
                })}
              </div>
              {!isPending && filteredData.length == 0 && <p className='h-80 grid place-content-center'>no items found</p>}
              {isPending && (
                <div className='spin_wrapper absolute left-0 top-0 w-full h-full grid place-content-center'>
                  <i className='bx bx-loader bx-spin text-center'></i>
                </div>
              )}
            </div>
            <Pagination />
          </div>
        </div>
      </div>
    </dialog>
  );
}
