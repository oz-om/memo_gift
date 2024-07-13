import { formatCurrency } from "@/utils";
import Image from "next/image";
import React from "react";
import { T_inishilazedOrder } from "../../actions/action";

export default function InitializedOrders({ orders }: { orders: T_inishilazedOrder[] }) {
  return (
    <>
      {orders.map((order) => {
        const { premade, item, customGift, variant, quantity } = order.cartItem;

        const withIncludes = premade || customGift;
        if (withIncludes && variant) {
          const { name, price } = withIncludes;
          const included = withIncludes.includes.map((included) => ({
            name: included.item.name,
            image: JSON.parse(included.item.images)[0],
            quantity: included.quantity,
          }));

          return <BoxOrder key={order.cartItem_Id} name={name ? name : "customGift"} variantName={variant.name} variantPreview={variant.preview} quantity={quantity} price={price * quantity} includes={included} />;
        }
        if (!withIncludes && item) {
          return <ItemOrder key={order.cartItem_Id} name={item.name} image={JSON.parse(item.images)[0]} price={item.price * quantity} quantity={quantity} />;
        }
      })}
    </>
  );
}

function BoxOrder({ name, variantName, variantPreview, includes, quantity, price }: { name: string; variantPreview: string; variantName: string; includes: { name: string; image: string; quantity: number }[]; quantity: number; price: number }) {
  return (
    <div className='order shadow rounded p-4'>
      <div className='order_type'>
        <h4 className='text-xl '>{name}</h4>
        <p className='text-sm'>
          type: <span className='font-bold'>box</span>
        </p>
      </div>
      <div className='order_header flex'>
        <div className='box border-r pr-2'>
          <h4 className='text-sm'>
            box: <span className='font-bold'>{variantName}</span>
          </h4>
          <figure>
            <Image src={variantPreview} alt={variantName} width={120} height={120} className='aspect-square' />
          </figure>
        </div>
        <div className='includes ml-2'>
          <h4>includes:</h4>
          <div className='included flex flex-col'>
            {includes.map(({ name, image, quantity }) => {
              return (
                <figure key={name} className='size-8 inline-block mr-1 align-middle rounded-lg overflow-hidden relative'>
                  <Image src={image} alt={name} width={50} height={50} className='aspect-square' />
                  {quantity >= 1 && <span className='include_item_quantity absolute top-0 right-0 text-[10px] w-4 h-4 pt-[1px] grid place-content-center font-semibold border border-teal-50 bg-teal-500 text-teal-50 rounded-full '>{quantity}</span>}
                </figure>
              );
            })}
          </div>
        </div>
      </div>
      <div className='order_details flex justify-between'>
        <div className='quantity flex gap-4'>
          <p>quantity:</p>
          <span>{quantity}</span>
        </div>
        <div className='price'>
          <span>{formatCurrency(price)}</span>
        </div>
      </div>
    </div>
  );
}

function ItemOrder({ name, image, quantity, price }: { name: string; image: string; quantity: number; price: number }) {
  return (
    <div className='order shadow rounded p-4'>
      <div className='order_type'>
        <h4 className='text-xl max-w-48 line-clamp-2'>{name}</h4>
        <p className='text-sm'>
          type: <span className='font-bold'>item</span>
        </p>
      </div>
      <div className='order_header'>
        <figure>
          <Image src={image} alt={image} width={150} height={150} className='max-h-40 aspect-square' />
        </figure>
      </div>
      <div className='order_details flex justify-between'>
        <div className='quantity flex gap-x-4'>
          <p>quantity:</p>
          <span>{quantity}</span>
        </div>
        <div className='price'>
          <span>{formatCurrency(price)}</span>
        </div>
      </div>
    </div>
  );
}
