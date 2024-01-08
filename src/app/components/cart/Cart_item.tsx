import { Prisma } from "@prisma/client";
import Image from "next/image";
import { DecrementCartItemQuantity, DeleteCartItem, EditCartItem, IncrementCartItemQuantity } from "../client/cartItemOperations";
import Duplicate from "../client/Duplicate";

type cartItem = Prisma.cartItemGetPayload<{
  select: {
    id: true;
    quantity: true;
  };
  include: {
    customGift: {
      select: {
        id: true;
      };
      include: {
        includes: {
          select: {
            quantity: true;
          };
          include: {
            item: true;
          };
        };
      };
    };
    premade: {
      select: {
        id: true;
      };
      include: {
        includes: {
          include: {
            item: true;
          };
        };
      };
    };
    item: true;
    variant: true;
  };
}>;
export default function Cart_item({ cartItem }: { cartItem: cartItem }) {
  let { customGift, premade, item, quantity, variant } = cartItem;
  let withIncludes = !!customGift || !!premade;

  let includes = customGift ? customGift.includes : premade ? premade?.includes : null;

  return (
    <div className='cart_item bg-white odd:my-4 p-4 mx-1 rounded-md'>
      <div className='box_name flex justify-between px-4'>
        <h4 className='line-clamp-2'>{customGift ? "custom gift" : premade ? premade.name : item?.name}</h4>
        <div className='price'>
          <span className='font-sans'>{customGift ? customGift.price * quantity : premade ? premade.price * quantity : (item?.price as number) * quantity}$</span>
        </div>
      </div>
      <div className='includes_items whitespace-nowrap overflow-x-auto my-2 custom-scroll-bar'>
        {withIncludes && (
          <figure className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden'>
            <Image src={`${variant?.preview}`} alt={`${variant?.name}`} width={100} height={100} className='h-full object-none' />
          </figure>
        )}
        {withIncludes ? (
          includes?.map(({ item }, i) => {
            let firstImage = JSON.parse(item.images)[0];
            let isCustomGift = customGift;
            let itemQuantity = 0;
            if (isCustomGift) {
              itemQuantity = customGift?.includes[i].quantity as number;
            }
            return (
              <figure key={item.id} className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden relative'>
                <Image src={firstImage} alt={item.name} width={100} height={100} />
                {itemQuantity >= 1 && <span className='include_item_quantity absolute top-0 right-0 text-[10px] w-4 h-4 pt-[1px] grid place-content-center font-semibold border border-teal-50 bg-teal-500 text-teal-50 rounded-full '>{itemQuantity}</span>}
              </figure>
            );
          })
        ) : (
          <figure className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden'>
            <Image src={`${JSON.parse(item!.images)[0]}`} alt={`${item?.name}`} width={100} height={100} />
          </figure>
        )}
      </div>
      <div className='box_actions flex justify-between px-4'>
        <div className='box_quantity flex items-center gap-x-3'>
          {quantity > 1 && <DecrementCartItemQuantity cartItemId={cartItem.id} />}
          <span className='chosed_item_quantity text-center text-xl'>{quantity}</span>
          <IncrementCartItemQuantity cartItemId={cartItem.id} />
        </div>
        <div className='edit_box flex gap-x-2 text-sm'>
          <Duplicate cartItemId={cartItem.id} />
          {withIncludes && <EditCartItem productId={`${customGift ? customGift.id : premade?.id}`} targetProductType={customGift ? "customGift" : "premade"} />}
          <DeleteCartItem cartItemId={customGift ? customGift.id : cartItem.id} cartItemType={customGift ? "customGift" : "other"} />
        </div>
      </div>
    </div>
  );
}
