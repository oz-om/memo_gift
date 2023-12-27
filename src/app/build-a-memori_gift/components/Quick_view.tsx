import Carousel from "@/app/components/Carousel";
import { ClosePreview } from "./client/Buttons";

export default function Quick_view() {
  return (
    <dialog className='dialog_quick_view fixed left-0 top-0 w-full h-full bg-slate-100/50 backdrop-blur-2xl overflow-x-hidden overflow-y-auto z-10 custom-scroll-bar overscroll-contain'>
      <div className='container'>
        <ClosePreview />
        <div className='quick_view_wrapper md:grid md:grid-cols-2'>
          <Carousel slides={["/images/items_01.png", "/images/items_02.png"]} />
          <div className='quick_view_content mt-4'>
            <div className='product_info'>
              <h4 className='product_name font-bold text-lg tracking-wider px-2'>Ldoloaut doloremque Gold 730 quo pariatur consequatur dolores</h4>
              <div className='product_price flex justify-evenly mt-2'>
                <span className='current_price text-teal-500 text-xl'>1230$</span>
                <span className='old_price line-through text-amber-500 text-xl'>1300$</span>
              </div>
              <div className='product_rating flex justify-center mt-2'>
                <i className='bx bxs-star text-yellow-400'></i>
                <i className='bx bxs-star text-yellow-400'></i>
                <i className='bx bxs-star text-yellow-400'></i>
                <i className='bx bx-star text-yellow-400'></i>
                <i className='bx bx-star text-yellow-400'></i>
              </div>
              <div className='product_description text-slate-700 px-2 pt-2'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi, alias quia. Ipsum, temporibus dicta molestias nihil a enim? Nam, tempora veniam esse molestias repellendus est? At animi corrupti accusantium sit?</div>
            </div>
          </div>
          <div className='add_to md:col-span-2 max-w-xs w-full mx-auto text-center my-4'>
            <div className='add text-white border bg-teal-400 px-2 text-lg gird place-content-center rounded-md py-2 cursor-pointer'>add</div>
            <div className='add_controls hidden justify-center w-9/12 mx-auto'>
              <span className='increment basis-1/4 grid place-content-center text-xl bg-slate-200 border border-slate-400 rounded-l-md cursor-pointer'>+</span>
              <span className='count basis-3/5 bg-white'>1</span>
              <span className='decrement basis-1/4 grid place-content-center text-xl bg-slate-200 border border-slate-400 rounded-r-md cursor-pointer'>-</span>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
