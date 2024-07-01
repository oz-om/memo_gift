"use client";
import { deleteAddress, submitAddressAction } from "@/app/action";
import { T_AddressInfo } from "@/app/components/client/Address_form";
import dynamic from "next/dynamic";
import { Session } from "next-auth";
import React, { useState } from "react";
import Lazy_Loading_Spin from "@/app/components/Lazy_Loading_Spin";
import toast from "react-hot-toast";
import { toastStyles } from "@/utils";
import { setCookie, getCookie } from "cookies-next";

const Address_form = dynamic(() => import("@/app/components/client/Address_form"), {
  loading: () => <Lazy_Loading_Spin />,
});

export default function User_Addresses({ addresses, session }: { session: Session | null; addresses: { id: string; address: string; user_id: string }[] }) {
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [editedAddress, setEditedAddress] = useState<T_AddressInfo | undefined>({
    first_name: "",
    last_name: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: "",
    id: "",
  });
  const [formAddressAction, setAddressFormAction] = useState<"create" | "update">("create");

  const alert = toast;

  function openAddressFormHandler() {
    setEditedAddress(undefined);
    setAddressFormAction("create");
    setOpenAddressForm(true);
  }

  function editedAddressHandler(address: string, addressId: string) {
    const extractedAddress = address.split("<*>");

    const loopEnd = extractedAddress.length;
    let loopIndex = 0;
    let addressBox: T_AddressInfo = {
      first_name: "",
      last_name: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      phone: "",
      id: "",
    };
    let addressField: keyof T_AddressInfo;
    for (addressField in addressBox) {
      if (loopIndex < loopEnd) {
        addressBox[addressField] = extractedAddress[loopIndex];
        loopIndex++;
      }
    }

    addressBox.id = addressId;
    setEditedAddress(addressBox);
    setAddressFormAction("update");
    setOpenAddressForm(true);
  }
  async function deleteAddressHandler(addressId: string, { currentTarget }: React.MouseEvent<HTMLElement, MouseEvent>) {
    alert.loading("just a second...", { style: toastStyles });
    currentTarget.style.pointerEvents = "none";

    const addressDeleteRes = await deleteAddress(addressId);
    alert.remove();
    if (!addressDeleteRes.success) {
      alert.error(`${addressDeleteRes.error}`, { style: toastStyles });
      currentTarget.style.pointerEvents = "auto";
      return;
    }
    const localAddress = getCookie("addresses");
    const formattedLocalAddress: { id: string }[] = JSON.parse(localAddress ? (localAddress as string) : "[]");
    const updatedLocalAddresses = formattedLocalAddress.filter((localAddress) => localAddress.id !== addressId);
    setCookie("addresses", JSON.stringify(updatedLocalAddresses));
  }

  return (
    <div className='container mt-5'>
      <div className='flex justify-between items-center mb-2'>
        <h4 className='font-medium uppercase'>addresses:</h4>
        <div className='add_new'>
          <button onClick={openAddressFormHandler} className='text-teal-500 bg-slate-100 border border-teal-400 rounded px-2 text-sm font-light'>
            add new
          </button>
        </div>
      </div>

      <ul className='flex flex-col gap-y-2'>
        {addresses.map((address) => {
          const formateAddress = address.address.split("<*>").join(" ");
          return (
            <li key={address.id} className='flex items-center border rounded shadow'>
              <p className='break-words px-2 line-clamp-2'>{formateAddress}</p>
              <div className='actions flex justify-center gap-x-2 basis-12 border-l px-2'>
                <i onClick={() => editedAddressHandler(address.address, address.id)} className='bx bxs-edit-alt text-teal-400 bg-slate-100 rounded cursor-pointer'></i>
                <i onClick={(e) => deleteAddressHandler(address.id, e)} className='bx bxs-trash  text-red-400 bg-red-50 border-red-600 rounded cursor-pointer'></i>
              </div>
            </li>
          );
        })}
        {!addresses.length && <p className='py-5 border rounded px-2 text-slate-400 text-sm'>there is no addresses added yet! add one?</p>}
      </ul>
      {openAddressForm && <Address_form userId={session?.user.id || null} addressData={editedAddress} submitAddressAction={submitAddressAction} submitType={formAddressAction} setIsOpen={setOpenAddressForm} isOpen={openAddressForm} />}
    </div>
  );
}
