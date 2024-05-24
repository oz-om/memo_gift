"use client";

import React from "react";
import { useFilteredData } from "../../context/Filter_Context";

export default function Pagination() {
  const { fullFilteredData, pagination, setPagination, setFilteredData } = useFilteredData();

  function getNextPageHandler() {
    if (pagination.page >= pagination.total) return;
    const paginatedData = fullFilteredData.slice(pagination.page * pagination.limit, (pagination.page + 1) * pagination.limit);
    setFilteredData(paginatedData);
    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  }

  function getPrevPageHandler() {
    if (pagination.page - 1 <= 0) return;
    const paginatedData = fullFilteredData.slice((pagination.page - 2) * pagination.limit, (pagination.page - 1) * pagination.limit);
    setFilteredData(paginatedData);
    setPagination({
      ...pagination,
      page: pagination.page - 1,
    });
  }

  return (
    <div className='pagination flex justify-center items-center p-1 mt-2 rounded-xl  lg:justify-center bottom-0 w-full'>
      <div id='arrows' className='text-4xl grid grid-cols-3 justify-items-center items-center'>
        <div className={"back_arrows " + (pagination.page <= 1 && "opacity-0 pointer-events-none")}>
          <button id='super_back'>
            <i className={"bx bx-chevrons-left text-2xl cursor-pointer rounded-full hover:bg-teal-50 "}></i>
          </button>
          <button id='back' onClick={getPrevPageHandler}>
            <i className={"bx bx-chevron-left text-2xl cursor-pointer rounded-full ml-3 hover:bg-teal-50 "}></i>
          </button>
        </div>

        <div id='pagination-total' className='text-lg'>
          <span id='current'>{pagination.page} </span>
          of
          <span id='total'> {pagination.total}</span>
        </div>

        <div className={"front_arrows " + (pagination.page >= pagination.total && "opacity-0 pointer-events-none")}>
          <button onClick={getNextPageHandler} id='front'>
            <i className='bx bx-chevron-right text-2xl cursor-pointer rounded-full ml-3 hover:bg-teal-50'></i>
          </button>
          <button id='super_front'>
            <i className='bx bx-chevrons-right text-2xl cursor-pointer rounded-full ml-3 hover:bg-teal-50'></i>
          </button>
        </div>
      </div>
    </div>
  );
}
