"use client";
import React, { useRef, useState } from "react";
import { premadeUpdateDetails } from "./UpdatePremadeDetails";

export default function PremadeCategories({ categories }: { categories: { cat: { name: string } }[] }) {
  const [premadeCategories, setPremadeCategories] = useState(categories.map(({ cat }) => cat.name));
  const categoryInput = useRef<HTMLInputElement | null>(null);
  const [addMode, setAddMode] = useState(false);
  function switchToAddMode() {
    setAddMode(true);
  }
  function addNewCategory() {
    if (categoryInput.current && categoryInput.current.value.trim().length > 0) {
      premadeUpdateDetails.value.categories.push(categoryInput.current.value);
      console.log(premadeUpdateDetails.value.categories);

      setPremadeCategories([...premadeUpdateDetails.value.categories]);
      categoryInput.current.value = "";
    }
  }
  function deleteCategory(cat: string) {
    const kippedCategories = premadeCategories.filter((c) => c !== cat);
    premadeUpdateDetails.value.categories = kippedCategories;
    setPremadeCategories(kippedCategories);
  }
  return (
    <div className='categories_wrapper bg-blue-50 p-2 rounded'>
      <div className='flex justify-between'>
        <h4 className='text-slate-600'>categories: </h4>
        <div className='add_new_cat flex gap-x-2'>
          <input ref={categoryInput} type='text' className={"rounded bg-slate-50 px-2 outline-slate-400 max-w-40 border border-slate-200 text-xs " + (addMode ? "block" : "hidden")} placeholder='category' />
          <div>
            <button onClick={switchToAddMode} className={"bg-blue-400 text-teal-50 border-teal-100 rounded w-20 hover:bg-blue-500 " + (addMode ? "hidden" : "block")}>
              add new
            </button>
            <button onClick={addNewCategory} className={"bg-teal-400 text-white border-blue-100 rounded w-20 hover:bg-teal-500 " + (addMode ? "block" : "hidden")}>
              save
            </button>
          </div>
        </div>
      </div>
      <div className='categories'>
        {premadeCategories.map((cat) => {
          return (
            <div key={cat} className='variant flex justify-between items-center border-b py-1'>
              <p className='px-3 py1 rounded text-teal-400'>{cat}</p>
              <button onClick={() => deleteCategory(cat)} className='delete text-red-400 text-sm hover:bg-red-50 px-2 py-1 rounded'>
                delete
              </button>
            </div>
          );
        })}
        {premadeCategories.length == 0 && <div className='text-center py-2 rounded border m-4 text-slate-500 text-xs'>there is no categories chosed</div>}
      </div>
    </div>
  );
}
