"use client";

import { useState } from "react";
import { useSignalEffect } from "signals-react-safe";
import { signal } from "signals-react-safe";

export const formState = signal(false);

export default function Address_form() {
  const [r, setRerender] = useState(false);
  function toggleAddressesFormState() {
    formState.value = false;
    setRerender(formState.value);
  }
  useSignalEffect(() => {
    if (formState.value) {
      setRerender(formState.value);
    }
  });

  return (
    <div onClick={toggleAddressesFormState} className={"address_form_wrapper fixed w-full h-full top-0 left-0 place-content-center z-10 " + (formState.value ? "grid" : "hidden")}>
      <div className={"address_form  w-full h-fit max-w-md inset-0 py-2 px-4 bg-white shadow-xl m-auto rounded-md "}>
        <div className='close_form text-end'>
          <i onClick={toggleAddressesFormState} className='bx bx-x text-red-400 border border-red-400 bg-red-50 rounded cursor-pointer text-lg'></i>
        </div>
        <div className='form_inputs'>
          <div className='full_name flex justify-between'>
            <div className='first_name'>
              <label htmlFor='firstName'>first name</label>
              <input type='text' placeholder='first name' />
            </div>
            <div className='last_name'>
              <label htmlFor='lastName'>last name</label>
              <input type='text' placeholder='last name' />
            </div>
          </div>
          <div className='address'>
            <label htmlFor='address'>address</label>
            <input type='text' placeholder='address' />
          </div>
          <div className='apartment'>
            <label htmlFor='apartment'>apartment</label>
            <input type='text' placeholder='apartment, suite, ect' />
          </div>
          <div className='city'>
            <label htmlFor='city'>city</label>
            <input type='text' placeholder='city' />
          </div>
          <div className='country_state flex justify-between'>
            <div className='country'>
              <label htmlFor='country'>country</label>
              <input type='text' placeholder='country' />
            </div>
            <div className='state'>
              <label htmlFor='state'>state</label>
              <input type='text' placeholder='state' />
            </div>
          </div>
          <div className='zipCode'>
            <label htmlFor='zipCode'>zip/Postal code</label>
            <input type='text' placeholder='zip/Postal code' />
          </div>
          <div className='phone'>
            <label htmlFor='phone'>phone</label>
            <input type='text' placeholder='phone' />
          </div>
        </div>
        <div className='save_address'>
          <button onClick={toggleAddressesFormState} className='border border-teal-500 text-teal-500 rounded-md w-full py-2 my-4 cursor-pointer hover:bg-teal-50'>
            save
          </button>
        </div>
      </div>
    </div>
  );
}
