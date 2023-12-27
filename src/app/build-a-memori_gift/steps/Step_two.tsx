import Link from "next/link";
import { CloseBuiltBoxButton, OpenBuiltBoxButton } from "../components/client/Buttons";
import Chosed_Item from "../components/Chosed_Item";
import Pagination from "../../components/Pagination";
import Product_item from "../components/Product_item";
import Step_intro from "../components/Step_intro";
import Filter from "@/app/components/Filter";
import { prisma } from "@/lib/db/prisma";

export default async function Step_two() {
  let items = await prisma.item.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className='step_two_section'>
      <div className='container'>
        <Step_intro step='2' title='CHOOSE YOUR ITEMS' desc="We've hand-selected the best products in one place. Select from the items below and fill up your box! Pick your products first and our program will automatically select the box size!" />
      </div>

      <section className='step_two_content sm:flex sm:gap-x-3'>
        <section className='shoos_items_section sm:flex-[2] flex flex-col'>
          <Filter />
          <section className='items_content_section mt-2 h-full'>
            <div className='container h-full'>
              <div className='items_wrapper h-full flex flex-col'>
                <div className='items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
                  {items.map((item) => {
                    return <Product_item key={item.id} item={item} />;
                  })}
                  {items.length === 0 && (
                    <>
                      {/* <Product_item  />
                      <Product_item  />
                      <Product_item  />
                      <Product_item  />
                      <Product_item  />
                      <Product_item  />
                      <Product_item  />
                      <Product_item  /> */}
                    </>
                  )}
                </div>
                <div className='pagination_wrapper mt-auto'>
                  <Pagination />
                </div>
                <div className='next_step'>
                  <Link href={"?step=three"} className='bg-teal-400 text-white text-center px-4 py-2 rounded-md mx-auto min-w-max w-2/5 block sm:hidden'>
                    Next Step
                  </Link>
                </div>
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
            <div className='chosed_items custom-scroll-bar mb-11 sm:overflow-auto sm:mb-0'>
              <Chosed_Item image={"/images/step-one-pack-one.png"} name={"Gift Packaging, Card & Hand Wrapping"} quantity={1} totalPrice={12} />
              {/* <Chosed_Item image={"/images/items_01.png"} name={"PURPLE SPECKLED NORDIC MUG"} quantity={1} totalPrice={10} />
              <Chosed_Item image={"/images/items_02.png"} name={"OVERNIGHT LIP MASK || BIRTHDAY CAKE"} quantity={1} totalPrice={12} />
              <Chosed_Item image={"/images/items_03.png"} name={"BIRTHDAY CAKE BODY SCRUB"} quantity={1} totalPrice={22} /> */}
              {/* <Chosed_Item image={"/images/items_04.png"} name={"PRISM STEMLESS CHAMPAGNE FLUTE GLASSES (SET OF 2)"} quantity={1} totalPrice={12} /> */}
            </div>
            <div className='empty h-60 grid place-content-center'>
              <p className='text-sm text-slate-400'>there is no chosed items yet</p>
            </div>
            <div className='check_out_box  bg-teal-50 w-full flex justify-between p-2 mt-auto sm:relative'>
              <div className='price'>
                <span className='text-sm '>Total Price:</span>
                <span className='text-sm ml-2'>$120</span>
              </div>
              <div className='next_step'>
                <Link href={"?step=three"} className='bg-teal-400 text-white text-center px-4 py-2 rounded-md mx-auto min-w-max w-2/5 block'>
                  Next Step
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </section>
  );
}
