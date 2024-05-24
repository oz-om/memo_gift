import { CloseBuiltBoxButton, OpenBuiltBoxButton } from "../components/client/Buttons";
import Step_intro from "../components/Step_intro";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ProductItems from "../components/ProductItems";
import { Suspense } from "react";
import LoadingSpin from "@/app/components/LoadingSpin";
import ChosedItems from "../components/ChosedItems";
import Filter_Items from "../components/client/Filter_Items";
import Pagination from "../components/client/Pagination";
import FilteredDataProvider from "../context/Filter_Context";

export default async function Step_one({ searchParams }: { searchParams: { cgid: string } }) {
  let { cgid } = searchParams;
  if (!cgid || cgid.trim().length == 0) {
    let storedCustomGiftId = cookies().get("customGiftId")?.value;
    if (!storedCustomGiftId) {
      redirect("/");
    }
    redirect("/build-a-memori_gift?step=one&cgid=" + storedCustomGiftId);
  }

  return (
    <section className='step_two_section'>
      <div className='container'>
        <Step_intro step='1' title='CHOOSE YOUR ITEMS' desc="We've hand-selected the best products in one place. Select from the items below and fill up your box! Pick your products first and our program will automatically select the box size!" />
      </div>
      <FilteredDataProvider>
        <section className='step_two_content sm:flex sm:gap-x-3'>
          <section className='shoos_items_section sm:flex-[2] flex flex-col'>
            <Filter_Items />
            <section className='items_content_section mt-2 h-full'>
              <div className='container h-full'>
                <div className='items_wrapper h-full flex flex-col'>
                  {cgid && <ProductItems />}
                  <div className='pagination_wrapper mt-auto'>
                    <Pagination />
                  </div>
                  {/* <div className='next_step'>
                  <GoToStepTwo customGiftId={cgid} className='bg-teal-400 text-white text-center px-4 py-2 rounded-md mx-auto min-w-max w-2/5 block sm:hidden' />
                </div> */}
                </div>
              </div>
            </section>
          </section>
          <OpenBuiltBoxButton />
          <aside className='chosed_collection_section fixed top-0 w-full h-full sm:h-auto bg-white left-[100vw] transition-[left] overflow-scroll sm:overflow-visible sm:flex-[1] sm:relative sm:left-auto  custom-scroll-bar'>
            <div className='built_box_title_wrapper flex py-4 border-b border-teal-300 sm:py-0'>
              <CloseBuiltBoxButton />
              <div className='built_box_title grow grid justify-items-center'>
                <h4 className='text-2xl uppercase flex gap-x-2'>
                  your{" "}
                  <span className='text-teal-400 inline-flex items-center'>
                    <lord-icon src='https://cdn.lordicon.com/pgmktfgp.json' style={{ width: "30px", height: "30px" }} trigger='hover' colors='primary:#9cf4df,secondary:#848484'></lord-icon>
                    <span>box</span>
                  </span>{" "}
                  content
                </h4>
              </div>
            </div>
            <div className='chosed_items_wrapper h-[calc(100%_-_33px)] flex flex-col'>
              <Suspense fallback={<LoadingSpin />}>
                {/* @ts-ignore async components */}
                <ChosedItems customGiftId={cgid} />
              </Suspense>
            </div>
          </aside>
        </section>
      </FilteredDataProvider>
    </section>
  );
}
