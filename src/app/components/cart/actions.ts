"use server";

import { prisma } from "@/lib/db/prisma";
import delay from "@/utils/delay";
import { revalidatePath } from "next/cache";

export async function deleteAction(cartItemId: string, cartItemType: string) {
  try {
    if (cartItemType === "customGift") {
      await prisma.customGift.delete({
        where: {
          id: cartItemId,
        },
      });
      revalidatePath("");
      return {
        delete: true,
      };
    }
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
    revalidatePath("");
    return {
      delete: true,
    };
  } catch (error) {
    return {
      delete: false,
    };
  }
}
export async function editAction() {}

export async function controlCartItemQuantity(cartItemId: string, action: "increment" | "decrement") {
  try {
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: {
          [action]: 1,
        },
      },
    });
    revalidatePath("");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong during " + action + " item quantity",
    };
  }
}
