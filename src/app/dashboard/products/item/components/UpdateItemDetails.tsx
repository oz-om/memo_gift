"use client";
import { T_confirmUploadsType, UPLOAD_URL, confirmUploadImages, toastStyles } from "@/utils";
import React from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import { updateItemDetailsAction } from "../../action";
import { T_ItemProductType } from "../[item_id]/page";
import { newUploadedImages } from "./ItemImages";

export type T_itemDetails = {
  name: string;
  price: number;
  desc: string;
  images: string;
  categories: string[];
};
export const itemUpdateDetails = signal<T_itemDetails>({
  name: "",
  price: 0,
  desc: "",
  images: "",
  categories: [],
});
type itemFieldKey = keyof T_itemDetails;

export default function UpdateItemDetails({ item }: { item: T_ItemProductType }) {
  const { name, price, desc, images, categories } = item;
  // save the all premade details to compare ist after with the premadeUpdateDetails
  let originItemDetails = {
    name: item.name,
    price: item.price,
    desc: item.desc,
    images: item.images,
    categories: item.categories.map(({ cat }) => cat.name),
  };
  itemUpdateDetails.value = {
    name: name,
    price: price,
    desc: desc,
    images: images,
    categories: categories.map(({ cat }) => cat.name),
  };
  async function updateItemDetails() {
    let alert = toast;
    let itemDataUpdatedFields = {};
    let itemRelatedDataUpdatedFields = {};
    let itemFieldKey: itemFieldKey;
    // // get only the updated fields with compare the data the we store at originPremadeDetails with the update data comes from premadeUpdateDetails signal
    for (itemFieldKey in originItemDetails) {
      if (JSON.stringify(originItemDetails[itemFieldKey]) !== JSON.stringify(itemUpdateDetails.value[itemFieldKey])) {
        if (itemFieldKey == "categories") {
          itemRelatedDataUpdatedFields = {
            ...itemRelatedDataUpdatedFields,
            [itemFieldKey]: itemUpdateDetails.value[itemFieldKey],
          };
        } else {
          itemDataUpdatedFields = {
            ...itemDataUpdatedFields,
            [itemFieldKey]: itemUpdateDetails.value[itemFieldKey],
          };
        }
      }
    }
    alert.loading("just a second...", { style: toastStyles });
    // make a request to file manager to confirm our new uploads if exist
    let confirmUploadRes: T_confirmUploadsType | null = null;
    if (newUploadedImages.value.length > 0) {
      confirmUploadRes = await confirmUploadImages(newUploadedImages.value, "item");
    }
    // if the confirm req happen and  response failed
    if (confirmUploadRes && !confirmUploadRes.confirmation) {
      alert.remove();
      alert.error(confirmUploadRes.error, { style: toastStyles });
      return;
    }
    // if upload is successful than update premade
    const updateAction = await updateItemDetailsAction(item.id, itemDataUpdatedFields, itemRelatedDataUpdatedFields);
    alert.remove();
    if (!updateAction.success) {
      alert.error(updateAction.error, { style: toastStyles });
      return;
    }
    // reset the uploads images is its not empty
    newUploadedImages.value = [];
    alert.success("Done", { style: toastStyles });
  }

  return (
    <button onClick={updateItemDetails} className='px-2 py-1 bg-teal-400 text-white ml-auto w-20 block rounded hover:bg-teal-500'>
      update
    </button>
  );
}
