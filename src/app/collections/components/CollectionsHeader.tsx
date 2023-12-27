import Filter from "@/app/components/Filter";
import React from "react";
import SwitchNav from "./client/SwitchNav";

export default function CollectionsHeader() {
  return (
    <section className='switch_collections_type mb-4'>
      <div className='container'>
        <div className='switch_collections_type_wrapper flex flex-col items-center'>
          <span className='text-center text-slate-500 text-xs mb-2'>switch between</span>
          <div className='collections flex items-center'>
            <SwitchNav />
          </div>
        </div>
        <div className='collections_desc text-slate-600 text-center text-sm mt-5'>
          <p className='max-w-xl mx-auto text-center'>
            here you can find all <i>premade gits</i> that we chose for you or you can chose <i>single items</i> as your needed to keep you free to make your collection
          </p>
        </div>
      </div>
      <Filter />
    </section>
  );
}
