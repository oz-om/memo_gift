import { prisma } from "@/lib/db/prisma";
import React from "react";
import Product_item from "./Product_item";

export default async function ProductItems() {
  let items = await prisma.item.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className='items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
      {items.map((item) => {
        return <Product_item key={item.id} item={item} />;
      })}
    </div>
  );
}
