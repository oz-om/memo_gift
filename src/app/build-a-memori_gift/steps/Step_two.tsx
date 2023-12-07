import Link from "next/link";
import { CloseBuiltBoxButton, OpenBuiltBoxButton } from "../components/client/Buttons";
import Chosed_Item from "../components/Chosed_Item";
import Pagination from "../../components/Pagination";
import Product_item from "../components/Product_item";
import Quick_view from "../components/Quick_view";
import Step_intro from "../components/Step_intro";

export default function Step_two() {
  return (
    <section className='step_two_section'>
      <div className='container'>
        <Step_intro step='2' title='CHOOSE YOUR ITEMS' desc="We've hand-selected the best products in one place. Select from the items below and fill up your box! Pick your products first and our program will automatically select the box size!" />
      </div>

      <section className='step_two_content sm:flex sm:gap-x-3'>
        <section className='shoos_items_section sm:flex-[2]'>
          <div className='filter_bar_wrapper bg-teal-50 py-3'>
            <div className='container'>
              <h4>filter:</h4>
              <div className='filters'>
                <ul className='filter_bar flex justify-start gap-x-5 flex-wrap min-[650px]:justify-evenly'>
                  <li className='select filter_by_reason'>
                    <span>Reason:</span>
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
                    <span>color:</span>
                    <select className='filter-by px-2'>
                      <option value='All'>All</option>
                      <option value='Pink'>Pink</option>
                      <option value='Red'>Red</option>
                      <option value='Orange'>Orange</option>
                      <option value='Yellow'>Yellow</option>
                      <option value='Green'>Green</option>
                      <option value='Blue'>Blue</option>
                      <option value='Purple'>Purple</option>
                      <option value='White'>White</option>
                      <option value='Black'>Black</option>
                      <option value='Gold'>Gold</option>
                      <option value='Grey'>Grey</option>
                    </select>
                  </li>
                  <li className='select filter_by_price'>
                    <span>price:</span>
                    <select className='filter-by px-2'>
                      <option value=''>Sort</option>
                      <option value='price-descending'>High to Low</option>
                      <option value='price-ascending'>Low to High</option>
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
          <section className='items_content_section mt-2'>
            <div className='container'>
              <div className='items_wrapper'>
                <div className='items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
                  <Product_item image={"/images/items_01.png"} price={18} title={"FELLOW CARTER MOVE MUG 12OZ | CORDUROY RED"} />
                  <Product_item image={"/images/items_02.png"} price={25} title={"CARTER MOVE MUG 12OZ RED"} />
                  <Product_item image={"/images/items_03.png"} price={10} title={"CORDUROY RED FELLOW CARTER MOVE "} />
                  <Product_item image={"/images/items_04.png"} price={32} title={"FELLOW CARTER MOVE CORDUROY RED"} />
                  <Product_item image={"/images/items_05.png"} price={22} title={"RED FELLOW CARTER MOVE"} />
                  <Product_item image={"/images/items_06.png"} price={13} title={"FELLOW CORDUROY RED MOVE"} />
                  <Product_item image={"/images/items_07.png"} price={11} title={"FELLOW CARTER MOVE CORDUROY RED"} />
                  <Product_item image={"/images/items_08.png"} price={23} title={"MOVE CARTER RED CORDUROY"} />
                </div>
                <div className='pagination_wrapper'>
                  <Pagination />
                </div>
                <div className='next_step'>
                  <Link href={"?step=three"} className='bg-teal-400 text-white text-center px-4 py-2 rounded-md mx-auto min-w-max w-2/5 block sm:hidden'>
                    Next Step
                  </Link>
                </div>
                <Quick_view />
              </div>
            </div>
          </section>
        </section>
        <OpenBuiltBoxButton />
        <aside className='chosed_collection_section fixed top-0 w-full h-full bg-white left-[100vw] transition-[left] overflow-scroll sm:overflow-visible sm:flex-[1] sm:relative sm:left-auto  custom-scroll-bar'>
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
          <div className='chosed_items_wrapper'>
            <div className='chosed_items custom-scroll-bar mb-11 sm:max-h-[90vh] sm:overflow-auto sm:mb-0'>
              <Chosed_Item image={"/images/step-one-pack-one.png"} name={"Gift Packaging, Card & Hand Wrapping"} quantity={1} totalPrice={12} />
              <Chosed_Item image={"/images/items_01.png"} name={"PURPLE SPECKLED NORDIC MUG"} quantity={1} totalPrice={10} />
              <Chosed_Item image={"/images/items_02.png"} name={"OVERNIGHT LIP MASK || BIRTHDAY CAKE"} quantity={1} totalPrice={12} />
              <Chosed_Item image={"/images/items_03.png"} name={"BIRTHDAY CAKE BODY SCRUB"} quantity={1} totalPrice={22} />
              <Chosed_Item image={"/images/items_04.png"} name={"PRISM STEMLESS CHAMPAGNE FLUTE GLASSES (SET OF 2)"} quantity={1} totalPrice={12} />
            </div>
            <div className='check_out_box  bg-teal-50 w-full flex justify-between p-2 fixed bottom-0 sm:relative'>
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
