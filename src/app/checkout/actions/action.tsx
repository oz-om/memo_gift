"use server";
import { prisma } from "@/lib/db/prisma";
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
    console.log(error);

    return {
      success: false,
      error: "ops something went wrong, please try again",
    };
  }
}
