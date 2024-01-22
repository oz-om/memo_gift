import { includeItemType, T_setInputsValue } from "@/types/types";
import Image from "next/image";

type itemProps = includeItemType & {
  includes?: includeItemType[];
  setPremade?: T_setInputsValue;
};
export default function Item({ id, images, name, price, includes, setPremade }: itemProps) {
  function addToIncludes() {
    if (includes && setPremade) {
      let exists = false;
      for (let i = 0; i < includes.length; i++) {
        if (includes[i].id == id) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        console.log("add item to includes");
        setPremade("includes", [
          ...includes,
          {
            id,
            name,
            images,
            price,
          },
        ]);
      }
    }
  }
  return (
    <div onClick={addToIncludes} className='item rounded-md overflow-hidden shadow cursor-pointer'>
      <figure>
        <Image src={images} alt={name} width={720} height={720} />
      </figure>
      <div className='item_details px-2 pb-2'>
        <h4 className='line-clamp-3 text-sm'>{name}</h4>
        <span className='font-sans'>{price}$</span>
      </div>
    </div>
  );
}
