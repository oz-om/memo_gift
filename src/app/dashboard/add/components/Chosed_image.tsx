import Image from "next/image";
import React from "react";

export default function Chosed_image({ image }: { image: string }) {
  return (
    <div className='chosed_image relative w-28 rounded-md shadow p-1'>
      <figure className='overflow-hidden rounded'>
        <Image src={image} alt='chosed_image' width={470} height={470} />
      </figure>
      <i className='bx bx-x bx-border absolute top-0 right-0 text-red-600 bg-red-50 cursor-pointer'></i>
    </div>
  );
}
