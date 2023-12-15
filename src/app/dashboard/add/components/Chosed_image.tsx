import Image from "next/image";
import React, { MouseEventHandler } from "react";

export default function Chosed_image({ id, image, removeImage }: { id: string; image: string; removeImage: MouseEventHandler<HTMLElement> }) {
  return (
    <div className='chosed_image relative h-full w-28 rounded-md shadow p-1'>
      <figure className='overflow-hidden rounded h-full'>
        <Image src={image} alt='chosed_image' width={470} height={470} className='object-contain' />
      </figure>
      <i id={id} onClick={removeImage} className='bx bx-x bx-border absolute top-0 right-0 text-red-600 bg-red-50 cursor-pointer'></i>
    </div>
  );
}
