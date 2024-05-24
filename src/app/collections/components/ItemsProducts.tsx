"use client";
import Item from "./Item";
import { useFilteredData } from "../context/Filter_Context";
import LoadingSpin from "@/app/components/LoadingSpin";

export default function ItemsProducts() {
  const { filteredData: items, isPending } = useFilteredData();

  return (
    <>
      <div className='items grid gap-5 min-[300px]:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-4'>
        {!isPending &&
          items.map(({ id, name, images, price }) => {
            let firstImage = JSON.parse(images);
            return <Item key={id} id={id} image={firstImage[0]} name={name} price={price} type={"items"} />;
          })}
      </div>
      {!isPending && items.length == 0 && <p className='h-80 grid place-content-center'>no items found</p>}
      {isPending && <LoadingSpin />}
    </>
  );
}
