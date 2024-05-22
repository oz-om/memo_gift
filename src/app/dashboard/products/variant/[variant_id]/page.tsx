import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import VariantDetails from "../components/VariantDetails";
import VariantImages from "../components/VariantImages";
import UpdateVariantDetails from "../components/UpdateVariantDetails";

export type T_VariantProductType = Prisma.VariantGetPayload<{}>;

const getVariant = cache(async (id: string) => {
  let product: T_VariantProductType | null = null;
  product = await prisma.variant.findUnique({
    where: {
      id,
    },
  });
  if (!product) return notFound();
  return product;
});

export async function generateMetadata({ params: { variant_id } }: { params: { variant_id: string } }): Promise<Metadata> {
  const product = await getVariant(variant_id);
  return {
    title: product.name + " - dashboard ",
    openGraph: {
      images: [
        {
          url: product.preview,
        },
      ],
    },
  };
}

export default async function premadePage({ params: { variant_id } }: { params: { variant_id: string } }) {
  const variant = await getVariant(variant_id);
  return (
    <div className='premade_page_wrapper'>
      <div className='premade min-[860px]:grid grid-cols-2'>
        <section className='product-details bg-white rounded mt-2 mb-4 shadow px-2 py-4'>
          <VariantDetails variant={variant} />
        </section>
        <section className='premade_images bg-white rounded mt-2 mb-4 shadow px-2 py-4'>
          <VariantImages variantImage={variant.preview} />
        </section>
      </div>
      <div className='update_premade mt-5 mb-3'>
        <UpdateVariantDetails variant={variant} />
      </div>
    </div>
  );
}
