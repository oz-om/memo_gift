"use client";
import { toastStyles } from "@/utils";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import Input from "../../components/client/inputs";
import { UploadInput } from "../../components/client/inputs/UploadInput";
import { createNewVariant } from "../../_actions/actions";
type images = {
  id: string;
  name: string;
};
type T_Variant = {
  name: string;
  value: string;
  images: images[];
};
const variant = signal<T_Variant>({
  name: "",
  value: "",
  images: [],
});
type T_FieldVariant = keyof T_Variant;
function setValue(fieldType: string, value: string) {
  variant.value = {
    ...variant.value,
    [fieldType]: value,
  };
}
let uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL as string;
export default function Variants() {
  let [reset, setReset] = useState(false);
  async function createVariant() {
    let alert = toast;
    let field: T_FieldVariant;
    for (field in variant.value) {
      if (variant.value[field].length == 0) {
        alert.error("please enter all fields");
        return;
      }
    }

    alert.loading("just a second...", { style: toastStyles });
    let req = await fetch(uploadUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variant.value.images),
    });
    let upload = await req.json();
    if (upload.confirmation) {
      let res = await createNewVariant({
        name: variant.value.name,
        value: variant.value.value,
        preview: variant.value.images[0].name,
      });
      alert.remove();
      if (!res.success) {
        alert.error(res.error, { style: toastStyles });
        return;
      }
      setReset(true);
      alert.success("done");
    } else {
      alert.remove();
      alert.error("something went wrong with upload file");
    }
  }
  // return reset to default
  useEffect(() => {
    if (reset == true) {
      setReset(false);
    }
  }, [reset]);
  return (
    <div className='variants_wrapper mb-20 px-3 max-w-4xl mx-auto bg-white shadow rounded  p-4'>
      <div className='add_variant'>
        <Input name='name' type='text' placeholder='name' setValue={setValue} reset={reset} />
        <Input name='value' type='text' placeholder='value' setValue={setValue} reset={reset} />
        <div className='uploads_wrapper my-4'>
          <h4 className='text-center text-slate-500 font-medium text-xs'>upload an image preview for the variant box</h4>
          <UploadInput setUploads={setValue} reset={reset} />
        </div>
      </div>
      <div className='publish_button'>
        <button onClick={createVariant} className='px-4 py-1 bg-teal-500 text-white rounded-md w-28 block ml-auto mr-5 hover:bg-teal-700'>
          publish
        </button>
      </div>
    </div>
  );
}
