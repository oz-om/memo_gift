"use server";
import { isUser } from "@/app/action";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/utils/nextAuthOptions";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

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
export async function initOrder(orders: string[]): Promise<{ success: true; orders: T_order[] } | { success: false; error: string }> {
  const userId = await isUser();
  let createdOrders: T_order[] = [];
  if (!userId) {
    return {
      success: false,
      error: "something went wrong, please try again!",
    };
  }

  try {
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
      let order = await prisma.order.create({
        data: {
          product_id: existingOrderAddress.id,
          user_id: userId,
          address: existingOrderAddress.address,
          email: "testEmail@example.com",
          order_number: new Date().getTime(),
        },
        select: {
          id: true,
          user_id: true,
          address: true,
          product_id: true,
        },
      });
      createdOrders.push(order);
    }
    // this step is after buying successfully and its place is not here but right now just for testing
    await confirmOrder(createdOrders);
    return {
      success: true,
      orders: createdOrders,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "ops something went wrong!, please try again",
    };
  }
}

export async function confirmOrder(orders: T_order[]): Promise<{ success: true } | { success: false; error: string }> {
  try {
    for (let i = 0; i < orders.length; i++) {
      await prisma.$transaction([
        prisma.confirmedOrder.create({
          data: {
            payment_method: "free",
            order_id: orders[i].id,
          },
        }),
        prisma.cart.delete({
          where: {
            cart_item: orders[i].product_id,
          },
        }),
      ]);
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
