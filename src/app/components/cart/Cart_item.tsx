import { Prisma } from "@prisma/client";
import Image from "next/image";
import { DecrementCartItemQuantity, DeleteCartItem, EditCartItem, IncrementCartItemQuantity } from "../client/cartItemOperations";

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
  };
}>;
export default function Cart_item({ cartItem }: { cartItem: cartItem }) {
  let { customGift, premade, item, quantity } = cartItem;
  let withIncludes = !!customGift || !!premade;
  let includes = customGift ? customGift.includes : premade?.includes;

  return (
    <div className='cart_item bg-white odd:my-4 p-4 mx-1 rounded-md'>
      <div className='box_name flex justify-between px-4'>
        <h4 className='line-clamp-2'>{customGift ? "custom gift" : premade ? premade.name : item?.name}</h4>
        <div className='price'>
          <span className='font-sans'>{customGift ? customGift.price * quantity : premade ? premade.price * quantity : (item?.price as number) * quantity}$</span>
        </div>
      </div>
      <div className='includes_items whitespace-nowrap overflow-x-auto my-2 custom-scroll-bar'>
        {withIncludes ? (
          includes?.map(({ item }) => {
            let firstImage = JSON.parse(item.images)[0];
            return (
              <figure key={item.id} className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden'>
                <Image src={firstImage} alt={item.name} width={100} height={100} />
              </figure>
            );
          })
        ) : (
          <figure className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden'>
            <Image src={JSON.stringify(item?.images)[0]} alt={`${item?.name}`} width={100} height={100} />
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
          <EditCartItem />
          <DeleteCartItem cartItemId={customGift ? customGift.id : cartItem.id} cartItemType={customGift ? "customGift" : "other"} />
        </div>
      </div>
    </div>
  );
}
