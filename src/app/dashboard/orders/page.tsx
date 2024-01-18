import React, { Suspense } from "react";
import AllOrders from "./components/AllOrders";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Orders - Dashboard",
  robots: {
    index: false,
    nocache: true,
  },
};

export default function OrdersPage() {
  return (
    <>
      <section className='all_orders_head_wrapper px-2 bg-white/50 rounded shadow'>
        <p className=''>last orders</p>
      </section>
      <section className='all_orders_wrapper px-2 bg-white/50 rounded shadow'>
        <Suspense fallback='waiting all orders...'>
          {/* @ts-ignore async component */}
          <AllOrders />
        </Suspense>
      </section>
    </>
  );
}
