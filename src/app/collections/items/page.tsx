import React, { Suspense } from "react";
import { Metadata } from "next";
import CollectionsHeader from "../components/CollectionsHeader";
import Pagination from "@/app/components/Pagination";
import ItemsProducts from "../components/ItemsProducts";
import LoadingSpin from "@/app/components/LoadingSpin";

export const metadata: Metadata = {
  title: "items",
  description: "make memories beautiful with amazing gifts",
};

export default async function Items() {
  return (
    <main>
      <CollectionsHeader />
      <div className='collection_content_wrapper mt-5 relative'>
        <div className='container'>
          <Suspense fallback={<LoadingSpin />}>
            {/* @ts-ignore async components */}
            <ItemsProducts />
          </Suspense>
        </div>
      </div>
      <Pagination />
    </main>
  );
}
