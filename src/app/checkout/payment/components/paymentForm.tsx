"use client";
import { formatCurrency } from "@/utils";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { T_inishilazedOrder } from "../../actions/action";
import InitializedOrders from "./initializedOrders";

export default function PaymentForm({ price, initializedOrders }: { price: number; initializedOrders: T_inishilazedOrder[] }) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState<string>("");
  const [loadingPaymentElement, setLoadingPaymentElement] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitPayment() {
    if (!stripe || !elements || email.trim().length == 0) return;
    setIsSubmitting(true);
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          receipt_email: email,
          payment_method_data: {
            billing_details: {
              address: {
                country: null,
                postal_code: null,
              },
            },
          },
        },
      })
      .then(({ error }) => {
        if (error) {
          setIsSubmitting(false);
          switch (error.type) {
            case "card_error":
            case "validation_error":
              console.log(error.message);
              break;
            default:
              console.log("payment process failed");
              break;
          }
        }
      });
  }

  return (
    <div className='payment_wrapper '>
      <div className='purchases bg-slate-50 py-4 '>
        <div className='container'>
          <h1 className='text-3xl my-2 tracking-wider'>Purchases:</h1>
          <div className='orders_wrapper flex flex-wrap gap-x-20 gap-y-10 '>
            <InitializedOrders orders={initializedOrders} />
          </div>
        </div>
      </div>
      <div className='pay_wrapper'>
        <form action={submitPayment} id='payment-form' className='max-w-sm mx-auto mt-3'>
          <PaymentElement
            id='payment-element'
            className='my-5'
            options={{
              fields: {
                billingDetails: {
                  address: {
                    country: "never",
                    postalCode: "never",
                  },
                },
              },
            }}
            onLoaderStart={() => setLoadingPaymentElement(true)}
            onReady={() => setLoadingPaymentElement(false)}
          />
          {loadingPaymentElement ? (
            <div className='grid place-content-center'>
              <svg className='animate-spin' width='30px' height='30px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M17.6566 12H21M3 12H6.34315M12 6.34342L12 3M12 21L12 17.6569' stroke='#363853' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M16 8.00025L18.3642 5.63611M5.63629 18.364L8.00025 16M8.00022 8.00025L5.63608 5.63611M18.364 18.364L16 16' stroke='#0095FF' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </div>
          ) : (
            <>
              <div className='mb-4'>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  Email
                </label>
                <input value={email} onInput={(e) => setEmail(e.currentTarget.value)} type='email' id='email' name='email' placeholder='email' required className='mt-1 block w-full p-3 text-lg border border-slate-300 shadow-sm focus:ring-blue-200 focus:ring-2 ' />
              </div>
              <button disabled={!stripe || !elements || isSubmitting} id='submit' className={"w-full text-teal-300 border border-teal-300 rounded text-center py-2 " + (isSubmitting ? " pointer-events-none bg-slate-500" : " bg-slate-800")}>
                pay - {formatCurrency(price)}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
