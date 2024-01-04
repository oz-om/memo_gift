import { prisma } from "@/lib/db/prisma";
import Item from "./Item";

export default async function ItemsProducts() {
  let items = await prisma.item.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className='items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
      {items.map(({ id, name, images, price }) => {
        let firstImage = JSON.parse(images);
        return <Item key={id} id={id} image={firstImage[0]} name={name} price={price} type={"items"} />;
      })}
    </div>
  );
}
