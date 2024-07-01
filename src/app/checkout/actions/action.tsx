"use server";
import { isUser } from "@/app/action";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

type T_CartItemData = {
  from: string;
  to: string;
  note: string;
};
export async function updateItemCartAction(cartItemId: string, data: T_CartItemData): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        ...data,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "ops something went wrong, please try again",
    };
  }
}

export async function setAddressToCartItem(address: string, cartItemId: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        address,
      },
    });
    revalidatePath("");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Ops! something went wrong, please try again",
    };
  }
}

// check if each cartItem has an address and push it as an order
type T_order = Prisma.OrderGetPayload<{
  select: {
    id: true;
    user_id: true;
    address: true;
    product_id: true;
  };
}>;
export async function initOrder(orders: string[]): Promise<{ success: true } | { success: false; error: string }> {
  const user = await isUser();
  if (!user.id) {
    return {
      success: false,
      error: "something went wrong, please try again!",
    };
  }

  try {
    // if all cart items includes addresses than its ready to order them
    for (let i = 0; i < orders.length; i++) {
      let existingOrderAddress = await prisma.cartItem.findUnique({
        where: {
          id: orders[i],
        },
        select: {
          id: true,
          address: true,
        },
      });
      if (!existingOrderAddress || !existingOrderAddress.address) {
        return {
          success: false,
          error: "please chose an address or create new one",
        };
      }
      await prisma.initializedOrders.upsert({
        where: {
          cartItem_Id: existingOrderAddress.id,
        },
        update: {},
        create: {
          cartItem_Id: existingOrderAddress.id,
          user_id: user.email ? user.id : null,
          anonymous_user: !user.email ? user.id : null,
        },
      });
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "ops something went wrong!, please try again",
    };
  }
}

export type T_inishilazedOrder = Prisma.initializedOrdersGetPayload<{
  include: {
    cartItem: {
      include: {
        customGift: {
          include: {
            includes: {
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
}>;
export async function createPaymentIntent(): Promise<{ success: true; clientKey: string | null; price: number; ordered: T_inishilazedOrder[] } | { success: false; error: string }> {
  try {
    const user = await isUser();
    if (!user.id) {
      return {
        success: false,
        error: "note found",
      };
    }

    const inishilazedOrder = await prisma.initializedOrders.findMany({
      where: { OR: [{ user_id: user.id }, { anonymous_user: user.id }] },
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
    if (inishilazedOrder.length <= 0) {
      return {
        success: false,
        error: "no orders to pay for",
      };
    }
    let amount = inishilazedOrder.reduce((acc, order) => {
      const product = order.cartItem.customGift || order.cartItem.premade || order.cartItem.item;
      return (acc += product!.price * order.cartItem.quantity);
    }, 0);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: +(amount * 100).toFixed(2),
      currency: "MAD",
      metadata: {
        cartItems: JSON.stringify(inishilazedOrder.map((initOrder) => initOrder.cartItem_Id)),
        userId: user.id,
      },
    });

    return {
      success: true,
      clientKey: paymentIntent.client_secret,
      price: amount,
      ordered: inishilazedOrder,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "something went wrong, please try again!",
    };
  }
}

// export async function confirmOrder(orders: T_order[]): Promise<{ success: true } | { success: false; error: string }> {
//   try {
//     for (let i = 0; i < orders.length; i++) {
//       await prisma.$transaction([
//         prisma.confirmedOrder.create({
//           data: {
//             payment_method: "free",
//             order_id: orders[i].id,
//           },
//         }),
//         prisma.cart.delete({
//           where: {
//             cart_item: orders[i].product_id,
//           },
//         }),
//       ]);
//     }
//     return {
//       success: true,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: "ops something went wrong!, please try again",
//     };
//   }
// }
