import { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";
import LastOrdersLoading from "./components/loading/LastOrdersLoading";
import LastAdded from "./home/components/LastAdded";
import LastOrdersList from "./home/LastOrdersList";
import StatisticsList from "./home/StatisticsList";
import StatisticLoading from "./components/loading/StatisticLoading";
import LastAddedLoading from "./components/loading/LastAddedLoading";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    nocache: true,
  },
};

export default function Dashboard() {
  return (
    <>
      <section className='orders_progress_section mb-3'>
        <div className='orders_today px-2 pb-4 bg-white rounded shadow'>
          <p className='mb-2'>today</p>
          <Suspense fallback={<StatisticLoading />}>
            <StatisticsList />
          </Suspense>
        </div>
      </section>
      <section className='last_orders_section mb-3'>
        <div className='last_orders_wrapper px-2 bg-white/50 rounded shadow'>
          <Link href={"/dashboard/orders"} className='flex justify-between items-center'>
            <span>last orders</span> <span className='w-12 text-sm text-blue-600'>vew all</span>
          </Link>
          <Suspense fallback={<LastOrdersLoading />}>
            <LastOrdersList />
          </Suspense>
        </div>
      </section>
      <section className='last_added_section mt-2'>
        <div className='last_added_wrapper px-2 bg-white rounded shadow'>
          <p>last added</p>
          <Suspense fallback={<LastAddedLoading />}>
            <LastAdded />
          </Suspense>
        </div>
      </section>
    </>
  );
}
