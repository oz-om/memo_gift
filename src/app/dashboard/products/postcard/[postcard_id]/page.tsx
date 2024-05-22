import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import UpdatePostcardDetails from "../components/UpdatePostcardDetails";
import PostcardImages from "../components/PostcardImages";
import PostcardDetails from "../components/PostcardDetails";
export type T_PostcardProductType = Prisma.PostCardGetPayload<{}>;

const getPostcard = cache(async (id: string) => {
  let product: T_PostcardProductType | null = null;
  product = await prisma.postCard.findUnique({
    where: {
      id,
    },
  });
  if (!product) return notFound();
  return product;
});

export async function generateMetadata({ params: { postcard_id } }: { params: { postcard_id: string } }): Promise<Metadata> {
  const product = await getPostcard(postcard_id);
  return {
    title: product.name + " - dashboard ",
    alternates: {
      canonical: `/collections/premade/${postcard_id}`,
    },
    openGraph: {
      images: [
        {
          url: product.image,
        },
      ],
    },
  };
}

export default async function premadePage({ params: { postcard_id } }: { params: { postcard_id: string } }) {
  const postcard = await getPostcard(postcard_id);
  return (
    <div className='premade_page_wrapper'>
      <div className='premade min-[860px]:grid grid-cols-2'>
        <section className='product-details bg-white rounded mt-2 mb-4 shadow px-2 py-4'>
          <PostcardDetails postcard={postcard} />
        </section>
        <section className='premade_images bg-white rounded mt-2 mb-4 shadow px-2 py-4'>
          <PostcardImages postcardImage={postcard.image} />
        </section>
      </div>
      <div className='update_premade mt-5 mb-3'>
        <UpdatePostcardDetails postcard={postcard} />
      </div>
    </div>
  );
}
