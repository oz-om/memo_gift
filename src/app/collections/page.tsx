import { prisma } from "@/lib/db/prisma";
import { Item as ItemType, PremadeGift } from "@prisma/client";
import Link from "next/link";
import Pagination from "../components/Pagination";
import Item from "./components/Item";
type collectionsType = ItemType | PremadeGift;
export default async function Collections({ searchParams: { type } }: { searchParams: { type: string } }) {
  let collections: collectionsType[] = [];

  if (type == "premade") {
    collections = await prisma.premadeGift.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    collections = await prisma.item.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return (
    <>
      <section className='switch_collections_type mb-4'>
        <div className='container'>
          <div className='switch_collections_type_wrapper flex flex-col items-center'>
            <span className='text-center text-slate-500 text-xs mb-2'>switch between</span>
            <div className='collections flex items-center'>
              <Link href={"?type=premade"} className={"collection premade relative left-4 pr-10 whitespace-nowrap basis-32 flex-shrink-0 bg-teal-50 px-2 py-1 border border-dashed border-r-transparent rounded-l-md " + (type == "premade" && "active-collection")}>
                pre made gifts
              </Link>
              <Link href={"?type=items"} className={"collection items hee relative right-4 pl-10 whitespace-nowrap basis-32 flex-shrink-0 bg-teal-50 px-2 py-1 border border-dashed  border-l-transparent rounded-r-md " + (type == "items" && "active-collection")}>
                single items
              </Link>
            </div>
          </div>
          <div className='collections_desc text-slate-600 text-center text-sm mt-5'>
            <p className='max-w-xl mx-auto text-center'>
              here you can find all <i>premade gits</i> that we chose for you or you can chose <i>single items</i> as your needed to keep you free to make your collection
            </p>
          </div>
        </div>
      </section>
      <section className='collections_content'>
        <div className='filter_bar_wrapper bg-teal-50 py-3'>
          <div className='container'>
            <h4>FILTER:</h4>
            <div className='filters'>
              <ul className='filter_bar flex justify-start gap-x-5 flex-wrap min-[650px]:justify-evenly'>
                <li className='filter_by_price flex bg-[#f0f9f6] ml-3 flex-1'>
                  <span className='text-teal-700'>Price:</span>
                  <div className='price-range flex ml-3'>
                    <div className='min-price flex items-center'>
                      <label htmlFor='min' className='whitespace-nowrap'>
                        min: $
                      </label>
                      <input type='number' id='min' placeholder='00' min={0} className='h-4 w-12 outline-transparent' />
                    </div>
                    <div className='max-price flex items-center'>
                      <label htmlFor='max' className='whitespace-nowrap'>
                        max: $
                      </label>
                      <input type='number' id='max' placeholder='max' min={1} className='h-4 w-12 outline-transparent' />
                    </div>
                  </div>
                </li>
                <li className='select filter_by_category'>
                  <span className='text-teal-700'>Category:</span>
                  <select className='filter-by px-2'>
                    <option value=''>choose an option-</option>
                    <option value='Holiday'>Holiday</option>
                    <option value='Birthday'>Birthday</option>
                    <option value='Congratulations'>Congratulations</option>
                    <option value='New Family'>New Family</option>
                    <option value='Baby'>Baby</option>
                    <option value='Kids'>Kids</option>
                    <option value='Books We Love'>Books We Love</option>
                  </select>
                </li>
                <li className='select filter_by_color'>
                  <span className='text-teal-700'>Color:</span>
                  <select className='filter-by px-2'>
                    <option value='All'>All</option>
                    <option value='white-to-black'>White-to-Black</option>
                    <option value='red-to-pink'>Red-to-Violet</option>
                    <option value='blue-to-teal'>Blue-to-teal</option>
                    <option value='green-to-yellow'>Green-to-Yellow</option>
                    <option value='amber-to-vermilion'>Amber-to-Vermilion</option>
                  </select>
                </li>
              </ul>
              <div className='filter_by_search'>
                <div className='search_wrap max-w-2xl mx-auto flex relative overflow-hidden rounded-md p-1'>
                  <input className='w-full py-1 px-3 outline-transparent ring-1 ring-teal-200 rounded-md' type='text' placeholder='search...' />
                  <i className='bx bx-search-alt absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='collection_content_wrapper mt-5'>
          <div className='container'>
            <div className='items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
              {collections.map(({ id, name, images, price }) => {
                let firstImage = JSON.parse(images);
                return <Item key={id} id={id} image={firstImage[0]} name={name} price={price} type={type} />;
              })}
              <Item type={type} id={"123"} image='/images/items_01.png' name='first items pens' price={12} />
              <Item type={type} id={"345"} image='/images/items_02.png' name='second items non' price={22} />
              <Item type={type} id={"567"} image='/images/items_03.png' name='third items' price={24} />
              <Item type={type} id={"789"} image='/images/items_04.png' name='fourth items black night' price={14} />
              <Item type={type} id={"910"} image='/images/items_05.png' name='night blue fiveth items' price={41} />
              <Item type={type} id={"101"} image='/images/items_06.png' name='sixth items fight' price={13} />
              <Item type={type} id={"132"} image='/images/items_07.png' name='seventh items book light' price={20} />
              <Item type={type} id={"114"} image='/images/items_08.png' name='book light' price={15} />
            </div>
            <Pagination />
          </div>
        </div>
      </section>
    </>
  );
}
