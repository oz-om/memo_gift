import Link from "next/link";
import BuiltNewCustomGift from "./client/BuiltNewCustomGift";

export default function Header_hero({ headerHeroTitle }: { headerHeroTitle: string }) {
  return (
    <div className='header_hero_wrapper relative flex flex-col items-end'>
      <div className='header_hero_content px-2 md:w-2/3'>
        <div className='header_hero_title mt-4'>
          <h2 className='text-end'>{headerHeroTitle}</h2>
        </div>
        <div className='header_hero_desc mt-4'>
          <p className='text-end text-lg'>Since 2014. Let us do the gift wrapping for you.</p>
        </div>
        <div className='header_start_cat mt-4 flex flex-wrap gap-3 justify-end'>
          <BuiltNewCustomGift className='uppercase py-5 px-9 text-sm whitespace-nowrap w-56 font-semibold border-2 border-teal-100 rounded-md hover:bg-white/20' />
          <Link href='/collections/premade' className='uppercase py-5 px-9 text-sm whitespace-nowrap w-56 font-semibold border-2 border-teal-100 rounded-md hover:bg-white/20'>
            ready memori_gift
          </Link>
          <Link href='/collections/items' className='uppercase py-5 px-9 text-sm whitespace-nowrap w-56 font-semibold border-2 border-teal-100 rounded-md hover:bg-white/20'>
            single items
          </Link>
        </div>
      </div>
    </div>
  );
}
