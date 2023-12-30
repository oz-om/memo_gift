import { Prisma } from "@prisma/client";
import Image from "next/image";

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
          <span className='font-sans'>{customGift ? customGift.price : premade ? premade.price : item?.price}$</span>
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
          <i className='bx bx-plus border grid place-content-center h-5 rounded-md font-bold cursor-pointer  hover:border-slate-700'></i>
          <span className='chosed_item_quantity text-center text-xl'>{quantity}</span>
          <i className='bx bx-minus border grid place-content-center h-5 rounded-md font-bold cursor-pointer hover:border-slate-700'></i>
        </div>
        <div className='edit_box flex gap-x-2 text-sm'>
          <div className='edit px-4 grid place-content-center rounded-md border border-teal-400 text-teal-400 cursor-pointer hover:bg-teal-50'>
            <>edit</>
          </div>
          <div className='delete px-4 grid place-content-center rounded-md text-red-400 cursor-pointer hover:bg-red-50'>
            <>delete</>
          </div>
        </div>
      </div>
    </div>
  );
}
