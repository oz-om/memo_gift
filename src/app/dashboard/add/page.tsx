import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Premade_gift from "./type/Premade_gift";
import Item from "./type/Item";
import Postcard from "./type/Postcard";
import { createNewItem, createNewPremade } from "../_actions/actions";
import Loading from "@/app/components/LoadingSpin";

export default function AddPage({ searchParams: { type } }: { searchParams: { type: string } }) {
  if (type !== "premade-gift" && type !== "item" && type !== "postcard") {
    redirect("/dashboard/add?type=premade-gift");
  }

  return (
    <>
      {(!type || type == "premade-gift") && (
        <Suspense fallback={<Loading />}>
          <Premade_gift action={createNewPremade} />
        </Suspense>
      )}
      {type == "item" && (
        // <Suspense fallback={"waiting create item ..."}>
        <Item action={createNewItem} />
        // </Suspense>
      )}
      {type == "postcard" && (
        // <Suspense fallback={"waiting PostCard..."}>
        <Postcard />
        // </Suspense>
      )}
    </>
  );
}
