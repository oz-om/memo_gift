import Pagination from "@/app/components/Pagination";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import CollectionsHeader from "../components/CollectionsHeader";
import Item from "../components/Item";

export const metadata: Metadata = {
  title: "premade",
  description: "make memories beautiful with amazing gifts",
};

export default async function Premade() {
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
    <main>
      <CollectionsHeader />
      <div className='collection_content_wrapper mt-5 relative'>
        <div className='container'>
          <div className='items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
            {premades.map(({ id, name, images, price, variants }) => {
              let variantId = variants[0].variant.id;
              let firstImage = JSON.parse(images);
              return <Item key={id} id={id} image={firstImage[0]} name={name} price={price} type={"premade"} variantId={variantId} />;
            })}
          </div>
        </div>
      </div>
      <Pagination />
    </main>
  );
}
