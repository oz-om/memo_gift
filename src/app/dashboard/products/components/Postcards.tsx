import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Postcards() {
  const postcards = await prisma.postCard.findMany();
  return (
    <section className='postcards_section_wrapper'>
      <div className='postcards grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] lg:grid-cols-4 bg-white rounded border px-2 py-4 shadow-md'>
        {postcards.map((postcard) => {
          return (
            <div key={postcard.id} className='added py-3 bg-orange-50 px-2 rounded flex flex-col'>
              <figure className=' overflow-hidden rounded-md mb-2'>
                <Image src={`${postcard?.image}`} alt={"last added premade"} width={200} height={200} />
              </figure>
              <div className='name mb-5'>{postcard?.name}</div>
              <div className='control_postcard flex justify-end items-center flex-wrap  mt-auto  '>
                <Link href={"/dashboard/add?type=premade"} className='w-fit px-4 py-1 bg-blue-50  text-blue-500 rounded-md border border-transparent text-xs hover:border-blue-500'>
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
