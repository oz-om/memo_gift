import Image from "next/image";

type itemProps = {
  image: string;
  name: string;
  price: number;
};
export default function Item({ image, name, price }: itemProps) {
  return (
    <div className='item rounded-md overflow-hidden shadow'>
      <figure>
        <Image src={image} alt={name} width={720} height={720} />
      </figure>
      <div className='item_details px-2 pb-2'>
        <h4 className='line-clamp-3 text-sm'>{name}</h4>
        <span className='font-sans'>{price}$</span>
      </div>
    </div>
  );
}
