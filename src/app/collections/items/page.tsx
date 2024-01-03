import React from "react";
import { Metadata } from "next";
import Item from "../components/Item";
import { prisma } from "@/lib/db/prisma";
import CollectionsHeader from "../components/CollectionsHeader";
import Pagination from "@/app/components/Pagination";

export const metadata: Metadata = {
  title: "items",
  description: "make memories beautiful with amazing gifts",
};

export default async function Items() {
  let items = await prisma.item.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main>
      <CollectionsHeader />
      <div className='collection_content_wrapper mt-5 relative'>
        <div className='container'>
          <div className='items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
            {items.map(({ id, name, images, price }) => {
              let firstImage = JSON.parse(images);
              return <Item key={id} id={id} image={firstImage[0]} name={name} price={price} type={"items"} />;
            })}
          </div>
        </div>
      </div>
      <Pagination />
    </main>
  );
}
