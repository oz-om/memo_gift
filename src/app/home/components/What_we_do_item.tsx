import Image from "next/image";
import Link from "next/link";

type whatWeDoProps = { [key: string]: string };

export default function what_we_do_item({ image, title, desc, route, routeName }: whatWeDoProps) {
  return (
    <div className='whe_do_item text-sm inline-block w-full px-2'>
      <div className='what_we_do_image relative'>
        <Image className='aspect-square sm:aspect-auto' src={image} width={900} height={900} alt={title} />
      </div>
      <div className='what_we_do_desc'>
        <h4 className='uppercase font-medium'>{title}</h4>
        <p className='font-light whitespace-break-spaces'>{desc}</p>
      </div>
      <div className='what_we_do_redirect'>
        <Link href={route} className='uppercase bg-gray-400/20 py-2 px-4 mt-4 inline-block rounded font-medium hover:bg-gray-400/30'>
          {routeName}
        </Link>
      </div>
    </div>
  );
}
