"use client";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Recent_blogs() {
  const [startDragging, setStartDragging] = useState(false);
  const [Dragging, setDragging] = useState(false);
  const [prevPageX, setPrevPageX] = useState(0);
  const [prevScrollLeft, setPrevScrollLeft] = useState(0);
  const [scrolledSpace, setScrolledSpace] = useState(0);

  const blogsCarousel = useRef<HTMLDivElement>(null);
  const leftArrow = useRef(null);
  const rightArrow = useRef(null);

  const nextSlideHandel = (e: React.MouseEvent<HTMLButtonElement>) => {
    const icon = e.currentTarget;
    let firstChildren = blogsCarousel.current?.firstChild;
    let itemWidth = parseInt(getComputedStyle(firstChildren as HTMLElement).width);

    if (blogsCarousel.current != null) {
      blogsCarousel.current.scrollLeft += icon.id == "left" ? -itemWidth : itemWidth;
    }
  };

  const dargStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setStartDragging(true);
    if (e instanceof MouseEvent) {
      setPrevPageX(e.pageX);
    }
    if (e instanceof TouchEvent) {
      setPrevPageX(e.touches[0].pageX);
    }

    if (blogsCarousel.current != null) setPrevScrollLeft(blogsCarousel.current.scrollLeft);
  };

  const duringDragging = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // scrolling images/carousel to left according to mouse pointer
    if (!startDragging) return;
    if (e instanceof MouseEvent) {
      e.pageX && e.preventDefault();
    }

    blogsCarousel.current?.classList.add("dragging");
    setDragging(true);
    if (e instanceof MouseEvent) {
      setScrolledSpace(e.pageX - prevPageX);
    }
    if (e instanceof TouchEvent) {
      setScrolledSpace(e.touches[0].pageX - prevPageX);
    }
    if (blogsCarousel.current != null) blogsCarousel.current.scrollLeft = prevScrollLeft - scrolledSpace;
  };

  const dragEnd = () => {
    setStartDragging(false);
    if (blogsCarousel.current != null) blogsCarousel.current.classList.remove("dragging");
    if (!Dragging) return;
    setDragging(false);
    autoSlide();
  };

  const autoSlide = () => {
    let item = blogsCarousel.current!.firstChild;
    // if there is no image left to scroll then return from here
    if (blogsCarousel.current!.scrollLeft - (blogsCarousel.current!.scrollWidth - parseInt(getComputedStyle(blogsCarousel.current as HTMLElement).width)) > -1 || blogsCarousel.current!.scrollLeft <= 0) return;

    setScrolledSpace(Math.abs(scrolledSpace)); // making positionDiff value to positive
    let itemWidth = parseInt(getComputedStyle(item as HTMLElement).width);
    // getting difference value that needs to add or reduce from carousel left to take middle img center
    let valDifference = itemWidth - scrolledSpace;

    if (blogsCarousel.current!.scrollLeft > prevScrollLeft) {
      // if user is scrolling to the left
      return (blogsCarousel.current!.scrollLeft += scrolledSpace > itemWidth / 3 ? valDifference : -scrolledSpace);
    }

    // if user is scrolling to the right
    blogsCarousel.current!.scrollLeft -= scrolledSpace > itemWidth / 3 ? valDifference : -scrolledSpace;
  };

  return (
    <>
      <i ref={leftArrow} id='left' onClick={nextSlideHandel} className='bx bxs-chevron-left bg-teal-200/30 p-2 rounded-full absolute -top-10 cursor-pointer'></i>
      <div ref={blogsCarousel} onTouchStart={dargStart} onMouseDown={dargStart} onTouchMove={duringDragging} onMouseMove={duringDragging} onTouchEnd={dragEnd} onMouseUp={dragEnd} className='recent_blogs custom-scroll-bar whitespace-nowrap overflow-x-auto scroll-smooth'>
        <Blog image={"/images/blog_01.jpg"} title={"2023 Holiday Shipping Deadlines"} publishedAT={"October 16,2023"} publishedBy={"Anime Slayer"} />
        <Blog image={"/images/blog_02.jpg"} title={"The 5 Ways BOXFOX Makes Holiday Shopping Easier"} publishedAT={"October 16,2023"} publishedBy={"Anime Slayer"} />
        <Blog image={"/images/blog_03.jpg"} title={"Shop Now, Ship Later with HOLD FOR HOLIDAY"} publishedAT={"October 16,2023"} publishedBy={"Anime Slayer"} />
        <Blog image={"/images/blog_04.jpg"} title={"How to Build the Perfect Gift Box"} publishedAT={"October 16,2023"} publishedBy={"Anime Slayer"} />
        <Blog image={"/images/blog_05.jpg"} title={"The Best Holiday Corporate Gifting Solution 2023"} publishedAT={"October 16,2023"} publishedBy={"Anime Slayer"} />
      </div>
      <i ref={rightArrow} id='right' onClick={nextSlideHandel} className='bx bxs-chevron-right bg-teal-200/30 p-2 rounded-full absolute -top-10 cursor-pointer right-0'></i>
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
    <div className='blog_item cursor-grab px-4 inline-block align-top min-[450px]:blogs_cols_count_sm sm:blogs_cols_count_sm md:blogs_cols_count_md lg:blogs_cols_count_lg'>
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
