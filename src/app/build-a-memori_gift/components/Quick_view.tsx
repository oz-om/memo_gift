import Carousel from "@/app/components/Carousel";
import { Item } from "@prisma/client";
import AddToCustomGift from "./client/AddToCustomGift";
import { ClosePreview } from "./client/Buttons";

export default function Quick_view({ item }: { item: Item }) {
  return (
    <dialog className={`dialog-${item.id}` + " dialog_quick_view fixed left-0 top-0 w-full h-full bg-slate-100/50 backdrop-blur-2xl overflow-x-hidden overflow-y-auto z-10 custom-scroll-bar overscroll-contain"}>
      <div className='container'>
        <ClosePreview id={item.id} />
        <div className='quick_view_wrapper md:grid md:grid-cols-2'>
          <Carousel slides={JSON.parse(item.images)} />
          <div className='quick_view_content mt-4'>
            <div className='product_info'>
              <h4 className='product_name font-bold text-lg tracking-wider px-2'>{item.name}</h4>
              <div className='product_price flex justify-evenly mt-2'>
                <span className='current_price text-teal-500 text-xl'>{item.price}$</span>
                <span className='old_price line-through text-amber-500 text-xl'>1300$</span>
              </div>
              <div className='product_rating flex justify-center mt-2'>
                <i className='bx bxs-star text-yellow-400'></i>
                <i className='bx bxs-star text-yellow-400'></i>
                <i className='bx bxs-star text-yellow-400'></i>
                <i className='bx bx-star text-yellow-400'></i>
                <i className='bx bx-star text-yellow-400'></i>
              </div>
              <div className='product_description text-slate-700 px-2 pt-2'>{item.desc}</div>
            </div>
          </div>
          <div className='add_to md:col-span-2 max-w-xs w-full mx-auto text-center my-4'>
            <AddToCustomGift itemId={item.id} className='add text-white border bg-teal-400 px-2 text-lg gird place-content-center rounded-md py-2 cursor-pointer' />
            {/* <div className='add text-white border bg-teal-400 px-2 text-lg gird place-content-center rounded-md py-2 cursor-pointer'>add</div> */}
          </div>
        </div>
      </div>
    </dialog>
  );
}
