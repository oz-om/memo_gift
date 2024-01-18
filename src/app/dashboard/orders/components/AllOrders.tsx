import { prisma } from "@/lib/db/prisma";
import React from "react";
import LastOrder from "../../home/components/LastOrder";

export default async function AllOrders() {
  const allOrders = await prisma.confirmedOrder.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      order: {
        order_status: "pending",
      },
    },
    include: {
      order: {
        include: {
          product: {
            include: {
              item: true,
              premade: {
                include: {
                  includes: true,
                },
              },
              customGift: {
                include: {
                  includes: true,
                },
              },
              variant: true,
            },
          },
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
