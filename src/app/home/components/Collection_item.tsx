import { formatCurrency } from "@/utils";
import Image from "next/image";
import Link from "next/link";

type collectionItemProps = {
  id: string;
  image: string;
  name: string;
  price: number;
  type: "premade" | "items";
};

export default function Collection_item({ id, image, name, price, type }: collectionItemProps) {
  return (
    <div className='collection_item  group/item'>
      <div className='collection_image relative'>
        <Image src={image} width={700} height={700} alt={name} className='aspect-square' />
        <div
          className='absolute hidden bottom-0 w-full py-2 bg-slate-600 group-hover/item:block text-white'
          style={{
            background: "linear-gradient(to bottom, transparent 20%, black 100%)",
          }}
        >
          <div className={"mt-8 uppercase " + (type == "items" && "flex")}>
            <div className='shope basis-1/2 text-center'>
              <Link href={"/collections/" + type + "/" + id} className=''>
                shop
              </Link>
            </div>
            {type == "items" && (
              <div className='box basis-1/2 text-center border-l border-white'>
                <button>add to box</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='collection_details pt-2 px-3'>
        <h4 className='font-light line-clamp-2'>{name}</h4>
        <span className='price font-sans text-slate-600'>{formatCurrency(price)}</span>
      </div>
    </div>
  );
}
