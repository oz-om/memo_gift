"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { premadeUpdateDetails } from "./UpdatePremadeDetails";
type T_variant = { id: string; name: string; value: string; preview: string };

export default function PremadeVariants({ variants, getAllVariants }: { variants: { variant: { id: string; name: string; value: string; preview: string } }[]; getAllVariants: () => Promise<T_variant[]> }) {
  const [premadeVariants, setPremadeVariants] = useState<T_variant[]>(variants.map((variant) => variant.variant));
  const [allVariants, setAllVariants] = useState<T_variant[]>([]);

  const [loading, setLoading] = useState(true);
  const allVariantsElement = useRef<HTMLUListElement | null>(null);
  const allVariantsElementOverlay = useRef<HTMLDivElement | null>(null);

  async function viewAllVAriants() {
    if (allVariants.length == 0) {
      setLoading(true);
    }
    if (allVariantsElement.current && allVariantsElementOverlay.current) {
      allVariantsElementOverlay.current.classList.remove("hidden");
      allVariantsElement.current.classList.remove("hidden");
    }
    const variants = await getAllVariants();
    setLoading(false);
    setAllVariants(variants);
  }
  function closeAllVariantsElement() {
    if (allVariantsElement.current && allVariantsElementOverlay.current) {
      allVariantsElementOverlay.current.classList.add("hidden");
      allVariantsElement.current.classList.add("hidden");
    }
  }
  function updatePremadeVariants(variant: T_variant, targetVariant: HTMLButtonElement) {
    premadeUpdateDetails.value.variants = [...premadeUpdateDetails.value.variants, variant];
    setPremadeVariants(premadeUpdateDetails.value.variants);
    targetVariant.disabled = true;
  }
  function deleteVariant(variantId: string) {
    let kippedVariants = premadeVariants.filter((v) => v.id !== variantId);
    premadeUpdateDetails.value.variants = [...kippedVariants];
    setPremadeVariants(kippedVariants);
  }
  return (
    <div className='variants bg-blue-50 p-2 rounded'>
      <h4 className='text-slate-600'>variants: </h4>
      <div className=''>
        {premadeVariants.map((variant) => {
          return (
            <div key={variant.id} className='variant flex justify-between items-center border-b py-1'>
              <p className='px-3 py1 rounded text-teal-400' style={{ backgroundColor: variant.value }}>
                {variant.name}
              </p>
              <div onClick={() => deleteVariant(variant.id)} className='delete text-red-400 text-sm hover:bg-red-50 px-2 py-1 rounded'>
                delete
              </div>
            </div>
          );
        })}
      </div>
      <div className='add_new_variant mt-5 relative border-slate-300 border-b-2 pb-5'>
        <button onClick={viewAllVAriants} className='bg-blue-400 text-teal-50 border-teal-100 rounded w-20 hover:bg-blue-500 ml-auto block'>
          add new
        </button>
        <div ref={allVariantsElementOverlay} onClick={closeAllVariantsElement} className='overlay fixed top-0 left-0 w-full h-full hidden'></div>
        <ul ref={allVariantsElement} className='all_variants absolute bottom-[115%] right-0 p-3 bg-white rounded border shadow-md hidden'>
          {allVariants.map((variant) => {
            const isExist = !!premadeVariants.find((v) => v.id == variant.id);
            return (
              <li key={variant.id} className=' flex rounded even:bg-blue-50 my-2 p-2'>
                <figure>
                  <Image src={variant.preview} alt={"variant preview"} width={80} height={80} />
                </figure>
                <div className='action flex flex-col'>
                  <div className='name'>
                    <p>{variant.name}</p>
                  </div>
                  <div className='add mt-auto text-end'>
                    <button onClick={({ currentTarget }) => updatePremadeVariants(variant, currentTarget)} disabled={isExist} className='text-blue-400 text-sm disabled:text-slate-300'>
                      add
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {loading && (
            <div className={"w-28 h-40 grid place-content-center"}>
              <p>loading...</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
