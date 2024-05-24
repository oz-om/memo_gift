import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import PremadeDetails from "../components/PremadeDetails";
import UpdatePremadeDetails from "../components/UpdatePremadeDetails";
import PremadeImages from "../components/PremadeImages";
import PremadeVariants from "../components/PremadeVariants";
import PremadeCategories from "../components/PremadeCategories";
export type T_PremadeProductType = Prisma.PremadeGiftGetPayload<{
  include: {
    includes: {
      include: {
        item: true;
      };
    };
    variants: {
      select: {
        variant: {
          select: {
            id: true;
            name: true;
            value: true;
            preview: true;
          };
        };
      };
    };
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

const getPremade = cache(async (id: string) => {
  let product: T_PremadeProductType | null = null;
  try {
    product = await prisma.premadeGift.findUnique({
      where: {
        id,
      },
      include: {
        includes: {
          include: {
            item: true,
          },
        },
        variants: {
          include: {
            variant: true,
          },
        },
        categories: {
          include: {
            cat: true,
          },
        },
      },
    });
    if (!product) return notFound();
    return product;
  } catch (error) {
    console.log(error);
    return product;
  }
});

export async function generateMetadata({ params: { premade_id } }: { params: { premade_id: string } }): Promise<Metadata> {
  const product = await getPremade(premade_id);
  if (!product) return {};
  return {
    title: product.name + " - dashboard ",
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

export default async function premadePage({ params: { premade_id } }: { params: { premade_id: string } }) {
  const premade = await getPremade(premade_id);
  if (!premade) {
    return;
  }
  async function getAllVariants() {
    "use server";
    let variants = await prisma.variant.findMany({
      select: {
        id: true,
        name: true,
        preview: true,
        value: true,
      },
    });
    return variants;
  }
  return (
    <div className='premade_page_wrapper'>
      <div className='premade min-[860px]:grid grid-cols-2'>
        <section className='product-details bg-white rounded mt-2 mb-4 shadow px-2 py-4'>
          <PremadeDetails premade={premade} />
          <section>
            <PremadeVariants variants={premade.variants} getAllVariants={getAllVariants} />
            <PremadeCategories categories={premade.categories} />
          </section>
        </section>
        <section className='premade_images bg-white rounded mt-2 mb-4 shadow px-2 py-4'>
          <PremadeImages premadeImages={premade.images} />
        </section>
      </div>
      <div className='update_premade mt-5 mb-3'>
        <UpdatePremadeDetails premade={premade} />
      </div>
    </div>
  );
}
