import Cart_item from "./Cart_item";
import Link from "next/link";
import { Close_cart } from "../client/Navbar";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

type T_cart = Prisma.CartGetPayload<{
  include: {
    cartItem: {
      include: {
        customGift: {
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
    };
  };
}>[];

export default async function Cart_wrapper() {
  let anonymousUser = cookies().get("anonymousUserId")?.value;
  let cart: T_cart = [];
  let totalPrice = 0;
  if (anonymousUser) {
    cart = await prisma.cart.findMany({
      where: {
        anonymous_user: anonymousUser,
      },
      include: {
        cartItem: {
          include: {
            customGift: {
              include: {
                includes: {
                  include: {
                    item: true,
                  },
                },
              },
            },
            premade: {
              include: {
                includes: {
                  include: {
                    item: true,
                  },
                },
              },
            },
            item: true,
            variant: true,
          },
        },
      },
    });
    let cartItems = cart.map((cart) => cart.cartItem);
    totalPrice = cartItems.reduce((acc, cartItem) => {
      let { premade, customGift, item } = cartItem;
      let product = premade || customGift || item;
      let price = product?.price as number;
      return (acc += price * cartItem.quantity);
    }, 0);
  }

  return (
    <div className='cart_content fixed top-0 bottom-0 z-10 bg-slate-50 text-black max-w-sm w-full -right-[100vw] transition-[right]'>
      <div className='cart_head flex items-center border-b '>
        <Close_cart />
        <h4 className='tracking-widest text-3xl text-slate-600 text-center mx-auto'>
          <span className='text-teal-400 inline-flex items-center'>
            <lord-icon src='https://cdn.lordicon.com/pgmktfgp.json' style={{ width: "40px", height: "40px" }} trigger='hover' colors='primary:#9cf4df,secondary:#848484'></lord-icon>
            <span>Your Cart</span>
          </span>
        </h4>
      </div>
      <div className='cart_items  overflow-y-auto h-[calc(100%_-_100px)] custom-scroll-bar overscroll-contain'>
        {cart.map(({ cartItem }) => {
          return <Cart_item key={cartItem.id} cartItem={cartItem} />;
        })}
        {!cart.length && (
          <div className='h-[calc(100%_-_100px)] grid place-content-center'>
            <p className='text-center'>empty</p>
          </div>
        )}
        {/* <Cart_item name={"happy birthday"} quantity={1} totalPrice={120} includes={["/images/items_01.png", "/images/items_02.png", "/images/items_03.png", "/images/items_05.png", "/images/items_06.png"]} />
        <Cart_item name={"Hallowing Night"} quantity={1} totalPrice={200} includes={["/images/items_03.png", "/images/items_04.png"]} /> */}
      </div>
      <div className='total_price_checkout absolute bottom-0 bg-sky-100 w-full flex justify-between p-2'>
        <div className='price'>
          <span className='text-xl'>Total Price:</span>
          <span className='text-xl ml-2'>${totalPrice}</span>
        </div>
        <div className='checkout'>
          <Link href={"/checkout"} className='text-xl text-slate-600 text-center border border-sky-500 py-1 px-2 rounded-md'>
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
