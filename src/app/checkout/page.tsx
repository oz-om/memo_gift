import Link from "next/link";
import { Suspense } from "react";
import LoadingSpin from "../components/LoadingSpin";
import Address_form from "./components/Address_form";
import CheckoutList from "./components/CheckoutList";

export default function Checkout({ searchParams }: { searchParams: { catitmid: string } }) {
  const { catitmid } = searchParams;

  return (
    <>
      <section className='orders_wrapper'>
        <div className='container'>
          <Suspense fallback={<LoadingSpin />}>
            {/* @ts-ignore async component */}
            <CheckoutList cartItemId={catitmid} />
          </Suspense>

          <div className='confirm_checkout flex justify-end'>
            <Link href={"/checkout/shipping"}>
              <button className='uppercase px-8 py-2 text-teal-300 bg-slate-800 border border-teal-500 rounded-md hover:bg-slate-700'>complete order</button>
            </Link>
          </div>
        </div>
        <Address_form />
      </section>
    </>
  );
}
