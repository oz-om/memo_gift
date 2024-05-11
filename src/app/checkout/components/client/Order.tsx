import { deleteAction, duplicate } from "@/app/components/cart/actions";
import { toastStyles } from "@/utils";
import { Prisma } from "@prisma/client";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { setAddressToCartItem, updateItemCartAction } from "../../actions/action";

type cartItem = Prisma.cartItemGetPayload<{
  select: {
    id: true;
    quantity: true;
  };
  include: {
    customGift: {
      select: {
        id: true;
      };
      include: {
        includes: {
          select: {
            quantity: true;
          };
          include: {
            item: true;
          };
        };
      };
    };
    premade: {
      select: {
        id: true;
      };
      include: {
        includes: {
          include: {
            item: true;
          };
        };
      };
    };
    item: true;
    variant: true;
    postcard: true;
  };
}>;
export type T_Address = Prisma.AddressGetPayload<{
  select: {
    user_id: true;
    address: true;
    id: true;
  };
}>;

export default function Order({ cartItem, addresses, openAddressForm }: { cartItem: cartItem; addresses: T_Address[]; openAddressForm: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { id, customGift, premade, item, quantity, variant, postcard, empty_card, with_note, to, from, note } = cartItem;
  const [addressesListState, setAddressesListState] = useState(false);
  let order = customGift ?? premade ?? item;
  let withIncludes = customGift ?? premade;
  let totalPrice = Number(order?.price) * quantity;
  let [updatedTo, setUpdatedTo] = useState(empty_card ? "" : (to as string));
  let [updatedFrom, setUpdatedFrom] = useState(empty_card ? "" : (from as string));
  let [updatedNote, setUpdatedNote] = useState(with_note ? (note as string) : "");
  let [changed, setChanged] = useState(false);
  let alert = toast;
  let [availableAddresses, setAvailableAddresses] = useState<T_Address[]>(addresses);
  let [chosedAddress, setChosedAddress] = useState<string | null>(null);

  // when opening addresses list update available Addresses from cookies if there any new address .
  function toggleAddressesList() {
    // get local addresses
    let allAddresses = getCookie("addresses");
    const formattedAddresses: T_Address[] = JSON.parse(allAddresses ? (allAddresses as string) : "[]");
    // return  addresses ids that we have local
    const addressIdSet = new Set(formattedAddresses.map((address) => address.id));
    // return only the addresses that we have on available addresses and not exist on local to merge them with local addresses
    const availableNewAddresses = availableAddresses.filter((address) => !addressIdSet.has(address.id));
    // merge available addresses that doesn't exist on local with local addresses
    formattedAddresses.push(...availableNewAddresses);

    setAvailableAddresses(formattedAddresses);
    setAddressesListState((prev) => !prev);
  }
  // when address from is open, list of available addresses is hidden
  function toggleAddressesFormState() {
    openAddressForm(true);
    setAddressesListState((prev) => !prev);
  }

  async function updateCartItem() {
    if ((!empty_card && (!updatedTo.trim().length || !updatedFrom.trim().length)) || (with_note && !updatedNote.trim().length)) {
      alert.error("make sue your sender, receiver and note is not empty ", { style: toastStyles });
      return;
    }
    alert.loading("just a second...", { style: toastStyles });
    let res = await updateItemCartAction(id, {
      to: updatedTo,
      from: updatedFrom,
      note: updatedNote,
    });
    alert.remove();
    if (!res.success) {
      alert.error(res.error, { style: toastStyles });
      return;
    }
    alert.success("done", { style: toastStyles });
  }
  async function duplicateCartItem() {
    alert.loading("just a second...", { style: toastStyles });
    let res = await duplicate(id);
    alert.remove();
    if (!res.success) {
      alert.error(res.error, { style: toastStyles });
      return;
    }
    alert.success("done", { style: toastStyles });
  }
  async function deleteCartItem() {
    alert.loading("just a second...", { style: toastStyles });
    let res = await deleteAction(id, customGift ? "customGift" : "product");
    alert.remove();
    if (!res.delete) {
      alert.error(res.error, { style: toastStyles });
      return;
    }
    alert.success("done", { style: toastStyles });
  }

  async function choseAddress(address: string) {
    setChosedAddress(address);
    setAddressesListState((prev) => !prev);
    if (chosedAddress == address) {
      return;
    }
    alert.loading("just a second...", { style: toastStyles });
    let res = await setAddressToCartItem(address, id);
    alert.remove();
    if (!res.success) {
      alert.error(res.error, { style: toastStyles });
      setChosedAddress("");
      return;
    }
    alert.success("done", { style: toastStyles });
  }

  return (
    <div className='order bg-teal-50/10 p-2 rounded-md shadow-lg even:my-4'>
      <h4 className='text-sm flex justify-between items-center'>
        <span className='text-slate-500  '>order details:</span>
        {!empty_card && (
          <button onClick={updateCartItem} disabled={!changed} className='border border-blue-400 rounded px-1 text-blue-400 hover:bg-blue-50 disabled:opacity-25 disabled:cursor-not-allowed'>
            update
          </button>
        )}
      </h4>
      <div className='order_details_wrapper md:flex gap-x-2 justify-center'>
        <div className='order_details'>
          <div className='order_name flex justify-between px-4'>
            <h4 className='line-clamp-2 flex gap-x-2 items-center'>
              <span className='text-[10px] w-4 h-4 pt-[1px] grid place-content-center font-semibold border border-teal-50 bg-teal-500 text-teal-50 rounded-full'>{quantity}</span>
              <span>{customGift ? customGift.name ?? "custom gift" : order?.name}</span>
            </h4>
            <div className='price'>
              <span className='font-sans'>{totalPrice}$</span>
            </div>
          </div>
          <div className='order_includes_items whitespace-nowrap overflow-x-auto my-2 custom-scroll-bar'>
            {withIncludes ? (
              <figure className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden'>
                <Image src={`${variant?.preview}`} alt={`${variant?.name}`} width={250} height={250} />
              </figure>
            ) : (
              <figure className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden'>
                <Image src={`${JSON.parse(item!.images)[0]}`} alt={`${item?.name}`} width={250} height={250} />
              </figure>
            )}
            {withIncludes &&
              withIncludes.includes.map((include) => {
                let { item } = include;
                let firstImage = JSON.parse(item.images)[0];
                return (
                  <figure key={item.id} className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden'>
                    <Image src={firstImage} alt={item.name} width={250} height={250} />
                  </figure>
                );
              })}
          </div>
          <div className='order_manage flex justify-between'>
            <div className='duplicate_order w-40 text-teal-600 text-xs'>
              <button onClick={duplicateCartItem} className='underline'>
                Duplicate Gift for Another Recipient
              </button>
            </div>
            <div className='delete_order px-4 grid place-content-center rounded-md text-red-400 cursor-pointer hover:bg-red-50'>
              <button onClick={deleteCartItem}>delete</button>
            </div>
          </div>
          <div className='order_address_wrapper mt-4'>
            <div className='order_address relative'>
              {!chosedAddress && !cartItem.address ? (
                <div onClick={toggleAddressesList} className='chosed_address px-4 py-2 text-xs bg-white border-2 rounded-md cursor-pointer hover:bg-slate-100 md:max-w-xs lg:max-w-sm'>
                  <p>chose/create address</p>
                </div>
              ) : (
                <div onClick={toggleAddressesList} className='chosed_address px-4 py-2 text-xs bg-white border-2 rounded-md cursor-pointer hover:bg-slate-100 md:max-w-xs lg:max-w-sm'>
                  <p>{cartItem.address?.split("<*>").join(" ") ?? chosedAddress?.split("<*>").join(" ")}</p>
                </div>
              )}
              <ul className={"address_list absolute left-0 top-[90%] bg-slate-50 w-full rounded-b-md border-2 border-t-transparent md:max-w-xs lg:max-w-sm z-[1] " + (addressesListState ? "block" : "hidden")}>
                <li onClick={toggleAddressesFormState} className='new_address py-2 px-4 cursor-pointer hover:bg-teal-50 font-medium text-sm'>
                  new address
                </li>
                {availableAddresses.map((a, i) => {
                  let address = a.address.split("<*>").join(" ");
                  return (
                    <li key={i} onClick={() => choseAddress(a.address)} className=' py-2 px-4 cursor-pointer hover:bg-teal-50 text-xs'>
                      {address}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className='order_massage sm:flex mt-4 justify-center gap-x-2'>
          <div className='inputs grid grid-cols-2 gap-x-5 gap-y-4 md:block lg:grid'>
            <div className='to_input'>
              <label htmlFor='to'>to</label>
              <input
                disabled={empty_card}
                value={updatedTo}
                onInput={(e) => {
                  if (!empty_card) {
                    setUpdatedTo(e.currentTarget.value);
                    setChanged(true);
                  }
                }}
                type='text'
                id='to'
                placeholder='to'
                className='w-full px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light disabled:opacity-50'
              />
            </div>
            <div className='form_input'>
              <label htmlFor='from'>from</label>
              <input
                disabled={empty_card}
                value={updatedFrom}
                onInput={(e) => {
                  if (!empty_card) {
                    setUpdatedFrom(e.currentTarget.value);
                    setChanged(true);
                  }
                }}
                type='text'
                id='from'
                placeholder='from'
                className='w-full px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light disabled:opacity-50'
              />
            </div>
            <div className='massage col-span-2 md:mt-3'>
              <textarea
                disabled={!with_note}
                value={updatedNote}
                onInput={(e) => {
                  if (with_note) {
                    setUpdatedNote(e.currentTarget.value);
                    setChanged(true);
                  }
                }}
                name='massage'
                id='massage'
                placeholder='friendly message'
                className='w-full resize-none px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light disabled:opacity-50'
              ></textarea>
            </div>
          </div>
          {!!postcard ? (
            <figure className='max-w-xs mx-auto basis-1/4 md:basis-auto md:h-48 overflow-hidden rounded-md'>
              <Image src={`${postcard?.image}`} alt='Post Card' width={450} height={450} className='h-full' />
            </figure>
          ) : (
            <div className='no_postcard max-w-xs mx-auto basis-1/4 md:basis-auto md:h-48 overflow-hidden rounded-md'>
              <p>no post card</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
