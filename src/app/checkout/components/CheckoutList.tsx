import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import SetupOrder from "./client/SetupOrder";
import OrdersList from "./client/OrdersList";
import { isUser } from "@/app/action";
import { formatCurrency } from "@/utils";
export type T_Orders = Prisma.CartGetPayload<{
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
    user: {
      select: {
        address: {
          select: {
            user_id: true;
            address: true;
            id: true;
          };
        };
      };
    };
  };
}>[];

export default async function CheckoutList({ cartItemId }: { cartItemId: string | undefined }) {
  let userType: "user_id" | "anonymous_user" = "anonymous_user";
  let userId: string | undefined = undefined;
  let user = await isUser();

  if (user.email) {
    userId = user.id;
    userType = "user_id";
  } else if (user.id) {
    userId = user.id;
  }
  if (!userId) {
    redirect("/");
  }

  let Orders: T_Orders = [];
  // for checkout one item in cart
  if (cartItemId && cartItemId.trim().length !== 0) {
    let singleCartItem = await prisma.cart.findUnique({
      where: {
        cart_item: cartItemId,
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
            postcard: true,
          },
        },
        user: {
          select: {
            address: {
              select: {
                user_id: true,
                address: true,
                id: true,
              },
            },
          },
        },
      },
    });
    if (!singleCartItem) {
      redirect("/");
    }
    Orders.push(singleCartItem);
  } else {
    // for checkout all cart
    let allCartItems = await prisma.cart.findMany({
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
            postcard: true,
          },
        },
        user: {
          select: {
            address: {
              select: {
                user_id: true,
                address: true,
                id: true,
              },
            },
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
      <OrdersList Orders={Orders} userId={user.email ? user.id : null} />
      <div className='total_price flex items-center justify-end gap-x-4 my-3'>
        <span>subtotal: </span>
        <p className='font-sans text-2xl'>{formatCurrency(totalPrice)}</p>
      </div>
      <div className='confirm_checkout flex justify-end'>
        <SetupOrder orders={Orders} />
      </div>
    </>
  );
}
