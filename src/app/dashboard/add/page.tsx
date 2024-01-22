import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Premade_gift from "./type/Premade_gift";
import Item from "./type/Item";
import Postcard from "./type/Postcard";
import { createNewItem, createNewPremade } from "../_actions/actions";
import Loading from "@/app/components/LoadingSpin";
import Variants from "./type/Variants";
import { T_PremadeVariant } from "@/types/types";
import { prisma } from "@/lib/db/prisma";

export default async function AddPage({ searchParams: { type } }: { searchParams: { type: string } }) {
  if (type !== "premade-gift" && type !== "item" && type !== "postcard" && type !== "variant") {
    redirect("/dashboard/add?type=premade-gift");
  }
  let variants: T_PremadeVariant[] = [];
  if (type == "premade-gift") {
    variants = await prisma.variant.findMany({
      select: {
        id: true,
        name: true,
        value: true,
        preview: true,
      },
    });
  }

  return (
    <>
      {(!type || type == "premade-gift") && (
        <Suspense fallback={<Loading />}>
          <Premade_gift action={createNewPremade} variants={variants} />
        </Suspense>
      )}
      {type == "item" && (
        <Suspense fallback={"waiting create item ..."}>
          <Item action={createNewItem} />
        </Suspense>
      )}
      {type == "postcard" && (
        <Suspense fallback={"waiting PostCard..."}>
          <Postcard />
        </Suspense>
      )}
      {type == "variant" && (
        <Suspense fallback={"waiting variants..."}>
          <Variants />
        </Suspense>
      )}
    </>
  );
}
