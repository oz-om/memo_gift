import React from "react";
import { Metadata } from "next";
import CollectionsHeader from "../components/CollectionsHeader";
import Pagination from "@/app/components/Pagination";
import ItemsProducts from "../components/ItemsProducts";
import FilteredDataProvider from "../context/Filter_Context";
import { getItems } from "../actions";

export const metadata: Metadata = {
  title: "items",
  description: "make memories beautiful with amazing gifts",
};

export default async function Items() {
  return (
    <main>
      <FilteredDataProvider getData={getItems} queryKey='getItems'>
        <CollectionsHeader />
        <div className='collection_content_wrapper mt-5 relative'>
          <div className='container'>
            <ItemsProducts />
          </div>
        </div>
        <Pagination />
      </FilteredDataProvider>
    </main>
  );
}
