import { authOptions } from "@/utils/nextAuthOptions";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import LoadingSpin from "../components/LoadingSpin";
import CheckoutList from "./components/CheckoutList";

export default async function Checkout({ searchParams }: { searchParams: { catitmid: string } }) {
  let session = await getServerSession(authOptions);
  const { catitmid } = searchParams;

  return (
    <section className='orders_wrapper'>
      <div className='container'>
        <Suspense fallback={<LoadingSpin />}>
          {/* @ts-ignore async component */}
          <CheckoutList cartItemId={catitmid} />
        </Suspense>
      </div>
    </section>
  );
}
