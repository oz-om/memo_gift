import Carousel from "@/app/components/Carousel";
import { prisma } from "@/lib/db/prisma";
import { Item as ItemType, PremadeGift, Variant } from "@prisma/client";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Metadata } from "next";
import Included_item from "../../components/Included_item";
import Item from "../../components/Item";
import ChoseCardDialog from "../../components/ChoseCardDialog";
import OpenCardsDialog from "../../components/client/OpenCardsDialog";
import ProductVariant from "../../components/client/ProductVariant";
import { formatCurrency } from "@/utils";

type productType = ({ includes: { item: ItemType }[]; variants: { variant: Variant }[] } & PremadeGift) | null;
const getProduct = cache(async (id: string) => {
  let product: productType = null;
  product = await prisma.premadeGift.findUnique({
    where: {
      id,
    },
    include: {
      includes: {
        select: {
          item: true,
        },
      },
      variants: {
        select: {
          variant: true,
        },
      },
    },
  });
  if (!product) return notFound();
  return product;
});

export async function generateMetadata({ params: { premade_id } }: { params: { premade_id: string } }): Promise<Metadata> {
  const product = await getProduct(premade_id);
  return {
    title: product.name,
    description: product.desc,
    alternates: {
      canonical: `/collections/premade/${premade_id}`,
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

export default async function PremadeProduct({ params: { premade_id } }: { params: { premade_id: string } }) {
  const product = await getProduct(premade_id);
  return (
    <>
      <section className='product_wrapper'>
        <div className='container'>
          <div className='path flex mb-4 text-sky-400 text-xs'>
            <h4>Path:</h4>
            <span>collections/premade/{product.name}</span>
          </div>
          <div className='product_content_wrapper md:grid md:gap-x-4 md:grid-cols-[400px_1fr] max-w-5xl mx-auto'>
            <div className='carousel mb-4 area_one'>
              <Carousel slides={JSON.parse(product.images)} />
            </div>
            <div className='product_main_info flex flex-col'>
              <div className='info flex justify-between items-start mb-4'>
                <h4 className='title text-3xl capitalize'>{product.name}</h4>
                <div className='product_price relative'>
                  <span className='current_price text-teal-500 text-xl'>{formatCurrency(product.price)}</span>
                  <span className='old_price absolute top-full left-0 line-through text-amber-500'>{formatCurrency(product.price)}</span>
                </div>
              </div>
              <div className='in_stock_status flex gap-x-2 mb-2'>
                <span className=''>Availability:</span>
                <span className='text-green-400 uppercase'>in stock</span>
              </div>
              <div className='product_properties_wrapper'>
                <div className='colors mb-4'>
                  <h4 className='font-bold text-lg mb-2'>variants:</h4>
                  <div className='options'>
                    <ul className='flex gap-x-2'>
                      {product.variants.map(({ variant: { id, value } }) => {
                        return <ProductVariant key={id} variantId={id} value={value} />;
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='submit_order mb-4 mt-auto'>
                <OpenCardsDialog />
                <ChoseCardDialog productId={product.id} called='premade' />
              </div>
            </div>

            <div className='product_includes_details col-span-2'>
              <h4 className='section_title relative rounded-md text-2xl capitalize font-bolde  pl-8 py-2 mt-10 mb-5'>
                <span>include</span>
                <i className='bx bx-link-alt absolute -left-3 -top-3 text-[40px] text-slate-600/50'></i>
              </h4>
              <ul className='rounded-md overflow-hidden'>
                {product.includes.map(({ item: { id, name, images } }) => {
                  let firstImage = JSON.parse(images);
                  return <Included_item key={id} id={id} name={name} image={firstImage[0]} />;
                })}
              </ul>
            </div>
          </div>
          <div className='product_desc'>
            <h4 className='section_title relative rounded-md text-2xl capitalize font-bolde  pl-8 py-2 mt-10 mb-5'>
              <span>description</span>
              <i className='bx bx-link-alt absolute -left-3 -top-3 text-[40px] text-slate-600/50'></i>
            </h4>
            <p>{product.desc}</p>
          </div>
        </div>
      </section>
      <section className='similar_products mt-8'>
        <div className='container px-4 sm:px-0'>
          <h4 className='section_title relative rounded-md text-2xl capitalize font-bolde  pl-8 py-2 mt-10 mb-5'>
            <span>similar products</span>
            <i className='bx bx-link-alt absolute -left-3 -top-3 text-[40px] text-slate-600/50'></i>
          </h4>
          <div className='top_rate grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
            {/* <Item type={"premade"} variantId='' id={"12345"} name='Baseus Simu Anc True Wireless Earphones s1 Pro Blue6' price={300} image='/images/items_01.png' />
            <Item type={"premade"} variantId='' id={"12345"} name='IPAD PRO 11 (2021) BLUETOOTH KEYBOARD CASE' price={300} image='/images/items_02.png' />
            <Item type={"premade"} variantId='' id={"12345"} name='JR-W050 20W Magnetic Wireless Power Bank with Ring Holder 10000mAh' price={300} image='/images/items_03.png' />
            <Item type={"premade"} variantId='' id={"12345"} name='Baseus Simu Anc True Wireless Earphones s1 Pro Blue' price={300} image='/images/items_04.png' /> */}
          </div>
        </div>
      </section>
    </>
  );
}
