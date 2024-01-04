import LoadingSpin from "@/app/components/LoadingSpin";
import Pagination from "@/app/components/Pagination";
import { Metadata } from "next";
import { Suspense } from "react";
import CollectionsHeader from "../components/CollectionsHeader";
import PremadeProducts from "../components/PremadeProducts";

export const metadata: Metadata = {
  title: "premade",
  description: "make memories beautiful with amazing gifts",
};

export default async function Premade() {
  return (
    <main>
      <CollectionsHeader />
      <div className='collection_content_wrapper mt-5 relative'>
        <div className='container'>
          <Suspense fallback={<LoadingSpin />}>
            {/* @ts-ignore  async component*/}
            <PremadeProducts />
          </Suspense>
        </div>
      </div>
      <Pagination />
    </main>
  );
}
