import Pagination from "@/app/components/Pagination";
import { Metadata } from "next";
import CollectionsHeader from "../components/CollectionsHeader";
import PremadeProducts from "../components/PremadeProducts";
import FilteredDataProvider from "../context/Filter_Context";
import { getPremades } from "../actions";

export const metadata: Metadata = {
  title: "premade",
  description: "make memories beautiful with amazing gifts",
};

export default async function Premade() {
  return (
    <main>
      <FilteredDataProvider getData={getPremades} queryKey={"getPremades"}>
        <CollectionsHeader />
        <div className='collection_content_wrapper mt-5 relative'>
          <div className='container'>
            <PremadeProducts />
          </div>
        </div>
        <Pagination />
      </FilteredDataProvider>
    </main>
  );
}
