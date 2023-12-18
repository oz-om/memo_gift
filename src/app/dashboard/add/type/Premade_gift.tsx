"use client";

import Add_items_dialog from "../components/premade/Add_items_dialog";
import { OpenDialog } from "../components/client/Buttons";
import Custom_Checkbox from "../components/premade/Custom_Checkbox";
import { signal } from "signals-react-safe";
import type { premadeDataType } from "@/types/types";
import Input, { Textarea } from "../../components/client/inputs";
import { CategoriesInput } from "../../components/client/inputs/CategoriesInput";
import { UploadInput } from "../../components/client/inputs/UploadInput";
import SubmitButton from "../../components/client/SubmitButton";
import { useEffect, useState } from "react";
import Includes from "../components/premade/Includes";
import Price from "../components/premade/Price";
import ErrorMessage from "../../components/client/ErrorMessage";

export const premade = signal<premadeDataType>({
  name: "",
  desc: "",
  categories: [],
  variants: [],
  images: [],
  includes: [],
  price: 0,
});

export function setPremadeInput(fieldType: string, value: any) {
  premade.value = {
    ...premade.value,
    [fieldType]: value,
  };
}
let uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL as string;
export default function Premade_gift({ action }: { action: (data: premadeDataType) => Promise<any> }) {
  console.log("render premade wrapper");
  let [reset, setReset] = useState(false);
  let [confirmation, setConfirmation] = useState({
    confirmed: true,
    msg: "",
  });

  async function createPremade() {
    console.log(premade.value);

    let { name, desc, images, includes, price, variants } = premade.value;
    if (!name.trim().length || price < 1 || !desc.trim().length || !images.length || !includes.length || !variants.length) {
      alert("you missing a required field");
      return;
    }
    // for confirm uploads
    let req = await fetch(uploadUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(premade.value.images),
    });
    let res = await req.json();

    if (res.confirmation) {
      let req = await action(premade.value);
      console.log(req);

      if (req.creation) {
        setReset(true);
      } else {
        console.error("there are a problem with item creation");
        setConfirmation({
          confirmed: req.creation,
          msg: req.error,
        });
      }
    } else {
      console.error("error with confirm uploads");
      setConfirmation({
        confirmed: res.confirmation,
        msg: res.error,
      });
    }
  }

  useEffect(() => {
    if (reset) {
      setPremadeInput("variants", []);
      setReset(false);
    }
  }, [reset]);

  function closeErrorMessage() {
    setConfirmation({
      confirmed: true,
      msg: "",
    });
  }

  return (
    <section className='premade_gift_wrapper'>
      {confirmation.confirmed == false ? <ErrorMessage msg={confirmation.msg} close={closeErrorMessage} /> : ""}
      <div className='form mb-20 px-3'>
        <div className='about_premade md:flex md:gap-x-10'>
          <div className='inputs_wrapper basis-1/2 max-w-lg'>
            <Input name='name' type={"text"} placeholder='name' setValue={setPremadeInput} reset={reset} />
            <Textarea name='desc' placeholder={"description"} setValue={setPremadeInput} reset={reset} />
            <CategoriesInput setValue={setPremadeInput} reset={reset} />
            <div className='box_variant_wrapper'>
              <h4 className='capitalize text-sm'>box variants:</h4>
              <div className='box-variants_list max-w-sm'>
                <Custom_Checkbox id={"339256a2-dab1-4e4a-b7da-aae1aee1dc81"} key={"theme_id_01"} variantName={"mattel black"} variantTheme='bg-slate-600' reset={reset} />
                <Custom_Checkbox id={"5f86abf7-4f49-47d0-a55b-906c44ef7911"} key={"theme_id_02"} variantName={"origin crime"} variantTheme='bg-yellow-100' reset={reset} />
              </div>
            </div>
          </div>
          <div className='premade_photos_wrapper basis-1/2 md:max-w-lg'>
            <h4 className='capitalize mb-2 text-sm'>chose images:</h4>
            <UploadInput setUploads={setPremadeInput} reset={reset} />
          </div>
        </div>
        <div className='includes_wrapper pt-4'>
          <h4 className='capitalize text-sm flex justify-between items-center'>
            <p>includes:</p>
            <OpenDialog />
          </h4>
          <Includes />
        </div>
        <div className='price_wrapper mt-20'>
          <p className='capitalize text-sm'>computed price: </p>
          <Price />
        </div>
        <div className='publish_wrapper'>
          <SubmitButton publish={createPremade} />
        </div>
      </div>

      <Add_items_dialog reset={reset} />
    </section>
  );
}
