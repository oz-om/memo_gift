"use client";
import Image from "next/image";
import React, { useRef } from "react";
import Input, { Textarea } from "../../components/client/inputs";
import { CategoriesInput } from "../../components/client/inputs/CategoriesInput";

export default function BlogInfo() {
  console.log("render new blog");
  const blogInfo = useRef<HTMLDivElement | null>(null);
  function toggleBlogAsideInfo() {
    if (!blogInfo.current) return;
    blogInfo.current.classList.toggle("right-0");
    blogInfo.current.classList.toggle("-right-full");
  }
  return (
    <>
      <p onClick={toggleBlogAsideInfo} className='rounded flex gap-1 items-center bg-teal-100 text-slate-600 px-2 cursor-pointer'>
        <span>publish</span>
        <i className='bx bxs-hot '></i>
      </p>
      <aside ref={blogInfo} className='blog_info fixed max-w-80 w-full  top-[112px] h-[calc(100%_-_112px)] px-3 border bg-white shadow-[-8px_20px_20px_10px_#00000012] overflow-hidden custom-scroll-bar overflow-y-auto -right-full transition-[right] z-10'>
        <Input name='name' setValue={() => {}} reset={false} placeholder='Title' />
        <Textarea name='desc' reset={false} setValue={() => {}} placeholder='discretion' />
        <CategoriesInput name='tags' setValue={() => {}} reset={false} />
        <div className='blog_cover'>
          <div className='input'>
            <h4>blog cover</h4>
            <input type='file' />
          </div>
          <figure className='overview p-1 rounded m-1 bg-slate-100'>
            <Image src={"/images/collection_01.jpg"} alt={"blog cover"} width={280} height={200} />
          </figure>
        </div>
        <div className='publish_button my-auto grid place-content-center py-4'>
          <button className='text-white bg-teal-400 py-1 px-2 rounded'>save & publish</button>
        </div>
      </aside>
    </>
  );
}
