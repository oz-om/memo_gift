"use client";
import Image from "next/image";
import { useState } from "react";
import { formState } from "./Address_form";

type orderPros = {
  name: string;
  price: number;
  includes: string[];
  postCard: string;
  type?: string;
};
export default function Order({ name, price, includes, postCard, type = "box" }: orderPros) {
  const [addressesListState, setAddressesListState] = useState(false);
  function toggleAddressesList() {
    setAddressesListState((prev) => !prev);
  }

  function toggleAddressesFormState() {
    formState.value = !formState.value;
  }

  return (
    <div className='order bg-teal-50/10 p-2 rounded-md shadow-lg even:my-4'>
      <h4 className='text-slate-500 text-sm'>order details:</h4>
      <div className='order_details_wrapper md:flex gap-x-2 justify-center'>
        <div className='order_details'>
          <div className='order_name flex justify-between px-4'>
            <h4 className='line-clamp-2'>{name}</h4>
            <div className='price'>
              <span className='font-sans'>{price}$</span>
            </div>
          </div>
          <div className='order_includes_items whitespace-nowrap overflow-x-auto my-2 custom-scroll-bar'>
            {type == "box" && (
              <figure className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden'>
                <Image src={"/images/favo_01.png"} alt={name} width={650} height={650} />
              </figure>
            )}
            {includes.map((img, i) => {
              return (
                <figure key={i} className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden'>
                  <Image src={img} alt={name} width={650} height={650} />
                </figure>
              );
            })}
          </div>
          <div className='order_manage flex justify-between'>
            <div className='duplicate_order w-40 text-teal-600 text-xs'>
              <button className='underline'>Duplicate Gift for Another Recipient</button>
            </div>
            <div className='delete_order px-4 grid place-content-center rounded-md text-red-400 cursor-pointer hover:bg-red-50'>
              <button>delete</button>
            </div>
          </div>
          <div className='order_address_wrapper mt-4'>
            <div className='order_address relative'>
              <div onClick={toggleAddressesList} className='chosed_address px-4 py-2 text-xs bg-white border-2 rounded-md cursor-pointer hover:bg-slate-100'>
                <p>Omar Ouzine, United States, florida, usa, 32082</p>
              </div>
              <ul className={"address_list absolute left-0 top-[90%] bg-slate-50 w-full rounded-b-md border-2 border-t-transparent " + (addressesListState ? "block" : "hidden")}>
                <li onClick={toggleAddressesFormState} className='new_address py-2 px-4 cursor-pointer hover:bg-teal-50 font-medium text-sm'>
                  new address
                </li>
                <li onClick={toggleAddressesList} className=' py-2 px-4 cursor-pointer hover:bg-teal-50 text-xs'>
                  Omar Ouzine, United States, florida, usa, 32082
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='order_massage sm:flex mt-4 justify-center gap-x-2'>
          <div className='inputs grid grid-cols-2 gap-x-5 gap-y-4 md:block lg:grid'>
            <div className='to_input'>
              <label htmlFor='to'>to</label>
              <input type='text' id='to' placeholder='to' className='w-full px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light' />
            </div>
            <div className='form_input'>
              <label htmlFor='from'>from</label>
              <input type='text' id='from' placeholder='from' className='w-full px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light' />
            </div>
            <div className='massage col-span-2 md:mt-3'>
              <textarea name='massage' id='massage' placeholder='friendly message' className='w-full resize-none px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light'></textarea>
            </div>
          </div>
          <figure className='max-w-xs mx-auto basis-1/4 md:basis-auto md:h-48 overflow-hidden rounded-md'>
            <Image src={postCard} alt='Post Card' width={650} height={650} className='h-full' />
          </figure>
        </div>
      </div>
    </div>
  );
}
