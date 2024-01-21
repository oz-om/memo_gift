import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Premades() {
  const premades = await prisma.premadeGift.findMany({
    include: {
      variants: {
        include: {
          variant: true,
        },
      },
    },
  });
  return (
    <section className='premades_list_section'>
      <div className='premades grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] lg:grid-cols-4 bg-white rounded border px-2 py-4 shadow-md'>
        {premades.map((premade) => {
          return (
            <div key={premade.id} className='premade py-3 bg-violet-50 px-2 rounded flex flex-col'>
              <figure className=' overflow-hidden rounded-md mb-2'>
                <Image src={`${JSON.parse(premade!.images)[0]}`} alt={"last added premade"} width={200} height={200} />
              </figure>
              <div className='name'>{premade?.name}</div>
              <div className='details flex justify-between mt-2 mb-5'>
                <div className='price'>{premade?.price}$</div>
                <div className='variants flex px-4 gap-x-4'>
                  {premade?.variants.map(({ variant }) => {
                    return <span key={variant.id} className={"inline-block border w-5 h-5 rounded-full"} style={{ backgroundColor: variant.value }}></span>;
                  })}
                </div>
              </div>
              <div className='control_premade flex justify-end items-center flex-wrap  mt-auto '>
                <Link href={"/dashboard/products/premade/" + premade.id} className='w-fit px-4 py-1 bg-blue-50  text-blue-500 rounded-md border border-transparent text-xs hover:border-blue-500'>
                  view
                </Link>
                <Link href={"/dashboard/add?type=premade"} className='w-fit px-4 py-1  text-red-500 rounded-md text-xs'>
                  delete
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
