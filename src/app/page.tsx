import "./home/styles/style.css";
import Link from "next/link";
import Section_title from "./home/components/Section_title";
import Collection_item from "./home/components/Collection_item";
import Recent_blogs from "./home/components/Recent_blogs";
import Trusted_by_list from "./home/components/Trusted_by_list";
import What_we_do_item from "./home/components/What_we_do_item";

export default function Home() {
  return (
    <main>
      <section className='what_we_do_wrapper bg-orange-50 py-6'>
        <div className='container'>
          <Section_title title={"what we do"} className={"what_we_do"} />
          <div className='what_we_do_content block whitespace-nowrap overflow-x-auto min-[480px]:grid min-[480px]:md-layout text-center gap-5 custom-scroll-bar'>
            <What_we_do_item image={"/images/ready_to_ship.png"} title={"ready to ship"} route={"/"} routeName={"get to gifting"} desc={"Pre-curated, preselected products centered around a specific theme. Ships in a gift box and includes a hand written note & photo. No packing slip or pricing included, ever."} />
            <What_we_do_item image={"/images/build_memori_gift.png"} title={"build a memori_gift"} route={"/"} routeName={"get personal"} desc={"Fully customizable product selection. Includes a hand written note. No packing slip or pricing included, ever."} />
            <What_we_do_item image={"/images/marketplace.png"} title={"the marketplace"} route={"/"} routeName={"treat yourself"} desc={"All the products you love, all in one place. Ships in a muslin bag and includes pricing and a packing slip. No hand written note here."} />
            <What_we_do_item image={"/images/corporate_gifting.png"} title={"corporate gifting"} route={"/"} routeName={"inquire today"} desc={"BOXFOX Concierge brings the BOXFOX aesthetic and human touch to scale, offering personal gifting solutions for companies large and small."} />
          </div>
        </div>
      </section>
      <section className='collections_section_wrapper py-6'>
        <div className='container'>
          <Section_title title={"let us help you get your gift started"} className={"collections_sections_title"} />
          <div className='collections_items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-4'>
            <Collection_item image={"/images/collection_01.jpg"} name={"French Cade Lavender Petite Glass Jar Candle"} price={14} />
            <Collection_item image={"/images/collection_02.jpg"} name={"Cozy Nights Tea Sachet"} price={5} />
            <Collection_item image={"/images/collection_03.png"} name={"Self Care Shower Steamers"} price={10} />
            <Collection_item image={"/images/collection_04.png"} name={"A Gentle Reminder"} price={4} />
            <Collection_item image={"/images/collection_05.jpg"} name={"UMA Small Softcover Notebook | Dark Green"} price={5} />
            <Collection_item image={"/images/collection_06.png"} name={"Two Teal Pens"} price={35} />
            <Collection_item image={"/images/collection_07.jpg"} name={"Christmas Tree Spoon Rest"} price={18} />
            <Collection_item image={"/images/collection_08.png"} name={"Beauty Sleep Hydrogel Face Sheet Mask"} price={13} />
          </div>
        </div>
      </section>
      <section className='favorites_section_wrapper bg-teal-50 py-6'>
        <div className='container'>
          <Section_title title={"memori_gifts favorites"} className='favorites_section_title' />
          <div className='favorites_content grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-4'>
            <Collection_item image={"/images/favo_01.png"} name={"KIND OF A BIG TEAL"} price={47} />
            <Collection_item image={"/images/favo_02.jpg"} name={"GOOD TIDINGS"} price={45} />
            <Collection_item image={"/images/favo_03.jpg"} name={"MERRY MERRY"} price={48} />
            <Collection_item image={"/images/favo_04.jpg"} name={"SWEETS"} price={55} />
          </div>
        </div>
      </section>
      <section className='marketplace_section_wrapper  bg-center bg-cover text-white text-center py-20'>
        <div className='container'>
          <div className='into_section'>
            <p className='uppercase font-medium'>introducing</p>
          </div>
          <div className='marketplace_section_title'>
            <h2 className='capitalize'>the marketplace</h2>
          </div>
          <div className='marketplace_section_desc'>
            <p className='font-light text-slate-200'>Treat yourself with the best products from the greatest brands, all in one place.</p>
          </div>
          <div className='marketplace_section_redirect'>
            <Link href={"/"} className='uppercase py-5 px-10 mt-8 inline-block bg-slate-100 text-black font-medium'>
              shop now
            </Link>
          </div>
        </div>
      </section>
      <section className='trusted_by_section_wrapper py-6'>
        <div className='container'>
          <Section_title title={"trusted by"} className='trusted_by_section_title' />
        </div>
        <Trusted_by_list />
      </section>
      <section className='corporate_section_wrapper'>
        <div className='section_content_wrapper  flex flex-col-reverse bg-stone-300 md:flex-row'>
          <div className='container basis-1/2'>
            <div className='section_info md:px-5'>
              <h4 className='sub_title uppercase font-medium my-6 '>DIRECT MAIL THAT DELIVERS</h4>
              <h3 className='main_title capitalize text-3xl font-serif mb-3'>Custom Corporate Gifting</h3>
              <div className='desc text-sm'>
                <p>
                  Whether you need enterprise-level efficiency or small business savvy, you can count on a best-in-class gifting experience. <br />
                  <br />
                  BOXFOX Concierge brings the BOXFOX aesthetic and human touch to scale, offering personal gifting solutions for companies large and small. We promise to be your go-to for gifting! With a dedicated sales manager, all-star production team, and countless customization options, we make it all happen, on brand, and on time.
                </p>
              </div>
              <div className='corporate_section_redirect md:text-center'>
                <Link href={"/"} className='uppercase py-5 px-10 mt-8 ml-6 md:ml-0 inline-block bg-slate-100 text-black font-medium'>
                  get started today
                </Link>
              </div>
            </div>
          </div>
          <div className='section_cover min-h-[380px] bg-center bg-cover basis-1/2'></div>
        </div>
      </section>
      <section className='recent_blogs_section mb-6'>
        <div className='container'>
          <Section_title title={"a word from memory_gift"} className='recent_blogs_section_title' />
          <div className='recent_blogs_wrapper relative'>
            <Recent_blogs />
          </div>
        </div>
      </section>
    </main>
  );
}
