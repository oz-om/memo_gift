"use client";
import Input, { CategoriesInput, Textarea, UploadInput } from "../../components/Inputs";
import Add_items_dialog from "../components/premade/Add_items_dialog";
import Chosed_image from "../components/Chosed_image";
import { OpenDialog } from "../components/client/Buttons";
import Custom_Checkbox from "../components/premade/Custom_Checkbox";
import Item from "../components/Item";
import { signal } from "signals-react-safe";
import type { premadeDataType } from "@/types/types";

export const premade = signal<premadeDataType>({
  name: "",
  desc: "",
  categories: [],
  variants: [],
  images: [],
  includes: [],
  price: 0,
});

export function setPremadeInput({ fieldType, value }: { fieldType: string; value: any }) {
  premade.value = {
    ...premade.value,
    [fieldType]: value,
  };
}

export default function Premade_gift() {
  console.log("render premade wrapper");
  function addPremade() {
    console.log(premade.value);
  }
  return (
    <section className='premade_gift_wrapper'>
      <div className='form mb-20 px-3'>
        <div className='about_premade md:flex md:gap-x-10'>
          <div className='inputs_wrapper basis-1/2 max-w-lg'>
            <Input name='name' type={"text"} placeholder='name' setValue={setPremadeInput} />
            <Textarea name='desc' placeholder={"description"} setValue={setPremadeInput} />
            <CategoriesInput setValue={setPremadeInput} />
            <div className='box_variant_wrapper'>
              <h4 className='capitalize text-sm'>box variants:</h4>
              <div className='box-variants_list max-w-sm'>
                <Custom_Checkbox key={"theme_id_01"} setVariants={setPremadeInput} id={"theme_id_01"} variantName={"mattel black"} variantTheme='bg-slate-600' />
                <Custom_Checkbox key={"theme_id_02"} setVariants={setPremadeInput} id={"theme_id_02"} variantName={"origin crime"} variantTheme='bg-yellow-100' />
              </div>
            </div>
          </div>
          <div className='premade_photos_wrapper basis-1/2 md:max-w-lg'>
            <h4 className='capitalize mb-2 text-sm'>chose images:</h4>
            <UploadInput />
            <div className='chosed_images_wrapper'>
              <div className='images my-2 grid gap-5 grid-cols-[repeat(auto-fit,_theme(width.28))] justify-center'>
                <Chosed_image image={"/images/premade_chosed_image_01.png"} />
                <Chosed_image image={"/images/premade_chosed_image_02.png"} />
                <Chosed_image image={"/images/premade_chosed_image_03.png"} />
                <Chosed_image image={"/images/premade_chosed_image_04.png"} />
              </div>
              <p className='text-slate-400 text-center text-xs py-2 border rounded-md mb-2'>there is no images added yet</p>
            </div>
          </div>
        </div>
        <div className='includes_wrapper pt-4'>
          <h4 className='capitalize text-sm flex justify-between items-center'>
            <p>includes:</p>
            <OpenDialog />
          </h4>
          <div className='includes_content  px-4'>
            <div className='includes grid gap-5 grid-cols-2 min-[350px]:grid-cols-3 min-[530px]:grid-cols-4 min-[950px]:grid-cols-5 lg:grid-cols-7'>
              <Item name={"the first added item"} price={120} image={"/images/items_01.png"} />
              <Item name={"the second item"} price={120} image={"/images/items_02.png"} />
              <Item name={"the third added item"} price={120} image={"/images/items_03.png"} />
            </div>
            {/* <p className='text-slate-400 text-center text-xs py-2 border rounded-md mb-2'>there is no items added yet</p> */}
          </div>
        </div>
        <div className='price_wrapper mt-20'>
          <p className='capitalize text-sm'>computed price: </p>
          <div className='price flex items-center gap-x-2 ml-4 mt-2'>
            <input className='font-semibold w-14 border outline-none' readOnly value={"120$"} />
            <button className='text-xs text-teal-500'>edit</button>
          </div>
        </div>
        <div className='publish_wrapper'>
          <button onClick={addPremade} className='px-4 py-1 bg-teal-500 text-white rounded-md w-28 block ml-auto mr-5 hover:bg-teal-700'>
            publish
          </button>
        </div>
      </div>
      <Add_items_dialog />
    </section>
  );
}
