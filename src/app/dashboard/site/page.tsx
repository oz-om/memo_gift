import { prisma } from "@/lib/db/prisma";
import React from "react";
import Demo_Header from "./components/Demo_Header";

export default async function SitePage() {
  const header_cover = await prisma.site.findFirst();
  if (!header_cover) return;
  return (
    <div
      className='demo_header_wrapper relative  text-white  bg-center bg-cover'
      style={{
        backgroundImage: `url(${header_cover.header_cover ?? ""})`,
      }}
    >
      <div className='demo_header__layer absolute left-0 top-0 w-full h-full bg-black/20'></div>
      <div className='demo_header_hero_wrapper relative flex flex-col items-end'>
        <Demo_Header id={header_cover.id} title={header_cover.header_title ?? "Your go-to for personal, effortless & elevated gifting"} />
      </div>
    </div>
  );
}
