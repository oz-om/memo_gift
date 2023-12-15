import { redirect } from "next/navigation";
import React from "react";
import Item from "./type/Item";
import Postcard from "./type/Postcard";
import Premade_gift from "./type/Premade_gift";
import { createNewItem, createNewPremade } from "../_actions/actions";

export default function AddPage({ searchParams: { type } }: { searchParams: { type: string } }) {
  if (type !== "premade-gift" && type !== "item" && type !== "postcard") {
    redirect("/dashboard/add?type=premade-gift");
  }

  return (
    <>
      {(!type || type == "premade-gift") && <Premade_gift action={createNewPremade} />}
      {type == "item" && <Item action={createNewItem} />}
      {type == "postcard" && <Postcard />}
    </>
  );
}
