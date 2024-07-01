"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
export default function PaymentProvider({ children, clientSecret }: { children: React.ReactNode; clientSecret: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  );
}
