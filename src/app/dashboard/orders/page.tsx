import React, { Suspense } from "react";
import AllOrders from "./components/AllOrders";

import type { Metadata } from "next";
import LastOrdersLoading from "../components/loading/LastOrdersLoading";
export const metadata: Metadata = {
  title: "Orders - Dashboard",
  robots: {
    index: false,
    nocache: true,
  },
};

export default function OrdersPage({ searchParams: { type } }: { searchParams: { type: string } }) {
  return (
    <section className='all_orders_wrapper px-2 bg-white/50 rounded shadow'>
      <Suspense fallback={<LastOrdersLoading />}>
        <AllOrders />
      </Suspense>
    </section>
  );
}
