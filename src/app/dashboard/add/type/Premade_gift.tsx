"use client";
import dynamic from "next/dynamic";
// import Add_items_dialog from "../components/premade/Add_items_dialog";
import { OpenAddPremadeIncludesDialog } from "../components/client/Buttons";
import Custom_Checkbox from "../components/premade/Custom_Checkbox";
import { signal } from "signals-react-safe";
import type { T_PremadeData, T_PremadeVariant, T_setInputsValue } from "@/types/types";
import Input, { Textarea } from "../../components/client/inputs";
import { CategoriesInput } from "../../components/client/inputs/CategoriesInput";
import SubmitButton from "../../components/client/SubmitButton";
import { useEffect, useState } from "react";
import Includes from "../components/premade/Includes";
import Price from "../components/premade/Price";
import { toast } from "react-hot-toast";
import { confirmUploadImages, toastStyles } from "@/utils";
import PremadeChosedImages from "../components/premade/PremadeChosedImages";
import Lazy_Loading_Spin from "@/app/components/Lazy_Loading_Spin";
import FilterContextProvider from "../context/Filter_Context";
const Add_items_dialog = dynamic(() => import("../components/premade/Add_items_dialog"), {
  loading: () => <Lazy_Loading_Spin />,
});

export const premade = signal<T_PremadeData>({
  name: "",
  desc: "",
  categories: [],
  variants: [],
  images: [],
  includes: [],
  price: 0,
});

export const setPremadeInput: T_setInputsValue = (field, value) => {
  premade.value = {
    ...premade.value,
    [field]: value,
  };
};
type T_PremadeGiftProps = { action: (data: T_PremadeData) => Promise<{ creation: true } | { creation: false; error: string }>; variants: T_PremadeVariant[] };

export default function Premade_gift(props: T_PremadeGiftProps) {
  console.log("render premade wrapper");
  const { action, variants } = props;
  let [reset, setReset] = useState(false);
  let [openAddIncludesDialog, setOpenAddIncludesDialog] = useState(false);

  async function createPremade() {
    let alert = toast;

    let { name, desc, images, includes, price, variants } = premade.value;
    if (!name.trim().length || price < 1 || !desc.trim().length || !images.length || !includes.length || !variants.length) {
      alert.error("you missing a required field", {
        style: toastStyles,
      });
      return;
    }
    alert.loading("just a second...", { style: toastStyles });
    // for confirm uploads
    const confirmUploadRes = await confirmUploadImages(premade.value.images, "premade");
    // if upload is successful than create premade
    if (confirmUploadRes.confirmation) {
      let req = await action(premade.value);
      if (req.creation) {
        alert.remove();
        alert.success("successfully created", { style: toastStyles });
        setReset(true);
      } else {
        alert.error(req.error, { style: toastStyles });
        console.error(req.error);
      }
    } else {
      alert.error(confirmUploadRes.error, { style: toastStyles });
      console.error(confirmUploadRes.error);
    }
  }

  useEffect(() => {
    if (reset) {
      setPremadeInput("variants", []);
      setReset(false);
    }
  }, [reset]);

  return (
    <section className='premade_gift_wrapper'>
      <div className='form mb-20 px-3'>
        <div className='about_premade md:flex md:gap-x-10 bg-white mb-5 px-2 py-4 shadow-md rounded'>
          <div className='inputs_wrapper basis-1/2 max-w-lg'>
            <Input name='name' type={"text"} placeholder='name' setValue={setPremadeInput} reset={reset} />
            <Textarea name='desc' placeholder={"description"} setValue={setPremadeInput} reset={reset} />
            <CategoriesInput setValue={setPremadeInput} reset={reset} />
            <div className='box_variant_wrapper'>
              <h4 className='capitalize text-sm'>box variants:</h4>
              <div className='box-variants_list max-w-sm'>
                {variants.map(({ id, name, value }) => {
                  return <Custom_Checkbox id={id} key={id} name={name} value={value} reset={reset} />;
                })}
              </div>
            </div>
          </div>
          <div className='premade_photos_wrapper basis-1/2 md:max-w-lg flex flex-col'>
            <h4 className='capitalize mb-2 text-sm'>chosed images:</h4>
            <PremadeChosedImages />
          </div>
        </div>
        <div className='includes_wrapper py-4 px-2 bg-white  shadow-md rounded'>
          <h4 className='capitalize text-sm flex justify-between items-center'>
            <p>includes:</p>
            <OpenAddPremadeIncludesDialog importDialog={setOpenAddIncludesDialog} isImported={openAddIncludesDialog} />
          </h4>
          <Includes />
        </div>
        <div className='price_wrapper mt-20'>
          <p className='capitalize text-sm'>computed price: </p>
          <Price readOnly={true} setValue={setPremadeInput} />
        </div>
        <div className='publish_wrapper'>
          <SubmitButton publish={createPremade} />
        </div>
      </div>
      {openAddIncludesDialog && (
        <FilterContextProvider>
          <Add_items_dialog reset={reset} />
        </FilterContextProvider>
      )}
    </section>
  );
}
