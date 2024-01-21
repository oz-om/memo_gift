import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function LastAdded() {
  const lastPremade = await prisma.premadeGift.findFirst({
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
  const lastItem = await prisma.item.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  const lastPostCard = await prisma.postCard.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className='last_added py-3 grid min-[345px]:grid-cols-2 sm:flex justify-around gap-5'>
      {/* premade */}
      <div className='added py-3 bg-violet-50 px-2 rounded flex flex-col'>
        <figure className='relative overflow-hidden rounded-md mb-2'>
          <span className='absolute top-0 left-0 bg-teal-400 rounded-md  py-1 px-2 text-white text-sm'>premade</span>
          <Image src={`${JSON.parse(lastPremade!.images)[0]}`} alt={"last added premade"} width={200} height={200} />
        </figure>
        <div className='name'>{lastPremade?.name}</div>
        <div className='details flex justify-between mt-2 mb-5'>
          <div className='price'>{lastPremade?.price}$</div>
          <div className='variants flex px-4 gap-x-4'>
            {lastPremade?.variants.map(({ variant }) => {
              return <span key={variant.id} className={"rounded-md px-2 py-1 inline-block border w-10 "} style={{ backgroundColor: variant.value }}></span>;
            })}
          </div>
        </div>
        <div className='add_new grid place-content-center mt-auto'>
          <Link href={"/dashboard/add?type=premade"} className='w-fit px-8 py-1 bg-teal-600 text-white rounded-md'>
            add new
          </Link>
        </div>
      </div>
      {/* item */}
      <div className='added py-3 bg-blue-50 px-2 rounded flex flex-col'>
        <figure className='relative overflow-hidden rounded-md mb-2'>
          <span className='absolute top-0 left-0 bg-blue-400 rounded-md  py-1 px-2 text-white text-sm'>item</span>
          <Image src={`${JSON.parse(lastItem!.images)[0]}`} alt={"last added premade"} width={200} height={200} />
        </figure>
        <div className='name'>{lastItem?.name}</div>
        <div className='details flex justify-between mt-2 mb-5'>
          <div className='price'>{lastItem?.price}$</div>
        </div>
        <div className='add_new grid place-content-center mt-auto'>
          <Link href={"/dashboard/add?type=item"} className='w-fit px-8 py-1 bg-blue-600 text-white rounded-md'>
            add new
          </Link>
        </div>
      </div>
      {/* post card */}
      <div className='added py-3 bg-orange-50 px-2 rounded flex flex-col'>
        <figure className='relative overflow-hidden rounded-md mb-2'>
          <span className='absolute top-0 left-0 bg-orange-400 rounded-md  py-1 px-2 text-white text-sm'>post card</span>
          <Image src={`${lastPostCard?.image}`} alt={"last added premade"} width={200} height={200} />
        </figure>
        <div className='name mb-5'>{lastPostCard?.name}</div>
        <div className='add_new grid place-content-center mt-auto'>
          <Link href={"/dashboard/add?type=postcard"} className='w-fit px-8 py-1 bg-orange-600 text-white rounded-md'>
            add new
          </Link>
        </div>
      </div>
    </div>
  );
}
