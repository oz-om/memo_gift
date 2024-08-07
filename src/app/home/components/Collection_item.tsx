import { formatCurrency } from "@/utils";
import Image from "next/image";
type collectionItemProps = {
  image: string;
  name: string;
  price: number;
};
export default function Collection_item({ image, name, price }: collectionItemProps) {
  return (
    <div className='collection_item'>
      <div className='collection_image'>
        <Image src={image} width={700} height={700} alt={name} className='aspect-square' />
      </div>
      <div className='collection_details pt-2 px-3'>
        <h4 className='font-light line-clamp-2'>{name}</h4>
        <span className='price font-sans text-slate-600'>{formatCurrency(price)}</span>
      </div>
    </div>
  );
}
