import Carousel from "@/app/components/Carousel";
import Item from "../components/Item";
import Included_item from "../components/Included_item";

export default function ItemPage({ params: { item_id } }: { params: { item_id: string } }) {
  return (
    <>
      <section className='product_wrapper'>
        <div className='container'>
          <div className='path flex mb-4 text-sky-400 text-xs'>
            <h4>Path:</h4>
            <span>collections/premade/name of product {item_id}</span>
          </div>
          <div className='product_content_wrapper md:grid md:gap-x-4 md:grid-cols-[400px_1fr] max-w-5xl mx-auto'>
            <div className='carousel mb-4 area_one'>
              <Carousel slides={["/images/items_01.png", "/images/items_02.png"]} />
            </div>
            <div className='product_main_info flex flex-col'>
              <div className='info flex justify-between items-start mb-4'>
                <h4 className='title text-3xl capitalize'>samsung a14 128 silver</h4>
                <div className='product_price relative'>
                  <span className='current_price text-teal-500 text-xl'>1230$</span>
                  <span className='old_price absolute top-full left-0 line-through text-amber-500'>1300$</span>
                </div>
              </div>
              <div className='in_stock_status flex gap-x-2 mb-2'>
                <span className=''>Availability:</span>
                <span className='text-green-400 uppercase'>in stock</span>
              </div>
              <div className='product_properties_wrapper'>
                <div className='colors mb-4'>
                  <h4 className='font-bold text-lg mb-2'>colors:</h4>
                  <div className='options'>
                    <ul className='flex gap-x-2'>
                      <li className='min-h-[20px] cursor-pointer px-3 py-1 rounded-md bg-teal-300 border'></li>
                      <li className='min-h-[20px] cursor-pointer px-3 py-1 rounded-md bg-slate-600 border'></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='submit_order text-end mb-4 mt-auto'>
                <button className='text-2xl bg-lime-500 text-white rounded-lg px-4 py-2 hover:bg-lime-400 uppercase'>add to cart</button>
              </div>
            </div>
            <div className='product_full_details col-span-2'>
              <h4 className='section_title relative rounded-md text-2xl capitalize font-bolde  pl-8 py-2 mt-10 mb-5'>
                <span>include</span>
                <i className='bx bx-link-alt absolute -left-3 -top-3 text-[40px] text-slate-600/50'></i>
              </h4>
              <ul className='rounded-md overflow-hidden'>
                <Included_item id='1123' name={"samsung a14 128 silver"} image={"/images/items_01.png"} />
                <Included_item id='2323' name={"samsung a14 128 silver"} image={"/images/items_02.png"} />
                <Included_item id='4523' name={"samsung a14 128 silver"} image={"/images/items_03.png"} />
                <Included_item id='7123' name={"samsung a14 128 silver"} image={"/images/items_04.png"} />
              </ul>
            </div>
          </div>
          <div className='product_desc'>
            <h4 className='section_title relative rounded-md text-2xl capitalize font-bolde  pl-8 py-2 mt-10 mb-5'>
              <span>description</span>
              <i className='bx bx-link-alt absolute -left-3 -top-3 text-[40px] text-slate-600/50'></i>
            </h4>
            All-Day Intelligent Battery - Get the power you need for the activities you heart the most with a smart battery that keeps you going all day and into the night. SuperFast Charging - Enjoy a charge that’s ready for all you do. Get Super Fast Charging that gives you a 50% charge in just 30 minutes. 1 Faster Galaxy Processor + 5G - Level up your gaming, livestreaming, video editing and multitasking with our fast Galaxy processing and 5G2 capability. Smooth & Strong Display - Get more
            out of your mobile experience with scrolling that’s bright.
          </div>
        </div>
      </section>
      <section className='similar_products mt-8'>
        <div className='container px-4 sm:px-0'>
          <h4 className='section_title relative rounded-md text-2xl capitalize font-bolde  pl-8 py-2 mt-10 mb-5'>
            <span>similar products</span>
            <i className='bx bx-link-alt absolute -left-3 -top-3 text-[40px] text-slate-600/50'></i>
          </h4>
          <div className='top_rate grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
            <Item id={"12345"} name='Baseus Simu Anc True Wireless Earphones s1 Pro Blue6' price={300} image='/images/items_01.png' />
            <Item id={"12345"} name='IPAD PRO 11 (2021) BLUETOOTH KEYBOARD CASE' price={300} image='/images/items_02.png' />
            <Item id={"12345"} name='JR-W050 20W Magnetic Wireless Power Bank with Ring Holder 10000mAh' price={300} image='/images/items_03.png' />
            <Item id={"12345"} name='Baseus Simu Anc True Wireless Earphones s1 Pro Blue' price={300} image='/images/items_04.png' />
          </div>
        </div>
      </section>
    </>
  );
}
