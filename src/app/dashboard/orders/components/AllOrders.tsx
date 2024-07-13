"use client";
import React, { useEffect, useState } from "react";
import LastOrder, { T_Order } from "../../home/components/LastOrder";
import InfiniteScroll from "react-infinite-scroll-component";
import { getOrders, getOrdersTotal } from "../../_actions/orderActions";
import { Spinner } from "@/app/components/LoadingSpin";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { ORDER_STATUS } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { ORDERS_LIMIT_PAGINATION } from "@/utils";

export default function AllOrders() {
  const router = useRouter();
  const searchPrams = useSearchParams();
  const typeParams = searchPrams.get("type");

  const [orders, setOrders] = useState<T_Order[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [date, setDate] = useState<DateValueType>(null);
  const [type, setType] = useState<ORDER_STATUS | "all">(typeParams as ORDER_STATUS);

  const handleDateChange = async (newDate: DateValueType) => {
    setDate(newDate);
    setOrders([]);
    setHasMore(true);
  };

  useEffect(() => {
    (async () => {
      const [orders, ordersTotal] = await Promise.all([getOrders((type == "all" ? null : type) as ORDER_STATUS, { page }, date), getOrdersTotal(type == "all" ? null : type, date)]);
      if (orders.length <= 0 || ordersTotal <= ORDERS_LIMIT_PAGINATION) {
        setHasMore(false);
      }
      setOrders((prev) => [...prev, ...orders]);
    })();
  }, [page, type, date]);

  useEffect(() => {
    if (typeParams !== "all" && typeParams !== "pending" && typeParams !== "shipped" && typeParams != "rejected") {
      router.push("/dashboard/orders?type=all");
    } else {
      setOrders([]);
      setHasMore(true);
      setPage(1);
      setType(typeParams);
      setDate(null);
    }
  }, [typeParams]);

  return (
    <>
      <div className='flittering_by_time '>
        <Datepicker value={date} onChange={handleDateChange} displayFormat='DD/MM/YYYY' showShortcuts={true} separator='to' primaryColor='teal' containerClassName='relative  h-5' inputClassName='w-full bg-slate-50 text-teal-600 rounded pl-2 outline-none focus:ring-slate-400 focus:ring-1 ring-inset' />
      </div>
      <div className='last_orders py-3'>
        <InfiniteScroll
          dataLength={orders.length}
          next={async () => {
            setPage((p) => p + 1);
          }}
          hasMore={hasMore}
          loader={
            <div className='flex justify-center'>
              <Spinner />
            </div>
          }
          endMessage={<p className='text-center text-xs text-slate-600'>No Orders To Load</p>}
          style={{
            overflow: "hidden",
          }}
        >
          <div className='orders_list '>
            {orders.map((order) => {
              return <LastOrder key={order.id} order={order} />;
            })}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
}
