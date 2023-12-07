import Image from "next/image";

type chosedItemProps = {
  image: string;
  name: string;
  price: number;
};
export default function Chosed_item({ image, name, price }: chosedItemProps) {
  return (
    <div className='item rounded-md overflow-hidden shadow w-20 relative'>
      <figure>
        <Image src={image} alt={name} width={720} height={720} />
      </figure>
      <div className='item_details px-2 pb-2'>
        <h4 className='line-clamp-3 text-xs'>{name}</h4>
        <span className='font-sans text-xs'>{price}$</span>
      </div>
      <i className='bx bx-x mx-sm bx-border absolute top-0 right-0 bg-red-200 text-red-600 cursor-pointer'></i>
    </div>
  );
}
