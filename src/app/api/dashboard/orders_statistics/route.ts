import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
export type T_OrdersGetAPIResponse = { success: true; orders: Prisma.OrderGetPayload<{}>[] } | { success: false; error: string };

export async function GET() {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setUTCHours(23, 59, 59, 999);
  try {
    let allOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        orders: allOrders,
      }),
      { status: 400 },
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "something went wrong, pleas try again",
      }),
      { status: 500 },
    );
  }
}
