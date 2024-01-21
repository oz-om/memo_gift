import { prisma } from "@/lib/db/prisma";
import React from "react";
import StatisticOrder from "./components/StatisticOrder";

export default async function StatisticsList() {
  let allOrders = await prisma.confirmedOrder.findMany();
  let allShippedOrders = await prisma.shippedOrder.findMany();

  return (
    <div className='orders_today_wrapper grid grid-cols-1 min-[300px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 place-content-center '>
      <StatisticOrder name='orders' icon='bx-cart-download' value={`${allOrders.length}`} className='orders_count from-blue-600 to-blue-100 bg-gradient-to-br' />
      <StatisticOrder name='shipped' icon='bxs-package' value={`${allShippedOrders.length}`} className='orders_shipped from-teal-600 to-teal-100 bg-gradient-to-br' />
      <StatisticOrder name='pending' icon='bxs-component' value={`${allOrders.length - allShippedOrders.length}`} className='orders_still from-orange-600 to-orange-100 bg-gradient-to-br' />
      <StatisticOrder name='complete' icon='bx-line-chart' value={allOrders.length ? `${(allShippedOrders.length * 100) / allOrders.length}%` : "0%"} className='orders_complete_percentage from-violet-600 to-violet-100 bg-gradient-to-br' />
    </div>
  );
}
