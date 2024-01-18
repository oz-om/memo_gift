import { prisma } from "@/lib/db/prisma";
import React from "react";
import LastOrder from "./components/LastOrder";

export default async function LastOrdersList() {
  const allOrders = await prisma.confirmedOrder.findMany({
    take: 4,
    skip: 0,
    orderBy: {
      createdAt: "desc",
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
      {/* <LastOrder name='thanks for thanks' type='premade' time='today at 14:34' includeCount={3} price={22} image='/images/step-one-pack-one.png' />
      <LastOrder name='thanks for thanks' type='item' time='today at 13:40' includeCount={0} price={12} image='/images/items_05.png' />
      <LastOrder name='thanks for thanks' type='custom' time='today at 07:04' includeCount={3} price={32} image='/images/step-one-pack-one.png' />
      <LastOrder name='thanks for thanks' type='premade' time='today at 06:12' includeCount={2} price={11} image='/images/step-one-pack-two.png' /> */}
    </div>
  );
}
