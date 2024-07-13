"use server";
import { prisma } from "@/lib/db/prisma";
import { ORDERS_LIMIT_PAGINATION } from "@/utils";
import { ORDER_STATUS } from "@prisma/client";
import { DateType } from "react-tailwindcss-datepicker";
type T_dateFilter = { startDate: DateType; endDate: DateType } | null;

export async function getOrdersTotal(type: ORDER_STATUS | null = null, date: T_dateFilter = null) {
  const filter = {
    ...(type && { order_status: type }),
    ...(date &&
      date.startDate &&
      date.endDate && {
        createdAt: {
          gte: new Date(`${date.startDate}`),
          lte: new Date(`${date.endDate}`),
        },
      }),
  };
  const ordersTotal = await prisma.order.count({ where: filter });
  return ordersTotal;
}
export async function getOrders(type: ORDER_STATUS | null = null, pagination: { page: number } = { page: 1 }, date: T_dateFilter = null) {
  const { page } = pagination;
  const limit = ORDERS_LIMIT_PAGINATION;
  const skip = (page - 1) * limit;
  const take = limit * page;

  const filteredOrders = await prisma.order.findMany({
    orderBy: {
      createdAt: "asc",
    },
    skip: skip,
    take: take,
    where: {
      ...(type && { order_status: type }),
      ...(date &&
        date.startDate &&
        date.endDate && {
          createdAt: {
            gte: new Date(`${date.startDate}`),
            lte: new Date(`${date.endDate}`),
          },
        }),
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
  console.log("we found " + filteredOrders.length + " of type " + type + " with date : ", date);

  return filteredOrders;
}
