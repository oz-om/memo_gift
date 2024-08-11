import { formatCurrency } from "@/utils";
import Image from "next/image";
import { APP_API_URL } from "@/utils";
import { T_getItemsRes } from "@/app/api/items/route";
import { T_getPremadesRes } from "@/app/api/premades/route";

type collectionItemProps = {
  image: string;
  name: string;
  price: number;
};
async function getItems(cacheConfig: RequestInit) {
  try {
    const req = await fetch(`${APP_API_URL}/items`, cacheConfig);
    const res: T_getItemsRes = await req.json();
    if (!res.success) {
      return [];
    }

    return res.items;
  } catch (error) {
    return [];
  }
}
async function getPremades(cacheConfig: RequestInit) {
  try {
    const req = await fetch(`${APP_API_URL}/premades`, cacheConfig);
    const res: T_getPremadesRes = await req.json();
    if (!res.success) {
      return [];
    }
    return res.premades;
  } catch (error) {
    return [];
  }
}

export async function Collection_Items_Wrapper({ cacheConfig }: { cacheConfig: RequestInit }) {
  const recentItems = await getItems(cacheConfig);
  return (
    <div className='collections_items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-4'>
      {recentItems.map((item) => {
        return <Collection_item key={item.id} image={JSON.parse(item.images)[0]} name={item.name} price={item.price} />;
      })}
    </div>
  );
}

export async function Premades_Wrapper({ cacheConfig }: { cacheConfig: RequestInit }) {
  const recentPremades = await getPremades(cacheConfig);

  return (
    <div className='favorites_content grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-4'>
      {recentPremades.map((premade) => {
        return <Collection_item key={premade.id} image={JSON.parse(premade.images)[0]} name={premade.name} price={premade.price} />;
      })}
    </div>
  );
}

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
