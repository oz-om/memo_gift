"use client";
import Item from "./Item";
import { useFilteredData } from "../context/Filter_Context";
import LoadingSpin from "@/app/components/LoadingSpin";

export default function PremadeProducts() {
  const { filteredData: premades, isPending } = useFilteredData();

  return (
    <>
      <div className='premades grid gap-5 min-[300px]:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-4'>
        {!isPending &&
          premades.map(({ id, name, images, price, variants }) => {
            let variantId = variants?.[0].variant_id as string;
            let firstImage = JSON.parse(images);
            return <Item key={id} id={id} image={firstImage[0]} name={name} price={price} type={"premade"} variantId={variantId} />;
          })}
      </div>
      {!isPending && premades.length == 0 && <p className='h-80 grid place-content-center'>no items found</p>}
      {isPending && <LoadingSpin />}
    </>
  );
}
