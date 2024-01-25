import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Variants() {
  const variants = await prisma.variant.findMany();
  return (
    <section className='variants_section_wrapper'>
      <div className='postcards grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] lg:grid-cols-4 bg-white rounded border px-2 py-4 shadow-md'>
        {variants.map((variant) => {
          return (
            <div key={variant.id} className='added py-3 bg-violet-50 px-2 rounded flex flex-col'>
              <figure className=' overflow-hidden rounded-md mb-2'>
                <Image src={`${variant?.preview}`} alt={"last added variant"} width={200} height={200} />
              </figure>
              <div className='name mb-5'>{variant?.name}</div>
              <div className='control_variant flex justify-end items-center flex-wrap  mt-auto  '>
                <Link href={"/dashboard/products/variant/" + variant.id} className='w-fit px-4 py-1 bg-blue-50  text-blue-500 rounded-md border border-transparent text-xs hover:border-blue-500'>
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
