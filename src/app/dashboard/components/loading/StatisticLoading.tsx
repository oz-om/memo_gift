import React from "react";

export default function StatisticLoading() {
  return (
    <div className='orders_today_wrapper grid grid-cols-1 min-[300px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 place-content-center '>
      <StatisticOrder name='orders' icon='bx-cart-download' value={`${0}`} className='orders_count from-blue-600 to-blue-100 bg-gradient-to-br' />
      <StatisticOrder name='shipped' icon='bxs-package' value={`${0}`} className='orders_shipped from-teal-600 to-teal-100 bg-gradient-to-br' />
      <StatisticOrder name='pending' icon='bxs-component' value={`${0}`} className='orders_still from-orange-600 to-orange-100 bg-gradient-to-br' />
      <StatisticOrder name='complete' icon='bx-line-chart' value={`0%`} className='orders_complete_percentage from-violet-600 to-violet-100 bg-gradient-to-br' />
    </div>
  );
}

function StatisticOrder({ className, name, icon, value }: { className?: string; name: string; icon: string; value: string }) {
  return (
    <div className={"border rounded relative min-w-28 w-full overflow-hidden pt-10  " + className}>
      <i className={"bx absolute top-0 right-0 text-6xl text-white opacity-30 " + icon}></i>
      <div className='name absolute top-0 left-0 text-white px-4'>{name}</div>
      <div className='count text-5xl px-3 text-stroke text-white'>{value}</div>
    </div>
  );
}
