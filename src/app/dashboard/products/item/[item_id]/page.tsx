import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import React, { cache } from "react";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import ItemDetails from "../components/ItemDetails";
import ItemCategories from "../components/ItemCategories";
import ItemImages from "../components/ItemImages";
import UpdateItemDetails from "../components/UpdateItemDetails";

export type T_ItemProductType = Prisma.ItemGetPayload<{
  include: {
    categories: {
      select: {
        cat: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

const getItem = cache(async (id: string) => {
  let product: T_ItemProductType | null = null;
  product = await prisma.item.findUnique({
    where: {
      id,
    },
    include: {
      categories: {
        include: {
          cat: true,
        },
      },
    },
  });
  if (!product) return redirect("/not-found");
  return product;
});

export async function generateMetadata({ params: { item_id } }: { params: { item_id: string } }): Promise<Metadata> {
  const product = await getItem(item_id);
  return {
    title: product.name + " - dashboard ",
    description: product.desc,
    alternates: {
      canonical: `/collections/premade/${item_id}`,
    },
    openGraph: {
      images: [
        {
          url: JSON.parse(product.images)[0],
        },
      ],
    },
  };
}

export default async function itemPage({ params: { item_id } }: { params: { item_id: string } }) {
  const item = await getItem(item_id);

  return (
    <div className='premade_page_wrapper'>
      <div className='premade min-[860px]:grid grid-cols-2'>
        <section className='product-details bg-white rounded mt-2 mb-4 shadow px-2 py-4'>
          <ItemDetails item={item} />
          <section>
            <ItemCategories categories={item.categories} />
          </section>
        </section>
        <section className='premade_images bg-white rounded mt-2 mb-4 shadow px-2 py-4'>
          <ItemImages itemImages={item.images} />
        </section>
      </div>
      <div className='update_premade mt-5 mb-3'>
        <UpdateItemDetails item={item} />
      </div>
    </div>
  );
}
