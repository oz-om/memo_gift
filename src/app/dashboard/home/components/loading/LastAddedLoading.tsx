import React from "react";

export default function LastAddedLoading() {
  return (
    <div className='last_added py-3 grid min-[345px]:grid-cols-2 sm:flex justify-around gap-5 animate-pulse'>
      {/* premade */}
      <div className='added py-3 bg-violet-50 px-2 rounded flex flex-col basis-1/3 max-w-60 '>
        <figure className='relative overflow-hidden rounded-md mb-2 bg-slate-300 w-full  h-52'></figure>
        <div className='bg-slate-300 w-20 h-4 rounded '></div>
        <div className='details flex justify-between mt-2 mb-5'>
          <div className='price bg-slate-300 w-16 h-4 rounded '></div>
          <div className='variants flex px-4 gap-x-4'>
            <span className={"inline-block border w-5 bg-slate-300 "}></span>
            <span className={"inline-block border w-5 bg-slate-300"}></span>
          </div>
        </div>
        <div className='add_new grid place-content-center mt-auto'>
          <span className='bg-slate-300 w-20 h-4 rounded '></span>
        </div>
      </div>
      {/* item */}
      <div className='added py-3 bg-blue-50 px-2 rounded flex flex-col basis-1/3 max-w-60'>
        <figure className='relative overflow-hidden rounded-md mb-2 w-full   h-52 bg-slate-300'></figure>
        <div className=' bg-slate-300 w-20 h-4 rounded '></div>
        <div className='details flex justify-between mt-2 mb-5'>
          <div className=' bg-slate-300 w-16 h-4 rounded '></div>
        </div>
        <div className='add_new grid place-content-center mt-auto'>
          <span className='bg-slate-300 w-20 h-4 rounded block'></span>
        </div>
      </div>
      {/* post card */}
      <div className='added py-3 bg-orange-50 px-2 rounded flex flex-col basis-1/3 max-w-60'>
        <figure className='relative overflow-hidden rounded-md mb-2 w-full  h-52 bg-slate-300'></figure>
        <div className='bg-slate-300 w-20 h-4 rounded '></div>
        <div className='add_new grid place-content-center mt-auto'>
          <span className='bg-slate-300 w-20 h-4 rounded  block mt-4'></span>
        </div>
      </div>
    </div>
  );
}
