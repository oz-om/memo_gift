import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Blogs() {
  const blogs = await prisma.blog.findMany({
    include: {
      tags: {
        select: {
          tag: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <section className='latest_blogs'>
        <div className='container'>
          <div className='layout'>
            {blogs[0] && (
              <div className={"main_blog bg-center bg-cover rounded py-5"} style={{ backgroundImage: `url(${blogs[0].cover})` }}>
                <div className='blog_info flex justify-between px-2 md:px-10 text-sm'>
                  <p className='text-sm'>
                    by <span className='bg-slate-50/55 px-2 rounded  font-medium'>{blogs[0].author}</span>
                  </p>
                  <p className='bg-slate-50/55 px-2 rounded font-medium'>{formatDate(`${blogs[0].updatedAt}`)}</p>
                </div>
                <h4 className='font-semibold text-2xl my-5 text-center px-5 bg-slate-50/55 '>{blogs[0].title}</h4>
                <div className='desc line-clamp-3 p-2'>{blogs[0].description}</div>
                <div className='blog_tags flex items-center justify-between px-2'>
                  <Link href={"/blogs/" + blogs[0].id} className='bg-slate-600 text-teal-200 px-2 rounded font-light text-sm'>
                    reade more
                  </Link>
                  <div className='tags flex gap-x-2 text-sm'>
                    {blogs[0].tags.map(({ tag }) => {
                      return (
                        <p key={tag} className='underline'>
                          {tag}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            <div className='other_ grid grid-cols-2 gap-x-3 mt-4'>
              {blogs[1] && (
                <div className='blog_one shadow rounded p-2 flex flex-col'>
                  <div className='blog_info flex flex-col-reverse sm:flex-row gap-x-2'>
                    <div className='blog_details'>
                      <h4 className='text-sm font-semibold line-clamp-3'>{blogs[1].title}</h4>
                      <div className='desc line-clamp-3 text-sm font-light text-slate-600 my-2'>{blogs[1].description}</div>
                      <Link className='underline text-blue-500' href={"/blogs/" + blogs[1].id}>
                        reade more
                      </Link>
                    </div>
                    <figure className='overflow-hidden rounded border max-w-60'>
                      <Image className='aspect-square h-auto' src={blogs[1].cover} alt={blogs[1].title} width={720} height={625} />
                    </figure>
                  </div>
                  <div className='tags flex gap-x-2 mt-auto'>
                    {blogs[1].tags.map(({ tag }) => {
                      return (
                        <p className='underline text-sm font-light' key={tag}>
                          {tag}
                        </p>
                      );
                    })}
                  </div>
                  <div className='blog_date flex flex-col text-sm min-[500px]:flex-row min-[500px]:justify-between min-[500px]:items-center'>
                    <p>
                      by <span>{blogs[1].author}</span>
                    </p>
                    <p>{formatDate(`${blogs[1].updatedAt}`)}</p>
                  </div>
                </div>
              )}
              {blogs[2] && (
                <div className='blog_two shadow rounded p-2 flex flex-col'>
                  <div className='blog_info flex flex-col sm:flex-row gap-x-2'>
                    <figure className='overflow-hidden rounded border max-w-60'>
                      <Image className='aspect-square h-auto' src={blogs[2].cover} alt={blogs[2].title} width={720} height={625} />
                    </figure>
                    <div className='blog_details'>
                      <h4 className='text-sm font-semibold line-clamp-3'>{blogs[2].title}</h4>
                      <div className='desc line-clamp-3 text-sm font-light text-slate-600 my-2'>{blogs[2].description}</div>
                      <Link className='underline text-blue-500' href={"/blogs/" + blogs[2].id}>
                        reade more
                      </Link>
                    </div>
                  </div>
                  <div className='tags flex gap-x-2 mt-auto'>
                    {blogs[2].tags.map(({ tag }) => {
                      return (
                        <p className='underline text-sm font-light' key={tag}>
                          {tag}
                        </p>
                      );
                    })}
                  </div>
                  <div className='blog_date flex flex-col text-sm min-[500px]:flex-row min-[500px]:justify-between min-[500px]:items-center'>
                    <p>
                      by <span>{blogs[2].author}</span>
                    </p>
                    <p>{formatDate(`${blogs[2].updatedAt}`)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className='blogs_wrapper bg-slate-50 mt-3 py-3'>
        <div className='container'>
          <div className='blogs grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {blogs.slice(3).map((blog) => {
              return (
                <div key={blog.id} className='blog p-2'>
                  <Link href={"/blogs/" + blog.id}>
                    <figure className='overflow-hidden rounded'>
                      <Image className='aspect-square' src={blog.cover} alt={blog.title} width={420} height={420} />
                    </figure>
                    <div className='blog_info'>
                      <h4 className='line-clamp-2 font-medium text-slate-600'>{blog.title}</h4>
                      <div className='by flex flex-col sm:flex-row justify-between items-center text-xs'>
                        <p>
                          by <span className='font-medium text-slate-600'>{blog.author}</span>
                        </p>
                        <p>{formatDate(`${blog.updatedAt}`)}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
