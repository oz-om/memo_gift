import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import Items from "./components/Items";
import Postcards from "./components/Postcards";
import Premades from "./components/Premades";
import Variants from "./components/Variants";

export const metadata: Metadata = {
  title: "Products - Dashboard",
};

export default function Products({ searchParams: { type } }: { searchParams: { type: string } }) {
  if (type !== "premade-gift" && type !== "item" && type !== "postcard" && type != "variant") {
    redirect("/dashboard/products?type=premade-gift");
  }

  return (
    <>
      {(!type || type == "premade-gift") && (
        /* @ts-ignore async component */
        <Premades />
      )}
      {type == "item" && (
        /* @ts-ignore async component */
        <Items />
      )}
      {type == "postcard" && (
        /* @ts-ignore async component */
        <Postcards />
      )}
      {type == "variant" && (
        /* @ts-ignore async component */
        <Variants />
      )}
    </>
  );
}
