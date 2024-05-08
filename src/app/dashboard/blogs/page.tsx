import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Blogs() {
  const blogs = await prisma.blog.findMany();

  return (
    <>
      <nav>
        <Link href={"blogs/create-new-blog"} className='text-white bg-teal-400 rounded py-1 px-3'>
          create new
        </Link>
        <search className=' mt-3'>
          <div className='input max-w-xs mx-auto relative'>
            <input type='search' name='' id='' className='w-full h-full py-2 px-2 bg-transparent rounded outline-teal-100 focus:outline focus:outline-2  border' placeholder='search' />
            <i className='bx bx-search-alt absolute right-0  bg-slate-100 text-teal-400 h-full flex items-center bx-sm before:relative before:top-2 before:mx-1 rounded cursor-pointer'></i>
          </div>
        </search>
      </nav>
      <section className='blogs_section_wrapper'>
        <div className='blogs grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] lg:grid-cols-4 bg-white rounded border px-2 py-4 shadow-md'>
          {blogs.map((blog) => {
            return (
              <div key={blog.id} className='added py-3 bg-violet-50 px-2 rounded flex flex-col'>
                <figure className=' overflow-hidden rounded-md mb-2 aspect-square'>
                  <Image src={`${blog?.cover}`} alt={"last added blog"} width={320} height={200} />
                </figure>
                <div className='name mb-5 line-clamp-2'>{blog?.title}</div>
                <div className='control_blogs flex justify-end items-center flex-wrap  mt-auto  '>
                  <Link href={"/blogs/" + blog.id} className='w-fit px-4 py-1 bg-blue-50  text-blue-500 rounded-md border border-transparent text-xs hover:border-blue-500'>
                    view
                  </Link>
                  <Link href={"#"} className='w-fit px-4 py-1  text-red-500 rounded-md text-xs'>
                    delete
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
