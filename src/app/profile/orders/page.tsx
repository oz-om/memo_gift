import React from "react";
import Order from "../components/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/nextAuthOptions";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Memory Gifts",
  description: "here you can find all orders you made.",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const orders = await prisma.order.findMany({
    where: {
      user_id: session.user.id,
    },
    include: {
      product: {
        include: {
          orderedCustomGift: {
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
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <section className='orders_list_wrapper'>
      <div className='container'>
        <h4 className='text-lg uppercase mb-3'>orders list:</h4>
        <div className='orders_list'>
          {orders.map((order) => {
            return <Order key={order.id} order={order} />;
          })}
        </div>
      </div>
    </section>
  );
}
