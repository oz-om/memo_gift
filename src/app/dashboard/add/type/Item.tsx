"use client";
import type { itemDataType, T_setInputsValue } from "@/types/types";
import { confirmUploadImages, toastStyles } from "@/utils";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import Input, { Textarea } from "../../components/client/inputs";
import { CategoriesInput } from "../../components/client/inputs/CategoriesInput";
import SubmitButton from "../../components/client/SubmitButton";
import ItemChosedImages from "../components/item/ItemChosedImages";
import Item_theme from "../components/item/Item_theme";

export const item = signal<itemDataType>({
  name: "",
  desc: "",
  categories: [],
  theme: "white-to-black",
  images: [],
  price: 0,
});

export const setItemInput: T_setInputsValue = (field, value) => {
  item.value = {
    ...item.value,
    [field]: value,
  };
};
type T_Item_Props = { action: (data: itemDataType) => Promise<any> };
export default function Item(props: T_Item_Props) {
  const { action } = props;
  let [reset, setReset] = useState(false);
  console.log("render item wrapper");

  async function publish() {
    console.log(item.value);
    let alert = toast;
    let { name, price, desc, images } = item.value;
    if (!name.trim().length || price < 1 || !desc.trim().length || !images.length) {
      alert.error("you missing a required field", { style: toastStyles });
      return;
    }
    // confirm uploads
    alert.loading("just a second...", { style: toastStyles });
    const confirmUploadRes = await confirmUploadImages(item.value.images, "item");
    if (confirmUploadRes.confirmation) {
      let req = await action(item.value);
      alert.remove();
      if (req.creation) {
        alert.success("done", { style: toastStyles });
        setReset(true);
      } else {
        alert.error(req.error, { style: toastStyles });
        console.error("there are a problem with item creation");
      }
    } else {
      alert.error(confirmUploadRes.error, { style: toastStyles });
      console.error("error with confirm uploads");
    }
  }

  // return reset to default
  useEffect(() => {
    if (reset == true) {
      setReset(false);
    }
  }, [reset]);
  return (
    <div className='add_item_wrapper'>
      <div className='form mb-20 px-3'>
        <div className='about_item md:flex md:gap-x-10 bg-white shadow rounded p-4 mb-5'>
          <div className='inputs_wrapper basis-1/2 max-w-lg'>
            <Input name='name' type='text' placeholder='name' setValue={setItemInput} reset={reset} />
            <Textarea name='desc' placeholder={"description"} setValue={setItemInput} reset={reset} />
            <CategoriesInput setValue={setItemInput} reset={reset} />
            <div className='item_theme_wrapper'>
              <Item_theme setTheme={setItemInput} reset={reset} />
            </div>
            <div className='price'>
              <Input setValue={setItemInput} name='price' type='number' placeholder={"price"} reset={reset} />
            </div>
          </div>
          <div className='items_photos_wrapper basis-1/2 md:max-w-lg flex flex-col'>
            <h4 className='capitalize mb-2 text-sm'>chose images:</h4>
            <ItemChosedImages />
          </div>
        </div>
        <div className='publish_wrapper'>
          <SubmitButton publish={publish} />
        </div>
      </div>
    </div>
  );
}
/*

*/
