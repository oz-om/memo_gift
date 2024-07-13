"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
export async function setAsShipped(orderId: number) {
  try {
    await prisma.$transaction(async () => {
      await prisma.shippedOrder.create({
        data: {
          order_id: orderId,
        },
      });
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          order_status: "shipped",
        },
      });
    });
    // to do :
    // send email to recipient that his product is shipped

    revalidatePath("/");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
export async function setAsRejected(orderId: number) {
  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        order_status: "rejected",
      },
    });

    // to do :
    // send email to recipient that his product is shipped

    revalidatePath("/");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
