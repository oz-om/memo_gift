"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFilteredData } from "../../context/Filter_Context";
type T_filterQueries = {
  searchQuery: string | null;
  min_price: number;
  max_price: number;
  category: string | null;
  color: string | null;
};
export default function Filter_Items() {
  const path = usePathname().split("/").pop();
  const { fullData, setFullFilteredData, setFilteredData, setPagination, pagination } = useFilteredData();
  const [filterOptions, setFilterOptions] = useState<T_filterQueries>({
    searchQuery: null,
    min_price: 1,
    max_price: 999,
    category: null,
    color: null,
  });

  function handelFilterQueries({ currentTarget }: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    setFilterOptions((prev) => ({
      ...prev,
      [currentTarget.name]: currentTarget.value.toLocaleLowerCase(),
    }));
  }

  useEffect(() => {
    const filteredResult = fullData.filter((data) => {
      const { searchQuery, max_price, min_price, category, color } = filterOptions;
      if (searchQuery && !data.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())) {
        return false;
      }

      if (min_price && !(data.price >= +min_price)) {
        return false;
      }

      if (max_price && !(data.price <= +max_price)) {
        return false;
      }

      if (color && data.theme && data.theme.toLocaleLowerCase() !== color.toLocaleLowerCase()) {
        return false;
      }

      if (category && !data.categories.some((c) => c.cat_name.toLocaleLowerCase() === category.toLocaleLowerCase())) {
        return false;
      }
      return true;
    });
    const paginatedData = filteredResult.slice(0, pagination.limit);
    setFullFilteredData(filteredResult);
    setFilteredData(paginatedData);
    setPagination({ ...pagination, page: 1, total: Math.ceil(filteredResult.length / pagination.limit) });
  }, [filterOptions.searchQuery, filterOptions.min_price, filterOptions.max_price, filterOptions.category, filterOptions.color]);

  return (
    <div className='filter_bar_wrapper bg-teal-50 py-3'>
      <div className='container'>
        <h4>FILTER:</h4>
        <div className='filters'>
          <ul className='filter_bar flex justify-start gap-x-5 flex-wrap min-[650px]:justify-evenly'>
            <li className='filter_by_price flex bg-[#f0f9f6] ml-3 flex-1'>
              <span className='text-teal-700'>Price:</span>
              <div className='price-range flex ml-3'>
                <div className='min-price flex items-center'>
                  <label htmlFor='min' className='whitespace-nowrap'>
                    min: $
                  </label>
                  <input onChange={handelFilterQueries} name='min_price' type='number' id='min' placeholder='00' min={0} className='h-4 w-12 outline-transparent' />
                </div>
                <div className='max-price flex items-center'>
                  <label htmlFor='max' className='whitespace-nowrap'>
                    max: $
                  </label>
                  <input onChange={handelFilterQueries} name='max_price' type='number' id='max' placeholder='max' min={1} className='h-4 w-12 outline-transparent' />
                </div>
              </div>
            </li>
            <li className='select filter_by_category'>
              <span className='text-teal-700'>Category:</span>
              <select onChange={handelFilterQueries} name='category' className='filter-by px-2'>
                <option value=''>choose an option-</option>
                <option value='Holiday'>Holiday</option>
                <option value='Birthday'>Birthday</option>
                <option value='Congratulations'>Congratulations</option>
                <option value='New Family'>New Family</option>
                <option value='Baby'>Baby</option>
                <option value='Kids'>Kids</option>
                <option value='Books We Love'>Books We Love</option>
              </select>
            </li>
            {path == "items" && (
              <li className='select filter_by_color'>
                <span className='text-teal-700'>Color:</span>
                <select onChange={handelFilterQueries} name='color' className='filter-by px-2'>
                  <option value=''>All</option>
                  <option value='white-to-black'>White-to-Black</option>
                  <option value='red-to-violet'>Red-to-Violet</option>
                  <option value='blue-to-teal'>Blue-to-teal</option>
                  <option value='green-to-yellow'>Green-to-Yellow</option>
                  <option value='amber-to-vermilion'>Amber-to-Vermilion</option>
                </select>
              </li>
            )}
          </ul>
          <div className='filter_by_search'>
            <div className='search_wrap max-w-2xl mx-auto flex relative overflow-hidden rounded-md p-1'>
              <input onChange={handelFilterQueries} name='searchQuery' className='w-full py-1 px-3 outline-transparent ring-1 ring-teal-200 rounded-md' type='text' placeholder='search...' />
              <i className='bx bx-search-alt absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
