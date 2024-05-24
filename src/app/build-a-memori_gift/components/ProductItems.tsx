"use client";
import React from "react";
import Product_item from "./Product_item";
import { useFilteredData } from "../context/Filter_Context";
import LoadingSpin from "@/app/components/LoadingSpin";

export default function ProductItems() {
  const { filteredData: items, isPending } = useFilteredData();
  return (
    <>
      <div className='items grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(135px,_1fr))] lg:grid-cols-4'>
        {items.map((item) => {
          return <Product_item key={item.id} item={item} />;
        })}
      </div>
      {!isPending && items.length == 0 && <p className='h-80 grid place-content-center'>no items found</p>}
      {isPending && <LoadingSpin />}
    </>
  );
}
