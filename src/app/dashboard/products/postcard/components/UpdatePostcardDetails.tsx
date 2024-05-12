"use client";
import { T_confirmUploadsType, UPLOAD_URL, confirmUploadImages, toastStyles } from "@/utils";
import React from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import { updatePostcardDetailsAction } from "../../action";
import { T_PostcardProductType } from "../[postcard_id]/page";
import { newUploadedImage } from "./PostcardImages";

export type T_postcardDetails = {
  name: string;
  image: string;
};
export const postcardUpdateDetails = signal<T_postcardDetails>({
  name: "",
  image: "",
});
type postcardFieldKey = keyof T_postcardDetails;

export default function UpdatePostcardDetails({ postcard }: { postcard: T_PostcardProductType }) {
  const { name, image } = postcard;
  // save the all postcard details to compare ist after with the postcardUpdateDetails
  let originPostcardDetails = {
    name: postcard.name,
    image: postcard.image,
  };
  postcardUpdateDetails.value = {
    name: name,
    image: image,
  };
  async function updatePostcardDetails() {
    let alert = toast;
    let postcardDataUpdatedFields = {};
    let postcardFieldKey: postcardFieldKey;
    // // get only the updated fields with compare the data the we store at originPremadeDetails with the update data comes from premadeUpdateDetails signal
    for (postcardFieldKey in originPostcardDetails) {
      if (JSON.stringify(originPostcardDetails[postcardFieldKey]) !== JSON.stringify(postcardUpdateDetails.value[postcardFieldKey])) {
        postcardDataUpdatedFields = {
          ...postcardDataUpdatedFields,
          [postcardFieldKey]: postcardUpdateDetails.value[postcardFieldKey],
        };
      }
    }
    alert.loading("just a second...", { style: toastStyles });
    // make a request to file manager to confirm our new uploads if exist
    let confirmUploadRes: T_confirmUploadsType | null = null;
    if (newUploadedImage.value.length > 0) {
      confirmUploadRes = await confirmUploadImages(newUploadedImage.value, "card");
    }
    // if the response exists and its failed
    if (confirmUploadRes && !confirmUploadRes.confirmation) {
      alert.remove();
      alert.error(confirmUploadRes.error, { style: toastStyles });
      return;
    }

    // if upload is successful than update premade
    const updateAction = await updatePostcardDetailsAction(postcard.id, postcardDataUpdatedFields);
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
    <button onClick={updatePostcardDetails} className='px-2 py-1 bg-teal-400 text-white ml-auto w-20 block rounded hover:bg-teal-500'>
      update
    </button>
  );
}
