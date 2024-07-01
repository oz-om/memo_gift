import { prisma } from "@/lib/db/prisma";
import React from "react";
import LastOrder from "./components/LastOrder";

export default async function LastOrdersList() {
  const allOrders = await prisma.order.findMany({
    take: 4,
    skip: 0,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: {
        include: {
          item: true,
          premade: {
            include: {
              includes: true,
            },
          },
          orderedCustomGift: {
            include: {
              includes: true,
            },
          },
          variant: true,
        },
      },
    },
  });
  return (
    <div className='last_orders py-3'>
      {allOrders.map((order) => {
        return <LastOrder key={order.id} order={order} />;
      })}
    </div>
  );
}
