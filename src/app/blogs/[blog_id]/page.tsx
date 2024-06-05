import "../styles/style.css";
import { prisma } from "@/lib/db/prisma";
import { APP_API_URL, formatDate } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import React, { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { T_getBlogsRes } from "@/app/api/blogs/route";

export async function generateStaticParams() {
  try {
    const getBlogs = await fetch(`${APP_API_URL}/blogs`, { next: { revalidate: 86400 } });
    const blogsRes: T_getBlogsRes = await getBlogs.json();
    if (!blogsRes.success) {
      return [];
    }
    return blogsRes.blogs.map((blog) => ({
      blog_id: blog.id,
    }));
  } catch (error) {
    return [];
  }
}

const blogPost = cache(async (blog_id: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blog_id,
    },
    include: {
      tags: {
        select: {
          tag: true,
        },
      },
    },
  });
  if (!blog) return notFound();

  return blog;
});

export async function generateMetadata({ params: { blog_id } }: { params: { blog_id: string } }): Promise<Metadata> {
  const blog = await blogPost(blog_id);
  return {
    title: blog.title,
    description: blog.description,
    alternates: {
      canonical: `/blogs/${blog_id}`,
    },
    openGraph: {
      images: [
        {
          url: blog.cover,
        },
      ],
    },
  };
}

export default async function BlogPage({ params: { blog_id } }: { params: { blog_id: string } }) {
  const blog = await blogPost(blog_id);
  const formattedDate = formatDate(`${blog.updatedAt}`);
  const blogTags = blog.tags.map((tag) => tag.tag);
  const relatedBlogs = await prisma.blog.findMany({
    where: {
      tags: {
        some: {
          tag: { in: blogTags },
        },
      },
      id: { not: blog.id },
    },
  });

  return (
    <article>
      <div className='blog_cover h-40 overflow-hidden place-content-center'>
        <Image src={blog.cover} alt={"blog cover"} width={950} height={720} />
      </div>
      <section className='blog_wrapper'>
        <div className='max-w-[90%] mx-auto flex flex-col relative md:flex-row gap-x-2'>
          <div className='blog_content basis-4/5 relative -top-16 bg-white p-2 rounded '>
            <header className='mb-4'>
              <h4 className='blog__article__title heading-size-9 !text-3xl !font-light text-center'>{blog.title}</h4>
              <p className='blog__released text-sm font-thin text-center'>
                Posted by <span className='strong'>{blog.author}</span> on <time>{formattedDate}</time>
              </p>
            </header>
            <div className='blog__article__content rte' dangerouslySetInnerHTML={{ __html: blog.content }} />
            <div className='tags flex items-center gap-2 mt-10'>
              <p>TAGS:</p>
              {blog.tags.map(({ tag }) => {
                return (
                  <div key={tag} className='tag rounded px-2 py-1 shadow'>
                    {tag}
                  </div>
                );
              })}
            </div>
          </div>
          <div className='related_blogs basis-1/5  md:border min-w-80'>
            <h4 className='uppercase font-semibold'>Related Blogs:</h4>
            <div className='related_blogs grid grid-cols-2 sm:grid-cols-3 gap-x-2 md:grid-cols-1'>
              {relatedBlogs.map((blog) => {
                return (
                  <div key={blog.id} className='blog p-2 shadow rounded max-w-64 mx-auto'>
                    <figure className='overflow-hidden rounded-t'>
                      <Image className='aspect-video' src={blog.cover} alt={""} width={200} height={200} />
                    </figure>
                    <div className='blog_info'>
                      <h4 className='line-clamp-1'>{blog.title}</h4>
                      <p className='text-xs text-slate-500'>{formatDate(`${blog.updatedAt}`)}</p>
                      <div className='actions flex justify-end'>
                        <Link href={"/blogs/" + blog.id} className='text-slate-600 bg-slate-100 px-2 rounded font-light'>
                          view
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* <div className='blog p-2 shadow rounded'>
                <figure className='overflow-hidden rounded-t'>
                  <Image src={"/images/blog_01.jpg"} alt={""} width={200} height={200} />
                </figure>
                <div className='blog_info'>
                  <h4 className='line-clamp-1'>blog title just for testing how it wel be look like</h4>
                  <p className='text-xs text-slate-500'>May 21, 2023</p>
                  <div className='actions flex justify-end'>
                    <Link href={"#"} className='text-slate-600 bg-slate-100 px-2 rounded font-light'>
                      view
                    </Link>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
