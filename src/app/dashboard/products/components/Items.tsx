import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Items() {
  const items = await prisma.item.findMany();
  return (
    <section className='items-section-wrapper'>
      <div className='items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] lg:grid-cols-4 bg-white rounded border px-2 py-4 shadow-md'>
        {items.map((item) => {
          return (
            <div key={item.id} className='added py-3 bg-blue-50 px-2 rounded flex flex-col'>
              <figure className=' overflow-hidden rounded-md mb-2'>
                <Image src={`${JSON.parse(item!.images)[0]}`} alt={"last added premade"} width={200} height={200} />
              </figure>
              <div className='name'>{item?.name}</div>
              <div className='details flex justify-between mt-2 mb-5'>
                <div className='price'>{item?.price}$</div>
              </div>
              <div className='control_item flex justify-end items-center flex-wrap  mt-auto  '>
                <Link href={"/dashboard/products/item/" + item.id} className='w-fit px-4 py-1 bg-blue-50  text-blue-500 rounded-md border border-transparent text-xs hover:border-blue-500'>
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
