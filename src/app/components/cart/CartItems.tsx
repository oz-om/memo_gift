import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/utils/nextAuthOptions";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import Cart_item from "./Cart_item";
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
export default async function CartItems() {
  let session = await getServerSession(authOptions);
  let userId: string | undefined;
  let userType: "user_id" | "anonymous_user" = "anonymous_user";
  if (!session) {
    let anonymousUser = cookies().get("anonymousUserId")?.value;
    userId = anonymousUser;
  } else {
    userId = session.user.id;
    userType = "user_id";
  }

  let cart: T_cart = [];
  let totalPrice = 0;

  if (userId) {
    cart = await prisma.cart.findMany({
      where: {
        [userType]: userId,
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
    <>
      <div className='cart_items  overflow-y-auto h-[calc(100%_-_100px)] custom-scroll-bar overscroll-contain'>
        {cart.map(({ cartItem }) => {
          return <Cart_item key={cartItem.id} cartItem={cartItem} />;
        })}
        {!cart.length && (
          <div className='h-[50vh] grid place-content-center'>
            <p className='text-center text-slate-500'>empty</p>
          </div>
        )}
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
    </>
  );
}
