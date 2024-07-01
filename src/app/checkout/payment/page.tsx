import React from "react";
import { createPaymentIntent } from "../actions/action";
import { notFound } from "next/navigation";
import PaymentProvider from "./components/paymentProvider";
import PaymentForm from "./components/paymentForm";

export default async function paymentPag() {
  const stripeClientKey = await createPaymentIntent();

  if (!stripeClientKey.success || !stripeClientKey.clientKey) {
    return notFound();
  }

  return (
    <>
      <PaymentProvider clientSecret={stripeClientKey.clientKey}>
        <PaymentForm price={stripeClientKey.price} initializedOrders={stripeClientKey.ordered} />
      </PaymentProvider>
    </>
  );
}
