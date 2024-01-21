"use client";
import { toastStyles } from "@/utils";
import React from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import { updatePremadeDetailsAction } from "../action";
import { T_PremadeProductType } from "../[premade_id]/page";

type premadeVariant = {
  id: string;
  name: string;
  value: string;
  preview: string;
};
export type T_premadeDetails = {
  name: string;
  price: number;
  desc: string;
  images: string;
  variants: premadeVariant[];
  categories: string[];
};
export const premadeUpdateDetails = signal<T_premadeDetails>({
  name: "",
  price: 0,
  desc: "",
  images: "",
  variants: [],
  categories: [],
});
type premadeFieldKey = keyof T_premadeDetails;
export const reset = signal(false);
export default function UpdatePremadeDetails({ premade }: { premade: T_PremadeProductType }) {
  const { name, price, desc, images, variants, categories } = premade;
  let originPremadeDetails = {
    name: premade.name,
    price: premade.price,
    desc: premade.desc,
    images: premade.images,
    categories: premade.categories.map(({ cat }) => cat.name),
    variants: premade.variants.map(({ variant }) => ({ name: variant.name, id: variant.id, preview: variant.preview, value: variant.value })),
  };
  premadeUpdateDetails.value = {
    name: name,
    price: price,
    desc: desc,
    images: images,
    categories: categories.map(({ cat }) => cat.name),
    variants: variants.map(({ variant }) => ({ name: variant.name, id: variant.id, preview: variant.preview, value: variant.value })),
  };
  async function updatePremadeDetails() {
    reset.value = false;
    let alert = toast;
    let premadeDataUpdatedFields = {};
    let premadeRelatedDataUpdatedFields = {};
    let premadeFieldKey: premadeFieldKey;
    // get only the updated fields
    for (premadeFieldKey in originPremadeDetails) {
      if (JSON.stringify(originPremadeDetails[premadeFieldKey]) !== JSON.stringify(premadeUpdateDetails.value[premadeFieldKey])) {
        if (premadeFieldKey == "categories" || premadeFieldKey == "variants") {
          premadeRelatedDataUpdatedFields = {
            ...premadeRelatedDataUpdatedFields,
            [premadeFieldKey]: premadeUpdateDetails.value[premadeFieldKey],
          };
        } else {
          premadeDataUpdatedFields = {
            ...premadeDataUpdatedFields,
            [premadeFieldKey]: premadeUpdateDetails.value[premadeFieldKey],
          };
        }
      }
    }
    alert.loading("just a second...", { style: toastStyles });
    const res = await updatePremadeDetailsAction(premade.id, premadeDataUpdatedFields, premadeRelatedDataUpdatedFields);
    alert.remove();
    if (!res.success) {
      alert.error(res.error, { style: toastStyles });
      return;
    }
    reset.value = true;
    alert.success("Done", { style: toastStyles });
  }
  return (
    <button onClick={updatePremadeDetails} className='px-2 py-1 bg-teal-400 text-white ml-auto w-20 block rounded hover:bg-teal-500'>
      update
    </button>
  );
}
