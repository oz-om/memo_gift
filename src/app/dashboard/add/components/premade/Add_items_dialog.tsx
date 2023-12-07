import Pagination from "@/app/components/Pagination";
import React from "react";
import Chosed_item from "./Chosed_Item";
import { CloseDialog } from "../client/Buttons";
import Item from "../Item";

export default function Add_items_dialog() {
  console.log("rerender dialog");
  return (
    <dialog className='items_dialog_wrapper fixed left-0 right-0 top-0 bottom-0 border w-[95%] h-[95%] z-10 max-w-4xl m-auto bg-slate-50 shadow-md rounded-md custom-scroll-bar'>
      <div className='close_dialog text-end'>
        <CloseDialog />
      </div>
      <div className='chosed_items_wrapper'>
        <div className='chosed_items container'>
          <p className='capitalize'>chosed items:</p>
          <div className='items my-2 grid gap-5 grid-cols-[repeat(auto-fit,_theme(width.20))]'>
            <Chosed_item image='/images/items_01.png' name='first items pens' price={12} />
            <Chosed_item image='/images/items_02.png' name='second items non' price={22} />
            <Chosed_item image='/images/items_03.png' name='third items' price={24} />
          </div>
          <p className='text-slate-400 text-center text-xs py-2 border rounded-md mb-2'>there is no chosed items yet</p>
          <button className='block w-20 text-teal-50 bg-teal-500 uppercase ml-auto mb-2 rounded hover:bg-teal-600'>done</button>
        </div>
      </div>
      <div className='available_items_list'>
        <div className='filter_bar_wrapper bg-teal-50 py-3'>
          <div className='container'>
            <h4>FILTER:</h4>
            <div className='filters'>
              <ul className='filter_bar flex justify-start gap-x-5 flex-wrap min-[650px]:justify-evenly'>
                <li className='filter_by_price flex bg-[#f0f9f6] relative flex-1'>
                  <span className='text-teal-700'>Price:</span>
                  <div className='price-range flex ml-3'>
                    <div className='min-price flex items-center'>
                      <label htmlFor='min' className='whitespace-nowrap'>
                        min: $
                      </label>
                      <input type='number' id='min' placeholder='00' min={0} className='h-4 w-12 outline-transparent' />
                    </div>
                    <div className='max-price flex items-center'>
                      <label htmlFor='max' className='whitespace-nowrap'>
                        max: $
                      </label>
                      <input type='number' id='max' placeholder='max' min={1} className='h-4 w-12 outline-transparent' />
                    </div>
                  </div>
                </li>
                <li className='select filter_by_category flex relative flex-1'>
                  <span className='text-teal-700'>Category:</span>
                  <select className='filter-by px-2'>
                    <option value=''>choose an option-</option>
                    <option value='Holiday'>Holiday</option>
                    <option value='Birthday'>Birthday</option>
                    <option value='Congratulations'>Congratulations</option>
                    <option value='New Family'>New Family</option>
                    <option value='Baby'>Baby</option>
                    <option value='Kids'>Kids</option>
                    <option value='Books We Love'>Books We Love</option>
                  </select>
                </li>
                <li className='select filter_by_color flex relative flex-1'>
                  <span className='text-teal-700'>Color:</span>
                  <select className='filter-by px-2'>
                    <option value='All'>All</option>
                    <option value='white-to-black'>White-to-Black</option>
                    <option value='red-to-pink'>Red-to-Violet</option>
                    <option value='blue-to-teal'>Blue-to-teal</option>
                    <option value='green-to-yellow'>Green-to-Yellow</option>
                    <option value='amber-to-vermilion'>Amber-to-Vermilion</option>
                  </select>
                </li>
              </ul>
              <div className='filter_by_search'>
                <div className='search_wrap max-w-2xl mx-auto flex relative overflow-hidden rounded-md p-1'>
                  <input className='w-full py-1 px-3 outline-transparent ring-1 ring-teal-200 rounded-md' type='text' placeholder='search...' />
                  <i className='bx bx-search-alt absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='items_content_wrapper mt-5'>
          <div className='container'>
            <div className='items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4 cursor-pointer'>
              <Item image='/images/items_01.png' name='first items pens' price={12} />
              <Item image='/images/items_02.png' name='second items non' price={22} />
              <Item image='/images/items_03.png' name='third items' price={24} />
              <Item image='/images/items_04.png' name='fourth items black night' price={14} />
              <Item image='/images/items_05.png' name='night blue fiveth items' price={41} />
              <Item image='/images/items_06.png' name='sixth items fight' price={13} />
              <Item image='/images/items_07.png' name='seventh items book light' price={20} />
              <Item image='/images/items_08.png' name='book light' price={15} />
            </div>
            <Pagination />
          </div>
        </div>
      </div>
    </dialog>
  );
}
