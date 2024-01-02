import { CloseBuiltBoxButton, OpenBuiltBoxButton } from "../components/client/Buttons";
import Chosed_Item from "../components/Chosed_Item";
import Pagination from "../../components/Pagination";
import Product_item from "../components/Product_item";
import Step_intro from "../components/Step_intro";
import Filter from "@/app/components/Filter";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import GoToStepTwo from "../components/client/GoToStepTwo";
import { cookies } from "next/headers";

export default async function Step_one({ searchParams }: { searchParams: { cgid: string } }) {
  let { cgid } = searchParams;
  if (!cgid || cgid.trim().length == 0) {
    let storedCustomGiftId = cookies().get("customGiftId")?.value;
    if (!storedCustomGiftId) {
      redirect("/");
    }
    redirect("/build-a-memori_gift?step=one&cgid=" + storedCustomGiftId);
  }

  let customGift = await prisma.customGift.findUnique({
    where: {
      id: cgid,
    },
    include: {
      includes: {
        include: {
          item: true,
        },
      },
    },
  });

  if (!customGift) {
    redirect("/");
  }

  let items = await prisma.item.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className='step_two_section'>
      <div className='container'>
        <Step_intro step='1' title='CHOOSE YOUR ITEMS' desc="We've hand-selected the best products in one place. Select from the items below and fill up your box! Pick your products first and our program will automatically select the box size!" />
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
                </div>
                <div className='pagination_wrapper mt-auto'>
                  <Pagination />
                </div>
                <div className='next_step'>
                  <GoToStepTwo customGiftId={customGift.id} className='bg-teal-400 text-white text-center px-4 py-2 rounded-md mx-auto min-w-max w-2/5 block sm:hidden' />
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
            <div className='chosed_items custom-scroll-bar pb-20 sm:pb-0 sm:overflow-auto sm:mb-0'>
              {customGift?.includes.map(({ item, quantity, customGift_id }) => {
                let firstImage = JSON.parse(item.images)[0];
                let TotalPrice = item.price * quantity;
                return <Chosed_Item key={item.id} id={item.id} customGiftId={customGift_id} image={`${firstImage}`} name={item.name} quantity={quantity} totalPrice={TotalPrice} />;
              })}
            </div>
            {customGift?.includes.length == 0 ? (
              <div className='empty h-60 grid place-content-center'>
                <p className='text-sm text-slate-400'>there is no chosed items yet</p>
              </div>
            ) : null}
            <div className='check_out_box fixed bottom-0  bg-teal-50 w-full flex justify-between p-2 mt-auto sm:relative'>
              <div className='price'>
                <span className='text-sm '>Total Price:</span>
                <span className='text-sm ml-2'>${customGift?.price}</span>
              </div>
              <div className='next_step'>
                <GoToStepTwo customGiftId={customGift.id} className='bg-teal-400 text-white text-center px-4 py-2 rounded-md mx-auto min-w-max w-2/5 block' />
              </div>
            </div>
          </div>
        </aside>
      </section>
    </section>
  );
}
