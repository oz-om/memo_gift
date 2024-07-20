import React from "react";
import StatisticOrderValue from "./components/StatisticOrderValue";
import { T_OrdersGetAPIResponse } from "@/app/api/dashboard/orders_statistics/route";
import { Prisma } from "@prisma/client";

export default async function StatisticsList() {
  console.log("we now on this step to get orders");

  // const allOrdersReq = await fetch(`${process.env.APP_API_URL}/dashboard/orders_statistics`, {
  //   cache: "no-cache",
  // });

  // const allOrdersRes: T_OrdersGetAPIResponse = await allOrdersReq.json();
  // console.log("we now have orders " + allOrdersRes);

  // if (!allOrdersRes.success) {
  //   return <p>can't get latest StatisticsList info</p>;
  // }

  // const allOrders = allOrdersRes.orders;
  const allOrders: Prisma.OrderGetPayload<{}>[] = [];
  let rejectedOrders = allOrders.filter((order) => order.order_status === "rejected");
  let shippedOrders = allOrders.filter((order) => order.order_status === "shipped");
  let orders = allOrders.filter((order) => order.order_status !== "rejected");

  return (
    <div className='orders_today_wrapper grid grid-cols-1 min-[300px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 place-content-center '>
      <StatisticOrder name='orders' icon='bx-cart-download' value={`${allOrders.length}`} className='orders_count from-blue-600 to-blue-100 bg-gradient-to-br' />
      <StatisticOrder name='shipped' icon='bxs-package' value={`${shippedOrders.length}`} className='orders_shipped from-teal-600 to-teal-100 bg-gradient-to-br' />
      <StatisticOrder name='pending' icon='bxs-component' value={`${orders.length - shippedOrders.length}`} className='orders_still from-orange-600 to-orange-100 bg-gradient-to-br' />
      <StatisticOrder name='rejected' icon='bxs-error' value={`${rejectedOrders.length}`} className='rejected_orders from-red-600 to-violet-100 bg-gradient-to-br' />
      {/* <StatisticOrder name='complete' icon='bx-line-chart' value={allOrders.length ? `${(allShippedOrders.length * 100) / allOrders.length}%` : "0%"} className='orders_complete_percentage from-violet-600 to-violet-100 bg-gradient-to-br' /> */}
    </div>
  );
}

function StatisticOrder({ className, name, icon, value }: { className?: string; name: string; icon: string; value: string }) {
  return (
    <div className={"border rounded relative min-w-28 w-full overflow-hidden pt-10  " + className}>
      <i className={"bx absolute top-0 right-0 text-6xl text-white opacity-30 " + icon}></i>
      <div className='name absolute top-0 left-0 text-white px-4'>{name}</div>
      {/* <div className='count text-5xl px-3 text-stroke text-white'>{value}</div> */}
      <StatisticOrderValue value={parseInt(value)} name={name} />
    </div>
  );
}
