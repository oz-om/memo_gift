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
  if (type !== "premade-gifts" && type !== "items" && type !== "postcards" && type != "variants") {
    redirect("/dashboard/products?type=premade-gifts");
  }

  return (
    <>
      {(!type || type == "premade-gifts") && (
        /* @ts-ignore async component */
        <Premades />
      )}
      {type == "items" && (
        /* @ts-ignore async component */
        <Items />
      )}
      {type == "postcards" && (
        /* @ts-ignore async component */
        <Postcards />
      )}
      {type == "variants" && (
        /* @ts-ignore async component */
        <Variants />
      )}
    </>
  );
}
