import React from "react";

export default function LastOrdersLoading() {
  return (
    <div className='last_orders py-3'>
      <LastOrderPulse />
      <LastOrderPulse />
      <LastOrderPulse />
      <LastOrderPulse />
    </div>
  );
}

function LastOrderPulse() {
  return (
    <div className='order sm:flex gap-x-3 odd:bg-blue-50 mb-3 rounded px-2 py-1 border animate-pulse'>
      <div className='order_main_details flex gap-x-3 basis-2/5'>
        <figure className='bg-slate-300 border w-24 h-24 rounded relative mb-3 overflow-hidden'></figure>
        <div className='name mt-3 border'>
          <h4 className='w-20 h-3 rounded bg-slate-300'></h4>
          <span className='w-16 h-3 rounded bg-slate-300 block mt-2'></span>
        </div>
      </div>
      <div className='order_extra_details flex gap-x-3 justify-around grow basis-3/5'>
        <div className='order_type flex-1'>
          <p className='w-20 h-3 rounded bg-slate-300 mb-2'></p>
          <span className={"w-16 h-3 rounded bg-slate-300 block"}></span>
        </div>
        <div className='includes_count flex-1 flex flex-col items-center'>
          <p className='mb-2 w-20 h-3 rounded bg-slate-300'></p>
          <span className='w-16 h-3 rounded bg-slate-300 block'></span>
        </div>
        <div className='price text flex-1 flex flex-col items-center'>
          <p className='mb-2 w-20 h-3 rounded bg-slate-300'></p>
          <span className='w-16 h-3 rounded bg-slate-300 block'></span>
        </div>
        <div className='go_to grid place-content-center flex-1'>
          <span className='w-14 h-6 rounded bg-slate-300 blocks'></span>
        </div>
      </div>
    </div>
  );
}
