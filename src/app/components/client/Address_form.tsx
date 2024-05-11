import { toastStyles } from "@/utils";
import "../../assets/address_form.css";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import { setCookie, getCookie } from "cookies-next";
import { Session } from "next-auth";
import { T_Address, T_submitAddressAction } from "@/app/action";

export const formState = signal(false);
export type T_AddressInfo = {
  id: string;
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

type T_addressSubmitAction = (submitAddressAction: T_submitAddressAction) => Promise<{ success: true; address: T_Address } | { success: false; error: string }>;

export default function Address_form({ session, addressData, submitAddressAction, submitType, isOpen, setIsOpen }: { session: Session | null; addressData?: T_AddressInfo; submitAddressAction: T_addressSubmitAction; submitType: "create" | "update"; isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  let [address, setAddress] = useState<T_AddressInfo>(
    addressData ?? {
      first_name: "",
      last_name: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      phone: "",
      id: "placeholder",
    },
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  function toggleAddressesFormState() {
    setIsOpen(false);
    formRef.current?.reset();
  }

  function setAddressInfo(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.target;
    let field = input.name;
    setAddress((prev) => ({
      ...prev,
      [field]: input.value,
    }));
  }
  async function saveNewAddress() {
    const alert = toast;
    // check inputs validation
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
      if (field == "id") {
        continue;
      }
      addressString += `${address[field]}<*>`;
    }
    let fullAddress: T_Address = {
      address: addressString,
      user_id: "anonymous_user",
      id: crypto.randomUUID(),
    };

    if (session) {
      let res = await submitAddressAction({
        action: submitType,
        userId: session.user.id,
        addressId: addressData?.id ?? "",
        address: addressString,
      });
      if (!res.success) {
        alert.error(res.error, { style: toastStyles });
        return;
      }
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
    toggleAddressesFormState();
  }

  return (
    <>
      <form ref={formRef} action={() => startTransition(saveNewAddress)} className={"address_form z-10 fixed w-full h-fit max-w-md inset-0 py-2 px-4 bg-white shadow-xl m-auto rounded-md " + (isOpen ? "grid" : "hidden")}>
        <div className='close_form text-end'>
          <i onClick={toggleAddressesFormState} className='bx bx-x text-red-400 border border-red-400 bg-red-50 rounded cursor-pointer text-lg'></i>
        </div>
        <div className='form_inputs'>
          <div className='full_name flex justify-between gap-x-2'>
            <div className='first_name'>
              <label htmlFor='firstName'>first name</label>
              <input onChange={setAddressInfo} value={address.first_name} name='first_name' type='text' placeholder='first name' />
            </div>
            <div className='last_name'>
              <label htmlFor='lastName'>last name</label>
              <input onChange={setAddressInfo} value={address.last_name} name='last_name' type='text' placeholder='last name' />
            </div>
          </div>
          <div className='address'>
            <label htmlFor='address'>address</label>
            <input onChange={setAddressInfo} value={address.address} name='address' type='text' placeholder='address' />
          </div>
          <div className='apartment'>
            <label htmlFor='apartment'>apartment</label>
            <input onChange={setAddressInfo} value={address.apartment} name='apartment' type='text' placeholder='apartment, suite, ect' />
          </div>
          <div className='city'>
            <label htmlFor='city'>city</label>
            <input onChange={setAddressInfo} value={address.city} name='city' type='text' placeholder='city' />
          </div>
          <div className='country_state flex justify-between gap-x-2'>
            <div className='country'>
              <label htmlFor='country'>country</label>
              <input onChange={setAddressInfo} value={address.country} name='country' type='text' placeholder='country' />
            </div>
            <div className='state'>
              <label htmlFor='state'>state</label>
              <input onChange={setAddressInfo} value={address.state} name='state' type='text' placeholder='state' />
            </div>
          </div>
          <div className='zipCode'>
            <label htmlFor='zipCode'>zip/Postal code</label>
            <input onChange={setAddressInfo} value={address.zipcode} name='zipcode' type='text' placeholder='zip/Postal code' />
          </div>
          <div className='phone'>
            <label htmlFor='phone'>phone</label>
            <input onChange={setAddressInfo} value={address.phone} name='phone' type='text' placeholder='phone' />
          </div>
        </div>
        <div className='save_address'>
          <button disabled={pending} type='submit' className={"border border-teal-500 text-teal-500 rounded-md w-full py-2 my-4 cursor-pointer hover:bg-teal-50 " + (pending && "cursor-not-allowed")}>
            {pending ? "saving..." : "save"}
          </button>
        </div>
      </form>
      <div onClick={toggleAddressesFormState} className={"address_form_wrapper fixed w-full h-full top-0 left-0 bg-slate-400/25 " + (isOpen ? "block" : "hidden")}></div>
    </>
  );
}
