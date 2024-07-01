import { formatCurrency } from "@/utils";
import Image from "next/image";
import Link from "next/link";
type T_itemProps = {
  id: string;
  image: string;
  name: string;
  price: number;
} & (
  | {
      type: "premade";
      variantId: string;
    }
  | {
      type: "items";
    }
);

export default function Item(props: T_itemProps) {
  let { id, image, name, price, type } = props;
  return (
    <div className='rounded-md overflow-hidden shadow'>
      <Link href={"/collections/" + type + "/" + id + (props.type == "premade" ? "?v=" + props.variantId : "")}>
        <figure>
          <Image src={image} alt={name} width={720} height={720} className='aspect-square' />
        </figure>
        <div className='item_details px-2 pb-2'>
          <h4 className='line-clamp-2'>{name}</h4>
          <span className='font-sans'>{formatCurrency(price)}</span>
        </div>
      </Link>
    </div>
  );
}
