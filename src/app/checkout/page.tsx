import { Suspense } from "react";
import LoadingSpin from "../components/LoadingSpin";
import CheckoutList from "./components/CheckoutList";

export default async function Checkout({ searchParams }: { searchParams: { catitmid: string } }) {
  const { catitmid } = searchParams;

  return (
    <section className='orders_wrapper'>
      <div className='container'>
        <Suspense fallback={<LoadingSpin />}>
          <CheckoutList cartItemId={catitmid} />
        </Suspense>
      </div>
    </section>
  );
}
