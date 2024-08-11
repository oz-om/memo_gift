import "./home/styles/style.css";
import Link from "next/link";
import Section_title from "./home/components/Section_title";
import { Collection_Items_Wrapper, Premades_Wrapper } from "./home/components/Collection_item";
import Recent_blogs from "./home/components/Recent_blogs";
import Trusted_by_list from "./home/components/Trusted_by_list";
import What_we_do_item from "./home/components/What_we_do_item";
import { APP_API_URL } from "@/utils";
import { T_getBlogsRes } from "./api/blogs/route";

export const fetchCache = "force-no-store";
const cacheConfig: RequestInit = {
  cache: "no-store",
};

async function getBlogs() {
  try {
    const req = await fetch(`${APP_API_URL}/blogs`, cacheConfig);
    const res: T_getBlogsRes = await req.json();
    if (!res.success) {
      return [];
    }
    return res.blogs;
  } catch (error) {
    return [];
  }
}
export default async function Home() {
  const recentBlogs = await getBlogs();

  return (
    <main>
      <section className='what_we_do_wrapper bg-orange-50 py-6'>
        <div className='container'>
          <Section_title title={"what we do"} className={"what_we_do"} />
          <div className='what_we_do_content whitespace-nowrap overflow-x-auto w-full inline-block sm:grid sm:md-layout text-center gap-5 custom-scroll-bar'>
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
          <Collection_Items_Wrapper cacheConfig={cacheConfig} />
        </div>
      </section>
      <section className='favorites_section_wrapper bg-teal-50 py-6'>
        <div className='container'>
          <Section_title title={"memori_gifts favorites"} className='favorites_section_title' />
          <Premades_Wrapper cacheConfig={cacheConfig} />
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
            <Recent_blogs blogs={recentBlogs} />
          </div>
        </div>
      </section>
    </main>
  );
}
