import Image from "next/image";
import Link from "next/link";

export default function Included_item({ id, name, image }: { [key: string]: string }) {
  return (
    <li className='odd:bg-slate-400/20 even:bg-slate-50/30 grid grid-cols-[50px_1fr_50px] gap-x-5 py-2 px-4'>
      <figure className='w-12 h-12'>
        <Image src={image} alt={name} width={200} height={200} />
      </figure>
      <span className=''>{name}</span>
      <Link href={"/collections/" + id + "?t=items"}>view</Link>
    </li>
  );
}
