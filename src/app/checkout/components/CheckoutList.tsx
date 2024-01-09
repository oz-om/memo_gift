import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import Order from "./Order";
type T_Orders = Prisma.CartGetPayload<{
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
        postcard: true;
      };
    };
  };
}>[];

export default async function CheckoutList({ cartItemId }: { cartItemId: string | undefined }) {
  let Orders: T_Orders = [];
  if (cartItemId && cartItemId.trim().length !== 0) {
    let singleCartItem = await prisma.cart.findUnique({
      where: {
        cart_item: cartItemId,
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
            postcard: true,
          },
        },
      },
    });
    if (!singleCartItem) {
      redirect("/");
    }
    Orders.push(singleCartItem);
  } else {
    let allCartItems = await prisma.cart.findMany({
      where: {
        anonymous_user: "ddd1d48e-862b-4086-8bba-172ca8f67f78",
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
            postcard: true,
          },
        },
      },
    });
    if (allCartItems.length === 0) {
      redirect("/");
    }
    Orders = allCartItems;
  }
  let allCartItems = Orders.map(({ cartItem }) => cartItem);
  let totalPrice = allCartItems.reduce((acc, cartItem) => {
    let productPrice: number | undefined = cartItem.customGift?.price ?? cartItem.premade?.price ?? cartItem.item?.price;
    return (acc += Number(productPrice) * cartItem.quantity);
  }, 0);
  return (
    <>
      <div className='orders_list'>
        {Orders.map(({ cartItem }) => {
          return <Order key={cartItem.id} cartItem={cartItem} />;
        })}
      </div>
      <div className='total_price flex items-center justify-end gap-x-4 my-3'>
        <span>subtotal: </span>
        <p className='font-sans text-2xl'>{totalPrice}$</p>
      </div>
    </>
  );
}
