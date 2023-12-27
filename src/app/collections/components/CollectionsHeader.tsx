import React from "react";
import SwitchNav from "./client/SwitchNav";

export default function CollectionsHeader() {
  return (
    <section className='switch_collections_type mb-4'>
      <div className='container'>
        <div className='switch_collections_type_wrapper flex flex-col items-center'>
          <span className='text-center text-slate-500 text-xs mb-2'>switch between</span>
          <div className='collections flex items-center'>
            <SwitchNav />
          </div>
        </div>
        <div className='collections_desc text-slate-600 text-center text-sm mt-5'>
          <p className='max-w-xl mx-auto text-center'>
            here you can find all <i>premade gits</i> that we chose for you or you can chose <i>single items</i> as your needed to keep you free to make your collection
          </p>
        </div>
      </div>
      <div className='filter_bar_wrapper bg-teal-50 py-3'>
        <div className='container'>
          <h4>FILTER:</h4>
          <div className='filters'>
            <ul className='filter_bar flex justify-start gap-x-5 flex-wrap min-[650px]:justify-evenly'>
              <li className='filter_by_price flex bg-[#f0f9f6] ml-3 flex-1'>
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
              <li className='select filter_by_category'>
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
              <li className='select filter_by_color'>
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
    </section>
  );
}
