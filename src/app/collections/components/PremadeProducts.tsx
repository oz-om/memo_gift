import { prisma } from "@/lib/db/prisma";
import React from "react";
import Item from "./Item";

export default async function PremadeProducts() {
  let premades = await prisma.premadeGift.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      variants: {
        include: {
          variant: true,
        },
      },
    },
  });
  return (
    <div className='premades grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
      {premades.map(({ id, name, images, price, variants }) => {
        let variantId = variants[0].variant.id;
        let firstImage = JSON.parse(images);
        return <Item key={id} id={id} image={firstImage[0]} name={name} price={price} type={"premade"} variantId={variantId} />;
      })}
    </div>
  );
}
