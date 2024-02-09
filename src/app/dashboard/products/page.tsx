import { Metadata } from "next";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { ItemsPulsLoading, PostCardsPulsLoading, PremadesPulsLoading } from "../components/loading/LastAddedLoading";
import Items from "./components/Items";
import Postcards from "./components/Postcards";
import Premades from "./components/Premades";
import Variants from "./components/Variants";

export const metadata: Metadata = {
  title: "Products - Dashboard",
};

export default function Products({ searchParams: { type } }: { searchParams: { type: string } }) {
  if (type !== "premade-gifts" && type !== "items" && type !== "postcards" && type != "variants") {
    redirect("/dashboard/products?type=premade-gifts");
  }

  return (
    <>
      {(!type || type == "premade-gifts") && (
        <Suspense fallback={<PremadesPulsLoading />}>
          {/* @ts-ignore async component */}
          <Premades />
        </Suspense>
      )}
      {type == "items" && (
        <Suspense fallback={<ItemsPulsLoading />}>
          {/* @ts-ignore async component */}
          <Items />
        </Suspense>
      )}
      {type == "postcards" && (
        <Suspense fallback={<PostCardsPulsLoading />}>
          {/* @ts-ignore async component */}
          <Postcards />
        </Suspense>
      )}
      {type == "variants" && (
        /* @ts-ignore async component */
        <Variants />
      )}
    </>
  );
}
