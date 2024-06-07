"use client";
import { T_blog } from "@/app/api/blogs/route";
import { formatDate } from "@/utils";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Recent_blogs({ blogs }: { blogs: T_blog[] }) {
  const blogsCarousel = useRef<HTMLDivElement>(null);
  const firstBlogItem = blogsCarousel.current?.querySelectorAll(".blog_item")[0];
  const firstBlogWidth = firstBlogItem?.clientWidth as number;
  const [isDragging, setDragging] = useState(false);
  const prevPageX = useRef(0);
  const prevScrollLeft = useRef(0);
  const positionDiff = useRef(0);

  function dragStart(e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) {
    const PageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    setDragging(true);
    prevPageX.current = PageX;
    prevScrollLeft.current = blogsCarousel.current!.scrollLeft;
  }

  function dragging(e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) {
    if (!isDragging) return;
    "pageX" in e && e.preventDefault();
    blogsCarousel.current?.classList.add("dragging");
    const PageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    positionDiff.current = PageX - prevPageX.current;
    blogsCarousel.current!.scrollLeft = prevScrollLeft.current - positionDiff.current;
  }

  function dragStop() {
    blogsCarousel.current?.classList.remove("dragging");
    autoSlideComplete();
    setDragging(false);
  }

  function autoSlideComplete() {
    positionDiff.current = Math.abs(positionDiff.current);
    const valDiff = firstBlogWidth - positionDiff.current;

    if (isDragging) {
      if (blogsCarousel.current!.scrollLeft > prevScrollLeft.current) {
        blogsCarousel.current!.scrollLeft += positionDiff.current > firstBlogWidth / 3 ? valDiff : -positionDiff.current;
      } else {
        blogsCarousel.current!.scrollLeft -= positionDiff.current > firstBlogWidth / 3 ? valDiff : -positionDiff.current;
      }
    }
  }

  const nextSlideHandel = (e: React.MouseEvent<HTMLButtonElement>) => {
    blogsCarousel.current!.scrollLeft += e.currentTarget.id == "left" ? -firstBlogWidth : firstBlogWidth;
  };

  return (
    <>
      <i id='left' onClick={nextSlideHandel} className='bx bxs-chevron-left bg-teal-200/30 p-2 rounded-full absolute -top-10 cursor-pointer'></i>
      <div ref={blogsCarousel} onMouseMove={dragging} onMouseDown={dragStart} onMouseUp={dragStop} onMouseLeave={dragStop} onTouchStart={dragStart} onTouchMove={dragging} onTouchEnd={dragStop} className='recent_blogs custom-scroll-bar whitespace-nowrap overflow-x-auto scroll-smooth'>
        {blogs.map((blog) => {
          return <Blog key={blog.id} image={blog.cover} title={blog.title} publishedAT={formatDate(`${blog.createdAt}`)} publishedBy={blog.author} />;
        })}
      </div>
      <i id='right' onClick={nextSlideHandel} className='bx bxs-chevron-right bg-teal-200/30 p-2 rounded-full absolute -top-10 cursor-pointer right-0'></i>
    </>
  );
}

type BlogProps = {
  image: string;
  title: string;
  publishedAT: string;
  publishedBy: string;
};
function Blog({ image, title, publishedAT, publishedBy }: BlogProps) {
  return (
    <div className='blog_item cursor-grab px-4 inline-block align-top min-[450px]:blogs_cols_count_sm sm:blogs_cols_count_sm md:blogs_cols_count_md lg:blogs_cols_count_lg' draggable='false'>
      <div className='block_cover'>
        <Image className='aspect-square' src={image} alt={title} width={600} height={600} />
      </div>
      <div className='blog_info cursor-pointer'>
        <div className='blog_published_at text-xs text-slate-500 my-4'>
          <span>{publishedAT}</span>
        </div>
        <div className='blog_title whitespace-break-spaces'>
          <h4>{title}</h4>
        </div>
        <div className='blog_published_by text-xs text-slate-500 mt-2 mb-3'>
          <span>By {publishedBy}</span>
        </div>
      </div>
    </div>
  );
}
