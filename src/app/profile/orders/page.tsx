import React from "react";
import Order from "../components/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/nextAuthOptions";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }
  const orders = await prisma.order.findMany({
    where: {
      user_id: session.user.id,
    },
    select: {
      confirmedOrder: {
        include: {
          order: {
            include: {
              product: {
                include: {
                  customGift: true,
                  premade: true,
                  item: true,
                  variant: true,
                },
              },
            },
          },
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
          {orders.map(({ confirmedOrder }) => {
            return <Order key={confirmedOrder[0].id} confirmed={confirmedOrder[0]} />;
          })}
        </div>
      </div>
    </section>
  );
}
