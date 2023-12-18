import Image from "next/image";
import Link from "next/link";
type itemProps = {
  id: string;
  image: string;
  name: string;
  price: number;
  type: string;
};
export default function Item({ id, image, name, price, type }: itemProps) {
  return (
    <div className='rounded-md overflow-hidden shadow'>
      <Link href={"/collections/" + id + "?t=" + type}>
        <figure>
          <Image src={image} alt={name} width={720} height={720} />
        </figure>
        <div className='item_details px-2 pb-2'>
          <h4 className='line-clamp-3'>{name}</h4>
          <span className='font-sans'>{price}$</span>
        </div>
      </Link>
    </div>
  );
}
