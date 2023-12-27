import React from "react";
import { Metadata } from "next";
import Item from "../components/Item";
import { prisma } from "@/lib/db/prisma";
import CollectionsHeader from "../components/CollectionsHeader";
import Pagination from "@/app/components/Pagination";
import "../styles/style.css";

export const metadata: Metadata = {
  title: "items - Memori-Gift",
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
            {items.length == 0 && (
              <>
                <Item type={"items"} id={"123"} image='/images/items_01.png' name='first items pens' price={12} />
                <Item type={"items"} id={"345"} image='/images/items_02.png' name='second items non' price={22} />
                <Item type={"items"} id={"567"} image='/images/items_03.png' name='third items' price={24} />
                <Item type={"items"} id={"789"} image='/images/items_04.png' name='fourth items black night' price={14} />
                <Item type={"items"} id={"910"} image='/images/items_05.png' name='night blue fiveth items' price={41} />
                <Item type={"items"} id={"101"} image='/images/items_06.png' name='sixth items fight' price={13} />
                <Item type={"items"} id={"132"} image='/images/items_07.png' name='seventh items book light' price={20} />
                <Item type={"items"} id={"114"} image='/images/items_08.png' name='book light' price={15} />
              </>
            )}
          </div>
        </div>
      </div>
      <Pagination />
    </main>
  );
}
