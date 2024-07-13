"use client";
import Image from "next/image";

export default function Chosed_image(props: { id: string; src: string; removeImage: (id: string) => void }) {
  const { id, src, removeImage } = props;
  return (
    <div className='image border rounded p-2 max-w-80 flex flex-col'>
      <figure className='overflow-hidden rounded border h-full mb-2'>
        <Image src={src} alt='premade image' width={180} height={180} className='object-cover aspect-square ' />
      </figure>
      <div className='remove mt-2'>
        <button onClick={() => removeImage(id)} className='text-red-400 text-xs bg-red-50 rounded px-2 py-1 block w-20 ml-auto border border-transparent hover:border-red-300'>
          remove
        </button>
      </div>
    </div>
  );
}
