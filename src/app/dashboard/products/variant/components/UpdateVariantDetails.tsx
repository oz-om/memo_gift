"use client";
import { T_confirmUploadsType, UPLOAD_URL, confirmUploadImages, toastStyles } from "@/utils";
import React from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import { updateVariantDetailsAction } from "../../action";
import { T_VariantProductType } from "../[variant_id]/page";
import { newUploadedImage } from "./VariantImages";

export type T_variantDetails = {
  name: string;
  preview: string;
  value: string;
};
export const variantUpdateDetails = signal<T_variantDetails>({
  name: "",
  preview: "",
  value: "",
});
type variantFieldKey = keyof T_variantDetails;

export default function UpdateVariantDetails({ variant }: { variant: T_VariantProductType }) {
  const { name, preview, value } = variant;
  // save the all postcard details to compare ist after with the variantUpdateDetails
  let originVariantDetails = {
    name: variant.name,
    preview: variant.preview,
    value: variant.value,
  };
  variantUpdateDetails.value = {
    name,
    preview,
    value,
  };
  async function updateVariantDetails() {
    let alert = toast;
    let variantDataUpdatedFields = {};
    let variantFieldKey: variantFieldKey;
    // // get only the updated fields with compare the data the we store at originPremadeDetails with the update data comes from premadeUpdateDetails signal
    for (variantFieldKey in originVariantDetails) {
      if (JSON.stringify(originVariantDetails[variantFieldKey]) !== JSON.stringify(variantUpdateDetails.value[variantFieldKey])) {
        variantDataUpdatedFields = {
          ...variantDataUpdatedFields,
          [variantFieldKey]: variantUpdateDetails.value[variantFieldKey],
        };
      }
    }

    alert.loading("just a second...", { style: toastStyles });
    // make a request to file manager to confirm our new uploads if exist
    let confirmUploadRes: T_confirmUploadsType | null = null;
    if (newUploadedImage.value.length > 0) {
      confirmUploadRes = await confirmUploadImages(newUploadedImage.value, "variant");
    }
    // if the response exists and its failed
    if (confirmUploadRes && !confirmUploadRes.confirmation) {
      alert.remove();
      alert.error(confirmUploadRes.error, { style: toastStyles });
      return;
    }

    // if upload is successful than update premade
    const updateAction = await updateVariantDetailsAction(variant.id, variantDataUpdatedFields);
    alert.remove();
    if (!updateAction.success) {
      alert.error(updateAction.error, { style: toastStyles });
      return;
    }
    // reset the uploads images is its not empty
    newUploadedImage.value = [];
    alert.success("Done", { style: toastStyles });
  }
  return (
    <button onClick={updateVariantDetails} className='px-2 py-1 bg-teal-400 text-white ml-auto w-20 block rounded hover:bg-teal-500'>
      update
    </button>
  );
}
