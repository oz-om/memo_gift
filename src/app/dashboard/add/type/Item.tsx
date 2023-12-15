"use client";
import type { itemDataType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { effect, signal } from "signals-react-safe";
import ErrorMessage from "../../components/client/ErrorMessage";
import Input, { Textarea } from "../../components/client/inputs";
import { CategoriesInput } from "../../components/client/inputs/CategoriesInput";
import { UploadInput } from "../../components/client/inputs/UploadInput";
import SubmitButton from "../../components/client/SubmitButton";
import Item_theme from "../components/item/Item_theme";

export const item = signal<itemDataType>({
  name: "",
  desc: "",
  categories: [],
  theme: "white-to-black",
  images: [],
  price: 0,
});

export async function setItemInput(fieldType: string, value: any) {
  item.value = {
    ...item.value,
    [fieldType]: value,
  };
}

export default function Item({ action }: { action: (data: itemDataType) => Promise<any> }) {
  let [confirmation, setConfirmation] = useState<{ confirmed: boolean; msg: string }>({ confirmed: true, msg: "" });
  let [reset, setReset] = useState<boolean>(false);
  console.log("render item wrapper");

  async function publish() {
    console.log(item.value);

    let { name, price, desc, images } = item.value;
    if (!name.trim().length || price < 1 || !desc.trim().length || !images.length) {
      alert("you missing a required field");
      return;
    }
    let req = await action(item.value);
    console.log(req);
    if (req.creation) {
      let req = await fetch("/api/upload", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item.value.images),
      });
      let res = await req.json();
      if (res.confirmation) {
        setReset(true);
      } else {
        console.error("error with confirm uploads");
        setConfirmation({
          confirmed: res.confirmation,
          msg: res.error,
        });
      }
    } else {
      console.error("there are a problem with item creation");
      setConfirmation({
        confirmed: req.creation,
        msg: req.error,
      });
    }
  }
  function closeErrorMessage() {
    setConfirmation({
      confirmed: true,
      msg: "",
    });
  }
  // return reset to default
  useEffect(() => {
    if (reset == true) {
      setReset(false);
    }
  }, [reset]);
  return (
    <div className='add_item_wrapper'>
      {confirmation.confirmed == false ? <ErrorMessage msg={confirmation.msg} close={closeErrorMessage} /> : ""}
      <div className='form mb-20 px-3'>
        <div className='about_item md:flex md:gap-x-10'>
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
          <div className='premade_photos_wrapper basis-1/2 md:max-w-lg'>
            <h4 className='capitalize mb-2 text-sm'>chose images:</h4>
            <UploadInput setUploads={setItemInput} reset={reset} />
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
