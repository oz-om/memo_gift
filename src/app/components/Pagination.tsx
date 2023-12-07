import React from "react";

export default function Pagination() {
  const currentPage: number = 1;
  return (
    <div className='pagination flex justify-center items-center p-1 mt-2 rounded-xl  lg:justify-center bottom-0 w-full'>
      <div id='pagination' className='flex items-center gap-x-3'>
        <div id='pagination-total'>
          <span id='current'>1 </span>
          of
          <span id='total'> 3</span>
        </div>
        <div id='arrows' className='text-4xl flex'>
          {currentPage > 1 && (
            <>
              <div id='super_back'>
                <i className={"bx bx-chevrons-left text-2xl cursor-pointer rounded-full hover:bg-teal-50 "}></i>
              </div>
              <div id='back'>
                <i className={"bx bx-chevron-left text-2xl cursor-pointer rounded-full ml-3 hover:bg-teal-50 "}></i>
              </div>
            </>
          )}
          {currentPage !== 3 && (
            <>
              <div id='front' className={"" + (currentPage >= 3 && "text-white/20")}>
                <i className='bx bx-chevron-right text-2xl cursor-pointer rounded-full ml-3 hover:bg-teal-50'></i>
              </div>
              <div id='super_front' className={"" + (currentPage >= 3 && "text-white/20")}>
                <i className='bx bx-chevrons-right text-2xl cursor-pointer rounded-full ml-3 hover:bg-teal-50'></i>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
