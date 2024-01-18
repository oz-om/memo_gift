import React from "react";

export default function StatisticOrder({ className, name, icon, value }: { className?: string; name: string; icon: string; value: string }) {
  return (
    <div className={"border rounded relative min-w-28 w-full overflow-hidden pt-10  " + className}>
      <i className={"bx absolute top-0 right-0 text-6xl text-white opacity-30 " + icon}></i>
      <div className='name absolute top-0 left-0 text-white px-4'>{name}</div>
      <div className='count text-5xl px-3 text-stroke text-white'>{value}</div>
    </div>
  );
}
