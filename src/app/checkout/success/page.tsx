import { notFound } from "next/navigation";
import React from "react";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export default async function Success({ searchParams }: { searchParams: { payment_intent: string } }) {
  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent);
  if (!paymentIntent.metadata.cartItems) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className='container'>
      <h4 className='text-4xl tracking-wider my-10 uppercase'>{isSuccess ? "successful" : "failed"}</h4>

      <p className='max-w-2xl flex flex-col'>
        <span>
          Your order has been successfully placed and is now under processing. We'll keep you updated on the shipping status via email
          <span className='px-1 bg-slate-100 '>{paymentIntent.receipt_email}</span>.
        </span>
        <span className='mt-2'>Thank you for choosing us. Enjoy your shopping experience!</span>
      </p>
    </div>
  );
}
