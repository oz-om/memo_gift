import React from "react";

export default function Lazy_Loading_Spin() {
  return (
    <div className='fixed top-0 left-0 right-0 text-xs font-light mx-auto py-2 w-40 flex justify-center items-center gap-x-2 rounded shadow bg-white border z-50'>
      <i className='bx bx-loader-circle bx-spin'></i>
      <span>just a second!</span>
    </div>
  );
}
