"use client";

import { toastStyles } from "@/utils";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useSignalEffect } from "signals-react-safe";
import { signal } from "signals-react-safe";
import { setCookie, getCookie } from "cookies-next";
import { Session } from "next-auth";
import { addNewAddress } from "../../actions/action";
import { T_Address } from "./Order";

export const formState = signal(false);
type T_AddressInfo = {
  first_name: string;
  last_name: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone: string;
};
type T_fieldKey = keyof T_AddressInfo;

export default function Address_form({ session }: { session: Session | null }) {
  const [r, setRerender] = useState(false);
  let [address, setAddress] = useState<T_AddressInfo>({
    first_name: "",
    last_name: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  function toggleAddressesFormState() {
    formState.value = false;
    setRerender(formState.value);
  }
  useSignalEffect(() => {
    if (formState.value) {
      setRerender(formState.value);
    }
  });
  function setAddressInfo(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.target;
    let field = input.name;
    setAddress((prev) => ({
      ...prev,
      [field]: input.value,
    }));
  }
  async function saveNewAddress() {
    let alert = toast;
    // check inputs validity
    let moroccanNumberPattern = /((^(0)(?=(7|6)))|(^(\+212|212)(?=(7|6)))).{9}/;
    let validNumber = moroccanNumberPattern.test(address.phone);
    let field: T_fieldKey;
    for (field in address) {
      if (address[field].trim().length == 0) {
        alert.error("all fields are required", { style: toastStyles });
        return;
      }
    }
    if (!validNumber) {
      alert.error("all fields are required", { style: toastStyles });
      return;
    }

    // saved address
    let addressString = "";
    for (field in address) {
      addressString += `${address[field]} `;
    }
    let fullAddress: T_Address = {
      address: addressString,
      user_id: "anonymous_user",
      id: crypto.randomUUID(),
    };

    if (session) {
      alert.loading("just a second...", { style: toastStyles });
      let res = await addNewAddress(session.user.id, addressString);
      alert.remove();
      if (!res.success) {
        alert.error(res.error, { style: toastStyles });
        return;
      }
      alert.success("done", { style: toastStyles });
      fullAddress = res.address;
    }

    let savedAddresses = getCookie("addresses");
    if (!savedAddresses) {
      setCookie("addresses", JSON.stringify([fullAddress]));
    } else {
      let allAddresses: T_Address[] = JSON.parse(savedAddresses);
      allAddresses.push(fullAddress);
      setCookie("addresses", JSON.stringify(allAddresses));
    }

    formRef.current?.reset();
    toggleAddressesFormState();
  }
  return (
    <>
      <form ref={formRef} action={saveNewAddress} className={"address_form z-10 fixed w-full h-fit max-w-md inset-0 py-2 px-4 bg-white shadow-xl m-auto rounded-md " + (formState.value ? "grid" : "hidden")}>
        <div className='close_form text-end'>
          <i onClick={toggleAddressesFormState} className='bx bx-x text-red-400 border border-red-400 bg-red-50 rounded cursor-pointer text-lg'></i>
        </div>
        <div className='form_inputs'>
          <div className='full_name flex justify-between gap-x-2'>
            <div className='first_name'>
              <label htmlFor='firstName'>first name</label>
              <input onChange={setAddressInfo} name='first_name' type='text' placeholder='first name' />
            </div>
            <div className='last_name'>
              <label htmlFor='lastName'>last name</label>
              <input onChange={setAddressInfo} name='last_name' type='text' placeholder='last name' />
            </div>
          </div>
          <div className='address'>
            <label htmlFor='address'>address</label>
            <input onChange={setAddressInfo} name='address' type='text' placeholder='address' />
          </div>
          <div className='apartment'>
            <label htmlFor='apartment'>apartment</label>
            <input onChange={setAddressInfo} name='apartment' type='text' placeholder='apartment, suite, ect' />
          </div>
          <div className='city'>
            <label htmlFor='city'>city</label>
            <input onChange={setAddressInfo} name='city' type='text' placeholder='city' />
          </div>
          <div className='country_state flex justify-between gap-x-2'>
            <div className='country'>
              <label htmlFor='country'>country</label>
              <input onChange={setAddressInfo} name='country' type='text' placeholder='country' />
            </div>
            <div className='state'>
              <label htmlFor='state'>state</label>
              <input onChange={setAddressInfo} name='state' type='text' placeholder='state' />
            </div>
          </div>
          <div className='zipCode'>
            <label htmlFor='zipCode'>zip/Postal code</label>
            <input onChange={setAddressInfo} name='zipcode' type='text' placeholder='zip/Postal code' />
          </div>
          <div className='phone'>
            <label htmlFor='phone'>phone</label>
            <input onChange={setAddressInfo} name='phone' type='text' placeholder='phone' />
          </div>
        </div>
        <div className='save_address'>
          <button type='submit' className='border border-teal-500 text-teal-500 rounded-md w-full py-2 my-4 cursor-pointer hover:bg-teal-50'>
            save
          </button>
        </div>
      </form>
      <div onClick={toggleAddressesFormState} className={"address_form_wrapper fixed w-full h-full top-0 left-0 bg-slate-400/25 " + (formState.value ? "block" : "hidden")}></div>
    </>
  );
}
