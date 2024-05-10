import React from "react";

export default function User_Addresses() {
  return (
    <div className='container mt-5'>
      <h4 className='font-medium uppercase'>addresses:</h4>
      <ul className='flex flex-col gap-y-2'>
        <li className='flex items-center border rounded shadow'>
          <p className='break-words px-2 line-clamp-2'>my student school my student class world Gard anony 1212 0708771693</p>
          <div className='actions flex justify-center gap-x-2 basis-12 border-l px-2'>
            <i className='bx bxs-edit-alt text-teal-400 bg-slate-100 rounded'></i>
            <i className='bx bxs-trash  text-red-400 bg-red-50 border-red-600 rounded'></i>
          </div>
        </li>
        <li className='flex items-center border rounded shadow'>
          <p className='break-words px-2 line-clamp-2'>my student school my student class world Gard anony 1212 0708771693</p>
          <div className='actions flex justify-center gap-x-2 basis-12 border-l px-2'>
            <i className='bx bxs-edit-alt text-teal-400 bg-slate-100 rounded'></i>
            <i className='bx bxs-trash  text-red-400 bg-red-50 border-red-600 rounded'></i>
          </div>
        </li>
      </ul>
    </div>
  );
}
